import React, { useContext } from 'react';
import { Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import ProductItem from "../entities/components/ProductItem/ProductItem";

const ProductList = observer(() => {
    const { product } = useContext(Context);

    return (
        <Row className="d-flex">
            {product.products.map(product =>
                <ProductItem key={product.id} product={product}/>
            )}
        </Row>
    );
});

export default ProductList;
