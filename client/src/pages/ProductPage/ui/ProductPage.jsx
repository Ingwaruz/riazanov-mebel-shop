import React, { useEffect, useState } from 'react';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../../../shared/config/route-constants';
import { productApi } from '../../../entities/product';
import { ProductGallery, ProductDetails } from '../../../features/product-view';
import TabList from '../../../widgets/TabList/TabList';
import './ProductPage.scss';

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleTypeClick = (e, typeId) => {
        e.preventDefault();
        navigate(`${SHOP_ROUTE}?selectedType=${typeId}&applyFilter=true`);
    };

    const handleSubtypeClick = (e, typeId, subtypeId) => {
        e.preventDefault();
        navigate(`${SHOP_ROUTE}?selectedType=${typeId}&selectedSubtype=${subtypeId}&applyFilter=true`);
    };

    const handleAddToCart = (product) => {
        // Логика добавления в корзину
        console.log('Добавление в корзину:', product);
    };

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await productApi.fetchOneProduct(id);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setError('Не удалось загрузить данные продукта.');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <div className="mt-5 container-fluid xl-text justify-content-center">Загрузка...</div>;
    if (error) return <div className="mt-5 container-fluid xl-text justify-content-center">{error}</div>;
    if (!product) return <div className="mt-5 container-fluid xl-text justify-content-center">Товар не найден</div>;

    const tabs = [
        {
            key: 'specifications',
            title: 'Характеристики',
            content: (
                <div className="characteristics">
                    {product.width > 0 && (
                        <div className="characteristic-item">
                            <span className="characteristic-key">Ширина</span>
                            <span className="characteristic-separator"></span>
                            <span className="characteristic-value">{product.width} см</span>
                        </div>
                    )}
                    {product.depth > 0 && (
                        <div className="characteristic-item">
                            <span className="characteristic-key">Глубина</span>
                            <span className="characteristic-separator"></span>
                            <span className="characteristic-value">{product.depth} см</span>
                        </div>
                    )}
                    {product.height > 0 && (
                        <div className="characteristic-item">
                            <span className="characteristic-key">Высота</span>
                            <span className="characteristic-separator"></span>
                            <span className="characteristic-value">{product.height} см</span>
                        </div>
                    )}
                    {product.product_infos?.map(info => (
                        info.value && info.value !== '0' && (
                            <div key={info.id} className="characteristic-item">
                                <span className="characteristic-key">
                                    {info.feature?.name.charAt(0).toUpperCase() + info.feature?.name.slice(1).toLowerCase()}
                                </span>
                                <span className="characteristic-separator"></span>
                                <span className="characteristic-value">{info.value}</span>
                            </div>
                        )
                    ))}
                </div>
            )
        },
        {
            key: 'description',
            title: 'Описание',
            content: (
                <>
                    {product.description && (
                        <Col className="mt-3" xs={12}>
                            <pre className="product-description">
                                {product.description?.split('\n\n').join('\n')}
                            </pre>
                        </Col>
                    )}
                </>
            )
        }
    ];

    return (
        <div className="container-fluid product-page product-page-container">
            <Row className="mx-5">
                <Breadcrumb className="mt-3 p-0">
                    <Breadcrumb.Item className="l-text" linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                        Главная
                    </Breadcrumb.Item>
                    {product.type && (
                        <Breadcrumb.Item 
                            className="l-text"
                            onClick={(e) => handleTypeClick(e, product.type.id)}
                            href="#"
                        >
                            {product.type.name}
                        </Breadcrumb.Item>
                    )}
                    {product.subtype && (
                        <Breadcrumb.Item 
                            className="l-text"
                            onClick={(e) => handleSubtypeClick(e, product.type.id, product.subtype.id)}
                            href="#"
                        >
                            {product.subtype.name}
                        </Breadcrumb.Item>
                    )}
                </Breadcrumb>
                
                <h1 className="product-title mb-4">{product.name || 'Название отсутствует'}</h1>
                
                <Row>
                    <Col lg={8} md={7} sm={12} className="mb-4">
                        <ProductGallery images={product.images} />
                        
                        <div className="mt-5">
                            <TabList tabs={tabs} />
                        </div>
                    </Col>
                    
                    <Col lg={4} md={5} sm={12}>
                        <ProductDetails product={product} onAddToCart={handleAddToCart} />
                    </Col>
                </Row>
            </Row>
        </div>
    );
};

export default ProductPage; 