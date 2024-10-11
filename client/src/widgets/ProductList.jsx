import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import ProductItem from "../entities/components/ProductItem";

const ProductList = observer(() => {
    const { product } = useContext(Context);

    return (
        <Row className="g-4 d-flex flex-wrap justify-content-start mt-3">
            {product.products.map(productItem => {
                // Находим фабрику по factoryId товара
                const productFactory = product.factories.find(f => f.id === productItem.factoryId);

                return (
                    <ProductItem
                        key={productItem.id}
                        price={productItem.price}
                        product={productItem}
                        factoryName={productFactory ? productFactory.name : "Неизвестная фабрика"}
                    />
                );
            })}
        </Row>
    );
});

export default ProductList;
