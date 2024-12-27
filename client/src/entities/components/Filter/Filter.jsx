import React, { useState, useEffect } from 'react';
import { Accordion, Form, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchTypes, fetchFactories, fetchFilteredProducts, fetchSizeRanges, fetchPriceRange } from '../../../processes/productAPI';
import './filter.scss';
import ButtonM2 from '../../../shared/ui/buttons/button-m2';
import ButtonM1 from '../../../shared/ui/buttons/button-m1';
import ButtonM3 from '../../../shared/ui/buttons/button-m3';

const Filter = ({ onFilterChange }) => {
    const location = useLocation();
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
    const [activeKeys, setActiveKeys] = useState(['0']); // Состояние для отслеживания открытых вкладок

    const [selectedType, setSelectedType] = useState(null);
    const [selectedFactory, setSelectedFactory] = useState(null);
    const [isFiltered, setIsFiltered] = useState(false);

    // Обработчик для управления открытыми вкладками
    const handleAccordionToggle = (eventKey) => {
        if (eventKey === null) return; // Игнорируем null
        
        setActiveKeys(prevKeys => {
            const isKeyIncluded = prevKeys.includes(eventKey);
            if (isKeyIncluded) {
                return prevKeys.filter(key => key !== eventKey);
            }
            return [...prevKeys, eventKey];
        });
    };

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
                
                // Устанавливаем начальные и максимальные значения размеров, игнорируя нулевые значения
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

                // Устанавливаем диапазон цен
                const initialPriceRange = [priceRanges.minPrice, priceRanges.maxPrice];
                setPriceRange(initialPriceRange);
                setMaxPriceRange(initialPriceRange);
            } catch (error) {
                console.error('Ошибка при загрузке данных фильтра:', error);
            }
        };
        loadInitialData();
    }, []);

    // Обработка начальных значений из URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeId = params.get('selectedType');
        const subtypeId = params.get('selectedSubtype');
        const shouldApplyFilter = params.get('applyFilter') === 'true';

        if (shouldApplyFilter && typeId) {
            const selectedType = types.find(t => t.id === parseInt(typeId));
            if (selectedType) {
                setSelectedType(selectedType);
                setIsFiltered(true);
            }
        }
    }, [location.search, types]);

    const resetFilters = async () => {
        setSelectedType(null);
        setSelectedFactory(null);
        setSizeRange(maxSizeRanges); // Сбрасываем к максимальным значениям
        setPriceRange(maxPriceRange); // Сбрасываем диапазон цен
        setIsFiltered(false);
        setActiveKeys(['0']); // Сбрасываем открытые вкладки к начальному состоянию
        
        // Вызываем API без фильтров
        const filters = {
            page: 1,
            limit: 20
        };
        
        try {
            const filteredProducts = await fetchFilteredProducts(filters);
            if (onFilterChange) {
                onFilterChange(filteredProducts, filters); // Передаем пустые фильтры
            }
        } catch (error) {
            console.error('Ошибка при сбросе фильтров:', error);
        }
    };

    const applyFilters = async () => {
        const filters = {
            typeId: selectedType?.id,
            factoryId: selectedFactory?.id,
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
                onFilterChange(filteredProducts, filters); // Передаем фильтры вместе с результатами
            }
            // Устанавливаем флаг, что применены фильтры
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
        <div className="filter-container">
            {isFiltered && (
                <div className="mb-3">
                    <ButtonM3 width="100%" onClick={resetFilters} text="Показать все товары" />
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
                                    checked={selectedType?.id === type.id}
                                    onChange={() => setSelectedType(selectedType?.id === type.id ? null : type)}
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
                                    {type === "width" ? "Ширина, см" : type === "depth" ? "Глубина, см" : "Высота, см"}
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
                                    checked={selectedFactory?.id === factory.id}
                                    onChange={() => setSelectedFactory(selectedFactory?.id === factory.id ? null : factory)}
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
