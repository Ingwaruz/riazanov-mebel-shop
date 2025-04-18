import React, { useState } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import './BasketSummary.scss';

const BasketSummary = ({ totalPrice, onCheckout }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        comment: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCheckout(formData);
        setShowModal(false);
    };

    return (
        <>
            <Card className="basket-summary">
                <Card.Body>
                    <Card.Title>Итого</Card.Title>
                    <div className="d-flex justify-content-between mt-3 mb-3">
                        <span>Сумма заказа:</span>
                        <span className="fw-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Button 
                        variant="primary" 
                        className="w-100 mt-3 bg-main_color" 
                        onClick={() => setShowModal(true)}
                    >
                        Оформить заказ
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Оформление заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Адрес доставки</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Комментарий</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="mb-1">Сумма заказа:</div>
                                <div className="fw-bold fs-5">{totalPrice.toLocaleString('ru-RU')} ₽</div>
                            </div>
                            <Button variant="primary" type="submit" className="bg-main_color">
                                Подтвердить заказ
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default BasketSummary;
