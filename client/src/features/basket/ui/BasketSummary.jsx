import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { CheckoutForm } from '../../checkout';
import './BasketSummary.scss';

const BasketSummary = ({ totalPrice, onCheckout }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = (formData) => {
        setLoading(true);
        try {
            onCheckout(formData);
            setShowModal(false);
        } finally {
            setLoading(false);
        }
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

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Оформление заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="mb-1">Сумма заказа:</div>
                                <div className="fw-bold fs-5">{totalPrice.toLocaleString('ru-RU')} ₽</div>
                            </div>
                        </div>
                    </div>
                    <CheckoutForm onSubmit={handleFormSubmit} loading={loading} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default BasketSummary;
