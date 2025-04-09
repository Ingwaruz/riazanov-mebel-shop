import React from 'react';
import { Card, Button } from 'react-bootstrap';
import ButtonM2 from '../../../shared/ui/buttons/button-m2';
import './BasketSummary.scss';

const BasketSummary = ({ basketItems, onCheckout }) => {
    const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return (
        <Card className="basket-summary">
            <Card.Body>
                <h4 className="mb-4 main_font_color summary-title">Итого</h4>
                <div className="summary-item">
                    <span className="label">Товары ({totalItems})</span>
                    <span className="value">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="summary-item">
                    <span className="label">Доставка</span>
                    <span className="value">Бесплатно</span>
                </div>
                <hr />
                <div className="summary-total">
                    <span className="total-label">К оплате</span>
                    <span className="total-value">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="mt-4">
                    <ButtonM2 
                        width="100%"
                        onClick={onCheckout}
                        text="Оформить заказ"
                        disabled={basketItems.length === 0}
                    />
                </div>
                <div className="mt-3 text-center">
                    <small className="text-muted policy-note">
                        Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности
                    </small>
                </div>
            </Card.Body>
        </Card>
    );
};

export default BasketSummary;
