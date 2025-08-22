import { useState, useEffect, useCallback, useRef } from 'react';

// Cache для хранения загруженных данных
const dataCache = new Map();
const cacheTimestamps = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export const useOptimizedData = (
    fetchFunction,
    dependencies = [],
    options = {}
) => {
    const {
        cacheKey,
        debounceDelay = 300,
        enableCache = true,
        staleWhileRevalidate = true,
        immediate = true
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const [isStale, setIsStale] = useState(false);
    
    const abortControllerRef = useRef(null);
    const debounceTimeoutRef = useRef(null);
    const mountedRef = useRef(true);

    // Проверка валидности кеша
    const isCacheValid = useCallback((key) => {
        if (!enableCache || !dataCache.has(key)) return false;
        
        const timestamp = cacheTimestamps.get(key);
        const now = Date.now();
        return (now - timestamp) < CACHE_DURATION;
    }, [enableCache]);

    // Получение данных из кеша
    const getCachedData = useCallback((key) => {
        if (!enableCache) return null;
        return dataCache.get(key);
    }, [enableCache]);

    // Сохранение данных в кеш
    const setCachedData = useCallback((key, data) => {
        if (!enableCache) return;
        
        dataCache.set(key, data);
        cacheTimestamps.set(key, Date.now());
        
        // Очистка старого кеша
        if (dataCache.size > 50) { // Ограничиваем размер кеша
            const firstKey = dataCache.keys().next().value;
            dataCache.delete(firstKey);
            cacheTimestamps.delete(firstKey);
        }
    }, [enableCache]);

    // Основная функция загрузки данных
    const fetchData = useCallback(async (showLoading = true) => {
        // Отменяем предыдущий запрос
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Создаем новый контроллер для отмены
        abortControllerRef.current = new AbortController();

        try {
            // Проверяем кеш
            if (cacheKey && enableCache) {
                const cached = getCachedData(cacheKey);
                
                if (cached) {
                    if (isCacheValid(cacheKey)) {
                        // Используем валидные данные из кеша
                        setData(cached);
                        setError(null);
                        if (showLoading) setLoading(false);
                        return cached;
                    } else if (staleWhileRevalidate) {
                        // Показываем устаревшие данные, пока загружаем новые
                        setData(cached);
                        setIsStale(true);
                    }
                }
            }

            if (showLoading && !isStale) {
                setLoading(true);
            }
            setError(null);

            // Выполняем запрос
            const result = await fetchFunction(abortControllerRef.current.signal);
            
            if (!mountedRef.current) return result;

            // Сохраняем в кеш
            if (cacheKey) {
                setCachedData(cacheKey, result);
            }

            setData(result);
            setIsStale(false);
            setError(null);
            
            return result;
        } catch (err) {
            if (!mountedRef.current) return;
            
            if (err.name === 'AbortError') {
                return; // Запрос был отменен
            }

            console.error('Data fetch error:', err);
            setError(err);
            
            // Если есть кешированные данные, используем их при ошибке
            if (cacheKey && enableCache) {
                const cached = getCachedData(cacheKey);
                if (cached && !data) {
                    setData(cached);
                    setIsStale(true);
                }
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [
        fetchFunction,
        cacheKey,
        enableCache,
        staleWhileRevalidate,
        getCachedData,
        setCachedData,
        isCacheValid,
        data,
        isStale
    ]);

    // Debounced версия fetchData
    const debouncedFetchData = useCallback((showLoading = true) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchData(showLoading);
        }, debounceDelay);
    }, [fetchData, debounceDelay]);

    // Ручной рефреш данных
    const refresh = useCallback((force = false) => {
        if (force && cacheKey) {
            dataCache.delete(cacheKey);
            cacheTimestamps.delete(cacheKey);
        }
        return fetchData(true);
    }, [fetchData, cacheKey]);

    // Предзагрузка данных
    const prefetch = useCallback(() => {
        return fetchData(false);
    }, [fetchData]);

    // Эффект для автоматической загрузки
    useEffect(() => {
        if (immediate) {
            if (debounceDelay > 0) {
                debouncedFetchData();
            } else {
                fetchData();
            }
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, dependencies);

    // Cleanup при размонтировании
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return {
        data,
        loading,
        error,
        isStale,
        refresh,
        prefetch,
        fetchData: debounceDelay > 0 ? debouncedFetchData : fetchData
    };
};

// Hook для пагинированных данных
export const usePaginatedData = (
    fetchFunction,
    dependencies = [],
    options = {}
) => {
    const [allPages, setAllPages] = useState(new Map());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    
    const {
        itemsPerPage = 20,
        ...otherOptions
    } = options;

    const paginatedFetch = useCallback(async (signal) => {
        const result = await fetchFunction(currentPage, itemsPerPage, signal);
        
        // Обновляем общий счетчик
        if (result.count !== undefined) {
            setTotalCount(result.count);
        }
        
        // Сохраняем страницу в Map
        setAllPages(prev => {
            const newMap = new Map(prev);
            newMap.set(currentPage, result.rows || result.data || result);
            return newMap;
        });
        
        return result;
    }, [fetchFunction, currentPage, itemsPerPage]);

    const optimizedData = useOptimizedData(
        paginatedFetch,
        [...dependencies, currentPage],
        {
            ...otherOptions,
            cacheKey: otherOptions.cacheKey ? `${otherOptions.cacheKey}_page_${currentPage}` : undefined
        }
    );

    const goToPage = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const hasNextPage = useCallback(() => {
        return currentPage < Math.ceil(totalCount / itemsPerPage);
    }, [currentPage, totalCount, itemsPerPage]);

    const hasPrevPage = useCallback(() => {
        return currentPage > 1;
    }, [currentPage]);

    return {
        ...optimizedData,
        currentPage,
        totalCount,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        goToPage,
        hasNextPage: hasNextPage(),
        hasPrevPage: hasPrevPage(),
        allPages: Array.from(allPages.values()).flat()
    };
}; 