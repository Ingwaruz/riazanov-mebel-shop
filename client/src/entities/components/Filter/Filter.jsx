import React, { useState, useEffect } from 'react';
import { Accordion, Form, Row, Col } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchTypes, fetchFactories, fetchFilteredProducts } from '../../../processes/productAPI';
import './filter.scss';

const Filter = ({ onFilterChange }) => {
    const [types, setTypes] = useState([]);
    const [factories, setFactories] = useState([]);
    const [sizeRange, setSizeRange] = useState({
        width: [0, 500],
        depth: [0, 500],
        height: [0, 500],
    });

    const [selectedType, setSelectedType] = useState(null);
    const [selectedFactory, setSelectedFactory] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [typesData, factoriesData] = await Promise.all([
                    fetchTypes(),
                    fetchFactories()
                ]);
                setTypes(typesData);
                setFactories(factoriesData);
            } catch (error) {
                console.error('Ошибка при загрузке данных фильтра:', error);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const applyFilters = async () => {
            const filters = {
                typeId: selectedType?.id,
                factoryId: selectedFactory?.id,
                size: JSON.stringify({
                    width: sizeRange.width,
                    depth: sizeRange.depth,
                    height: sizeRange.height
                })
            };
            
            try {
                const filteredProducts = await fetchFilteredProducts(filters);
                onFilterChange && onFilterChange(filteredProducts);
            } catch (error) {
                console.error('Ошибка при применении фильтров:', error);
            }
        };

        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [selectedType, selectedFactory, sizeRange, onFilterChange]);

    const handleRangeChange = (type, values) => {
        setSizeRange((prev) => ({ ...prev, [type]: values }));
    };

    return (
        <div className="filter-container">
            <Accordion defaultActiveKey="0" className='main_font_color'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
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

                {/* Size Section */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <span className="m-text main-font-color text-uppercase">Размеры</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {Object.entries(sizeRange).map(([type, values]) => (
                            <div key={type} className="mb-4">
                                <p className="m-text mb-1 text-capitalize">
                                    {type === "width" ? "Ширина" : type === "depth" ? "Глубина" : "Высота"}
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
                                        />
                                    </Col>
                                    <Col xs={12} className="mt-3">
                                        <Slider
                                            range
                                            min={0}
                                            max={500}
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
                    <Accordion.Header>
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
        </div>
    );
};

export default Filter;
