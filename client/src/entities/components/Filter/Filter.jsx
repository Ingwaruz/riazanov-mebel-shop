import React, { useState } from 'react';
import { Accordion, Form, Row, Col, InputGroup } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './filter.scss';

const Filter = () => {
    const [sizeRange, setSizeRange] = useState({
        length: [0, 500],
        width: [0, 500],
        height: [0, 500],
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState({});

    const handleRangeChange = (type, values) => {
        setSizeRange((prev) => ({ ...prev, [type]: values }));
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const newSubcategories = {};
        ["Подкатегория 1", "Подкатегория 2"].forEach((subcategory) => {
            newSubcategories[subcategory] = true;
        });
        setSelectedSubcategories(newSubcategories);
    };

    const toggleSubcategory = (subcategory) => {
        setSelectedSubcategories((prev) => ({
            ...prev,
            [subcategory]: !prev[subcategory],
        }));
    };

    return (
        <div className="filter-container">
            <Accordion defaultActiveKey="0" className='main_font_color'>

                {/* Categories Section */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span className="m-text main-font-color text-uppercase">Категории товаров</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            {["Диваны", "Письки"].map((category, index) => (
                                <Accordion key={index} flush className="mb-2">
                                    <Accordion.Item eventKey={`category-${index}`}>
                                        <Accordion.Header>
                                            <span className="m-text main-font-color text-uppercase">
                                                <Form.Check
                                                    type="checkbox"
                                                    name="categories"
                                                    id={`category-${index}`}
                                                    label={category}
                                                    className="m-text d-inline-block me-2"
                                                    checked={selectedCategory === category}
                                                    onChange={() => handleCategorySelect(category)}
                                                />
                                            </span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {"Подкатегория 1 Подкатегория 2".split(" ").map((subcategory, subIndex) => (
                                                <Form.Check
                                                    type="checkbox"
                                                    id={`subcategory-${index}-${subIndex}`}
                                                    label={subcategory}
                                                    className="mb-2 s-text"
                                                    key={subIndex}
                                                    checked={selectedSubcategories[subcategory] || false}
                                                    onChange={() => toggleSubcategory(subcategory)}
                                                />
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
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
                        {["length", "width", "height"].map((type) => (
                            <div key={type} className="mb-4">
                                <p className="m-text mb-1 text-capitalize">
                                    {type === "length" ? "Длина" : type === "width" ? "Ширина" : "Высота"}
                                </p>
                                <Row className="align-items-center">
                                    <Col xs={6}  className="mb-2 s-text main_font_color">
                                        <Form.Control
                                            type="number"
                                            value={sizeRange[type][0]}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                handleRangeChange(type, [value, sizeRange[type][1]]);
                                            }}
                                            placeholder="Минимум"
                                            style={{ appearance: 'none' }}
                                            inputMode="numeric"
                                        />
                                    </Col>
                                    <Col xs={6} className="mb-2 s-text main_font_color">
                                        <Form.Control
                                            type="number"
                                            value={sizeRange[type][1]}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                handleRangeChange(type, [sizeRange[type][0], value]);
                                            }}
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
                                            value={sizeRange[type]}
                                            onChange={(values) => handleRangeChange(type, values)}
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

                {/* Material Section */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <span className="m-text main-font-color text-uppercase">Материал</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p className="m-text">Заготовка для материалов и тканей</p>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Manufacturer Section */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <span className="m-text main-font-color text-uppercase object-fit-contain">Производитель</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            {["Фабрика 1", "Фабрика 2", "Фабрика 3"].map((manufacturer, index) => (
                                <Form.Check
                                    type="checkbox"
                                    id={`manufacturer-${index}`}
                                    label={manufacturer}
                                    className="mb-2"
                                    key={index}
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
