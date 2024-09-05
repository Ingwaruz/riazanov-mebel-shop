import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
    const { product } = useContext(Context)

    return (
        <Row className="g-4 d-flex flex-wrap justify-content-start mt-3">
            {product.products.map(product =>
                <ProductItem key={product.id} product={product}/>
            )}
        </Row>
    );
});

export default ProductList;