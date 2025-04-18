import React, { useState, useEffect } from 'react';
import { Accordion, Form, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchTypes, fetchFactories, fetchFilteredProducts, fetchSizeRanges, fetchPriceRange } from '../../../features/product-filters/api/filterApi';
import './filter.scss';
import ButtonM3 from '../../../shared/ui/buttons/button-m3';

const Filter = ({ onFilterChange }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [factories, setFactories] = useState([]);
    const [sizeRange, setSizeRange] = useState({
        width: [0, 100],
        depth: [0, 100],
        height: [0, 100],
    });
    const [maxSizeRanges, setMaxSizeRanges] = useState({
        width: [0, 100],
        depth: [0, 100],
        height: [0, 100],
    });
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [maxPriceRange, setMaxPriceRange] = useState([0, 100000]);
    const [activeKeys, setActiveKeys] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [selectedFactories, setSelectedFactories] = useState(new Set());
    const [isFiltered, setIsFiltered] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Добавляем слушатель изменения размера окна
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Открываем первую вкладку только на десктопе при первой загрузке
            if (!mobile && activeKeys.length === 0) {
                setActiveKeys(['0']);
            }
        };

        window.addEventListener('resize', handleResize);
        // Инициализация при первой загрузке
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Загрузка начальных данных
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [typesData, factoriesData, sizeRanges, priceRanges] = await Promise.all([
                    fetchTypes(),
                    fetchFactories(),
                    fetchSizeRanges(),
                    fetchPriceRange()
                ]);
                
                setTypes(typesData);
                setFactories(factoriesData);
                
                // Устанавливаем начальные и максимальные значения размеров
                const initialRanges = {
                    width: [
                        sizeRanges.minWidth || Math.min(...sizeRanges.widths.filter(w => w > 0) || [0]), 
                        sizeRanges.maxWidth || Math.max(...sizeRanges.widths || [100])
                    ],
                    depth: [
                        sizeRanges.minDepth || Math.min(...sizeRanges.depths.filter(d => d > 0) || [0]), 
                        sizeRanges.maxDepth || Math.max(...sizeRanges.depths || [100])
                    ],
                    height: [
                        sizeRanges.minHeight || Math.min(...sizeRanges.heights.filter(h => h > 0) || [0]), 
                        sizeRanges.maxHeight || Math.max(...sizeRanges.heights || [100])
                    ]
                };
                setSizeRange(initialRanges);
                setMaxSizeRanges(initialRanges);

                const initialPriceRange = [priceRanges.minPrice, priceRanges.maxPrice];
                setPriceRange(initialPriceRange);
                setMaxPriceRange(initialPriceRange);

                // Применяем фильтры из URL только при первой загрузке
                if (isInitialLoad) {
                    const params = new URLSearchParams(location.search);
                    const typeId = params.get('selectedType');
                    const shouldApplyFilter = params.get('applyFilter') === 'true';

                    if (shouldApplyFilter && typeId) {
                        const selectedType = typesData.find(t => t.id === parseInt(typeId));
                        if (selectedType) {
                            setSelectedTypes(new Set([selectedType.id]));
                            setIsFiltered(true);
                            
                            const filters = {
                                typeIds: JSON.stringify([parseInt(typeId)])
                            };
                            
                            const subtypeId = params.get('selectedSubtype');
                            if (subtypeId) {
                                filters.selectedSubtype = subtypeId;
                            }

                            const filteredProducts = await fetchFilteredProducts(filters);
                            if (onFilterChange) {
                                onFilterChange(filteredProducts, filters);
                            }
                        }
                    }
                    setIsInitialLoad(false);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных фильтра:', error);
            }
        };
        loadInitialData();
    }, [location.search, isInitialLoad]);

    // Обработчик для управления открытыми вкладками
    const handleAccordionToggle = (eventKey) => {
        if (eventKey === null) return;
        
        setActiveKeys(prevKeys => {
            const isKeyIncluded = prevKeys.includes(eventKey);
            if (isKeyIncluded) {
                return prevKeys.filter(key => key !== eventKey);
            }
            return [...prevKeys, eventKey];
        });
    };

    // Обработчики для множественного выбора
    const handleTypeChange = (type) => {
        setSelectedTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type.id)) {
                newSet.delete(type.id);
            } else {
                newSet.add(type.id);
            }
            return newSet;
        });
    };

    const handleFactoryChange = (factory) => {
        setSelectedFactories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(factory.id)) {
                newSet.delete(factory.id);
            } else {
                newSet.add(factory.id);
            }
            return newSet;
        });
    };

    const resetFilters = async () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedTypes(new Set());
        setSelectedFactories(new Set());
        setSizeRange(maxSizeRanges);
        setPriceRange(maxPriceRange);
        setIsFiltered(false);
        setActiveKeys(['0']);
        
        const filters = {
            page: 1,
            limit: 20
        };
        
        try {
            const filteredProducts = await fetchFilteredProducts(filters);
            if (onFilterChange) {
                onFilterChange(filteredProducts, filters);
            }
        } catch (error) {
            console.error('Ошибка при сбросе фильтров:', error);
        }
    };

    const applyFilters = async () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Проверяем, есть ли выбранные фильтры
        const hasSelectedTypes = selectedTypes.size > 0;
        const hasSelectedFactories = selectedFactories.size > 0;
        const hasSizeFilter = !Object.values(sizeRange).every((range, index) => 
            range[0] === maxSizeRanges[Object.keys(sizeRange)[index]][0] && 
            range[1] === maxSizeRanges[Object.keys(sizeRange)[index]][1]
        );
        const hasPriceFilter = priceRange[0] !== maxPriceRange[0] || priceRange[1] !== maxPriceRange[1];

        // Если нет выбранных фильтров, сбрасываем всё
        if (!hasSelectedTypes && !hasSelectedFactories && !hasSizeFilter && !hasPriceFilter) {
            return resetFilters();
        }

        const filters = {
            typeIds: JSON.stringify(Array.from(selectedTypes)),
            factoryIds: JSON.stringify(Array.from(selectedFactories)),
            size: JSON.stringify({
                width: sizeRange.width,
                depth: sizeRange.depth,
                height: sizeRange.height
            }),
            price: JSON.stringify(priceRange),
            page: 1,
            limit: 20
        };
        
        try {
            const filteredProducts = await fetchFilteredProducts(filters);
            if (onFilterChange) {
                onFilterChange(filteredProducts, filters);
            }
            setIsFiltered(true);
        } catch (error) {
            console.error('Ошибка при применении фильтров:', error);
        }
    };

    const handleRangeChange = (type, values) => {
        setSizeRange((prev) => ({ ...prev, [type]: values }));
    };

    const handlePriceRangeChange = (values) => {
        setPriceRange(values);
    };

    return (
        <div className="filter-container mb-4">
            {isFiltered && (
                <div className="mb-3">
                    <ButtonM3 width="100%" onClick={resetFilters} text="Сбросить все фильтры" />
                </div>
            )}
            <Accordion activeKey={activeKeys} onSelect={handleAccordionToggle} alwaysOpen className='main_font_color'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header onClick={() => handleAccordionToggle("0")}>
                        <span className="m-text main-font-color text-uppercase">Категории товаров</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            {types.map((type) => (
                                <Form.Check
                                    key={type.id}
                                    type="checkbox"
                                    id={`type-${type.id}`}
                                    label={type.name}
                                    checked={selectedTypes.has(type.id)}
                                    onChange={() => handleTypeChange(type)}
                                    className="mb-2 m-text"
                                />
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header onClick={() => handleAccordionToggle("1")}>
                        <span className="m-text main-font-color text-uppercase">Цена</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="mb-4">
                            <Row className="align-items-center">
                                <Col xs={6} className="mb-2 s-text main_font_color">
                                    <Form.Control
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => handlePriceRangeChange([Number(e.target.value), priceRange[1]])}
                                        placeholder="Минимум"
                                        style={{ appearance: 'none' }}
                                        inputMode="numeric"
                                        min={maxPriceRange[0]}
                                        max={maxPriceRange[1]}
                                    />
                                </Col>
                                <Col xs={6} className="mb-2 s-text main_font_color">
                                    <Form.Control
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => handlePriceRangeChange([priceRange[0], Number(e.target.value)])}
                                        placeholder="Максимум"
                                        style={{ appearance: 'none' }}
                                        inputMode="numeric"
                                        min={maxPriceRange[0]}
                                        max={maxPriceRange[1]}
                                    />
                                </Col>
                                <Col xs={12} className="mt-3">
                                    <Slider
                                        range
                                        min={maxPriceRange[0]}
                                        max={maxPriceRange[1]}
                                        value={priceRange}
                                        onChange={handlePriceRangeChange}
                                        allowCross={false}
                                        trackStyle={[{ backgroundColor: '#36406D' }]}
                                        handleStyle={[
                                            { backgroundColor: '#fff', borderColor: '#36406D' },
                                            { backgroundColor: '#fff', borderColor: '#36406D' }
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Size Section */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header onClick={() => handleAccordionToggle("2")}>
                        <span className="m-text main-font-color text-uppercase">Размеры</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {Object.entries(sizeRange).map(([type, values]) => (
                            <div key={type} className="mb-4">
                                <p className="m-text mb-1">
                                    {type === "width" ? "Ширина, см" : type === "depth" ? "Длина, см" : "Высота, см"}
                                </p>
                                <Row className="align-items-center">
                                    <Col xs={6} className="mb-2 s-text main_font_color">
                                        <Form.Control
                                            type="number"
                                            value={values[0]}
                                            onChange={(e) => handleRangeChange(type, [Number(e.target.value), values[1]])}
                                            placeholder="Минимум"
                                            style={{ appearance: 'none' }}
                                            inputMode="numeric"
                                            min={maxSizeRanges[type][0]}
                                            max={maxSizeRanges[type][1]}
                                        />
                                    </Col>
                                    <Col xs={6} className="mb-2 s-text main_font_color">
                                        <Form.Control
                                            type="number"
                                            value={values[1]}
                                            onChange={(e) => handleRangeChange(type, [values[0], Number(e.target.value)])}
                                            placeholder="Максимум"
                                            style={{ appearance: 'none' }}
                                            inputMode="numeric"
                                            min={maxSizeRanges[type][0]}
                                            max={maxSizeRanges[type][1]}
                                        />
                                    </Col>
                                    <Col xs={12} className="mt-3">
                                        <Slider
                                            range
                                            min={maxSizeRanges[type][0]}
                                            max={maxSizeRanges[type][1]}
                                            value={values}
                                            onChange={(newValues) => handleRangeChange(type, newValues)}
                                            allowCross={false}
                                            trackStyle={[{ backgroundColor: '#36406D' }]}
                                            handleStyle={[
                                                { backgroundColor: '#fff', borderColor: '#36406D' },
                                                { backgroundColor: '#fff', borderColor: '#36406D' }
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header onClick={() => handleAccordionToggle("3")}>
                        <span className="m-text main-font-color text-uppercase">Производитель</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            {factories.map((factory) => (
                                <Form.Check
                                    key={factory.id}
                                    type="checkbox"
                                    id={`factory-${factory.id}`}
                                    label={factory.name}
                                    checked={selectedFactories.has(factory.id)}
                                    onChange={() => handleFactoryChange(factory)}
                                    className="mb-2 m-text"
                                />
                            ))}
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div className="mt-3 d-flex justify-content-center">
                <ButtonM3 width="100%" onClick={applyFilters} text="Применить фильтры" />
            </div>
        </div>
    );
};

export default Filter;
