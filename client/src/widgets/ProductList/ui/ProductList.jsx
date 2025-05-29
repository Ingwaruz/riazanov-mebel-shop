import React, { useContext, useEffect, useState } from 'react';
import { Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import ProductItem from "../../../entities/product/ui/ProductItem/ProductItem";
import './ProductList.scss';

export const ProductList = observer(() => {
    const { product } = useContext(Context);
    const [animationKey, setAnimationKey] = useState(0);

    // Обновляем ключ анимации при изменении списка товаров
    useEffect(() => {
        setAnimationKey(prev => prev + 1);
    }, [product.products]);

    // Если товары не найдены
    if (!product.products || product.products.length === 0) {
        return (
            <div className="empty-state" key={animationKey}>
                <div className="empty-state-content">
                    <h4>Товары не найдены</h4>
                    <p>Попробуйте изменить параметры фильтрации или поиска</p>
                </div>
            </div>
        );
    }

    return (
        <Row className="d-flex product-list" key={animationKey}>
            {product.products.map((product, index) =>
                <ProductItem 
                    key={product.id} 
                    product={product}
                    animationDelay={index * 100} // Задержка анимации для каждого товара
                />
            )}
        </Row>
    );
}); 