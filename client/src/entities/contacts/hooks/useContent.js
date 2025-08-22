import { useState, useEffect } from 'react';
import { $host } from '../../../shared/api';

const useContent = (pageKey) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pageKey) {
            setLoading(false);
            return;
        }

        let mounted = true;

        const fetchContent = async () => {
            try {
                setLoading(true);
                const { data } = await $host.get(`/api/content/key/${pageKey}`);
                
                if (mounted) {
                    setContent(data);
                    setError(null);
                }
            } catch (err) {
                console.error(`Error fetching content for ${pageKey}:`, err);
                if (mounted) {
                    setError(err.message || 'Ошибка при загрузке контента');
                    
                    // Устанавливаем дефолтный контент для основных страниц
                    if (err.response?.status === 404) {
                        const defaultContent = getDefaultContent(pageKey);
                        if (defaultContent) {
                            setContent(defaultContent);
                            setError(null);
                        }
                    }
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchContent();

        return () => {
            mounted = false;
        };
    }, [pageKey]);

    return {
        content,
        loading,
        error,
        title: content?.title || '',
        body: content?.content || '',
        metaTitle: content?.meta_title || '',
        metaDescription: content?.meta_description || ''
    };
};

// Дефолтный контент для основных страниц
const getDefaultContent = (pageKey) => {
    const defaults = {
        about_us: {
            title: 'О нас',
            content: '<p>Информация о компании</p>',
            page_key: 'about_us'
        },
        delivery: {
            title: 'Доставка',
            content: '<p>Информация о доставке</p>',
            page_key: 'delivery'
        },
        payment: {
            title: 'Оплата',
            content: '<p>Информация об оплате</p>',
            page_key: 'payment'
        },
        warranty: {
            title: 'Гарантия',
            content: '<p>Информация о гарантии</p>',
            page_key: 'warranty'
        }
    };

    return defaults[pageKey] || null;
};

// Хук для получения всех страниц
export const useAllContent = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchPages = async () => {
            try {
                setLoading(true);
                const { data } = await $host.get('/api/content?active=true');
                
                if (mounted) {
                    setPages(data);
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching all content:', err);
                if (mounted) {
                    setError(err.message || 'Ошибка при загрузке страниц');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchPages();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        pages,
        loading,
        error
    };
};

export default useContent; 