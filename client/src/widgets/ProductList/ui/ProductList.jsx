import React, { useContext } from 'react';
import { Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import ProductItem from "../../../entities/product/ui/ProductItem/ProductItem";
import './ProductList.scss';

export const ProductList = observer(() => {
    const { product } = useContext(Context);

    return (
        <Row className="d-flex product-list">
            {product.products.map(product =>
                <ProductItem key={product.id} product={product}/>
            )}
        </Row>
    );
}); 