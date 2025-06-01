import React, { useEffect, useState, useContext } from 'react';
import { Card, Col, Image, Row, Breadcrumb, Toast, ToastContainer, Button } from "react-bootstrap";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from "../../../shared/config/route-constants";
import { productApi } from "../../../entities/product";
import '../../../app/styles/shared.scss';
import ButtonM1 from "../../../shared/ui/buttons/button-m1";
import TabList from '../../../widgets/TabList/TabList';
import "./ProductPage.scss";
import { Context } from '../../../index';

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || [];
    const [startIndex, setStartIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { basket } = useContext(Context);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTypeClick = (e, typeId) => {
        e.preventDefault();
        navigate(`${SHOP_ROUTE}?selectedType=${typeId}&applyFilter=true`);
    };

    const handleSubtypeClick = (e, typeId, subtypeId) => {
        e.preventDefault();
        navigate(`${SHOP_ROUTE}?selectedType=${typeId}&selectedSubtype=${subtypeId}&applyFilter=true`);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleAddToBasket = () => {
        basket.addItem(product);
        setShowToast(true);
    };

    const nextThumbnailSet = () => {
        if (startIndex + 4 < images.length) {
            setStartIndex(prevIndex => prevIndex + 4);
        }
    };

    const prevThumbnailSet = () => {
        if (startIndex - 4 >= 0) {
            setStartIndex(prevIndex => prevIndex - 4);
        }
    };

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await productApi.fetchOneProduct(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setError("Не удалось загрузить данные продукта.");
                setProduct({ info: [] });
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isFullscreen) {
                if (e.key === 'ArrowRight') {
                    nextImage();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'Escape') {
                    setIsFullscreen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, nextImage, prevImage]);

    if (loading) return <div className="mt-5 container-fluid xl-text justify-content-center">Загрузка...</div>;
    if (error) return <div className="mt-5 container-fluid xl-text justify-content-center">{error}</div>;

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
                            <span className="characteristic-key">
                                {product.factory && product.factory.name === 'GENIUSPARK' ? 'Глубина' : 'Длина'}
                            </span>
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
                            <pre style={{ 
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                fontFamily: 'inherit',
                                margin: 0,
                                backgroundColor: 'transparent',
                                lineHeight: '1.4'
                            }}>
                                {product.description?.split('\n\n').join('\n')}
                            </pre>
                        </Col>
                    )}
                </>
            )
        },
    ];

    return (
        <div className="container-fluid product-page">
            {isFullscreen && (
                <div className="fullscreen-modal" onClick={() => setIsFullscreen(false)}>
                    <img
                        className="fullscreen-image"
                        src={`${process.env.REACT_APP_API_URL}/${images[currentImageIndex].img}`}
                        alt="Полноэкранное изображение"
                        onClick={e => e.stopPropagation()}
                    />
                    <i className="fas fa-times close-button" onClick={() => setIsFullscreen(false)}></i>
                    {images.length > 1 && (
                        <>
                            <i
                                className="fas fa-angle-left fullscreen-nav left"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                            ></i>
                            <i
                                className="fas fa-angle-right fullscreen-nav right"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                            ></i>
                        </>
                    )}
                </div>
            )}

            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1500 }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
                    <Toast.Header>
                        <strong className="me-auto">Корзина</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">Товар "{product.name}" добавлен в корзину!</Toast.Body>
                </Toast>
            </ToastContainer>

            <Row className="product-content">
                <Col xs={12}>
                    <Breadcrumb className="mt-3 mb-3">
                        <Breadcrumb.Item className="m-text" linkAs={Link} linkProps={{ to: SHOP_ROUTE }}>
                            Главная
                        </Breadcrumb.Item>
                        {product.type && (
                            <Breadcrumb.Item 
                                className="m-text"
                                onClick={(e) => handleTypeClick(e, product.type.id)}
                                href="#"
                            >
                                {product.type.name}
                            </Breadcrumb.Item>
                        )}
                        {product.subtype && (
                            <Breadcrumb.Item 
                                className="m-text"
                                onClick={(e) => handleSubtypeClick(e, product.type.id, product.subtype.id)}
                                href="#"
                            >
                                {product.subtype.name}
                            </Breadcrumb.Item>
                        )}
                    </Breadcrumb>
                    
                    <h1 className="product-title mb-4">{product.name || 'Название отсутствует'}</h1>
                </Col>
                
                <Col xs={12} lg={9} className="product-gallery mb-4">
                    <div className="main-image-container">
                        {images.length > 0 ? (
                            <>
                                <Image
                                    src={`${process.env.REACT_APP_API_URL}/${images[currentImageIndex].img}`}
                                    alt={product.name}
                                    fluid
                                    className="main-product-image"
                                    onClick={() => setIsFullscreen(true)}
                                />
                                <Button 
                                    variant="light" 
                                    className="magnifier-btn"
                                    onClick={() => setIsFullscreen(true)}
                                >
                                    <i className="fas fa-search-plus"></i>
                                </Button>
                            </>
                        ) : (
                            <div className="no-image">Нет изображений</div>
                        )}
                    </div>
                    
                    {images.length > 1 && (
                        <div className="thumbnails-container">
                            <div className="thumbnails-nav">
                                {startIndex > 0 && (
                                    <Button 
                                        variant="light" 
                                        className="thumbnail-nav-btn prev"
                                        onClick={prevThumbnailSet}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </Button>
                                )}
                                
                                <div className="thumbnails-wrapper">
                                    {images.slice(startIndex, isMobile ? startIndex + 3 : startIndex + 4).map((image, index) => (
                                        <div
                                            key={startIndex + index}
                                            className={`thumbnail-item ${currentImageIndex === startIndex + index ? "active" : ""}`}
                                            onClick={() => handleThumbnailClick(startIndex + index)}
                                        >
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/${image.img}`}
                                                alt={`Миниатюра ${startIndex + index + 1}`}
                                                className="thumbnail-image"
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {startIndex + (isMobile ? 3 : 4) < images.length && (
                                    <Button 
                                        variant="light" 
                                        className="thumbnail-nav-btn next"
                                        onClick={nextThumbnailSet}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </Col>
                
                <Col xs={12} lg={3} className="product-info mb-4">
                    <Card className="product-card">
                        <Card.Body>
                            {product.min_price > 0 && (
                                <h2 className="product-price mb-2">{`От ${product.min_price.toLocaleString('ru-RU')} ₽`}</h2>
                            )}
                            {/* <h2 className="product-price mb-2">{`${product.price.toLocaleString('ru-RU')} ₽`}</h2> */}
                            
                            {/* {product.min_price > 0 && (
                                <p className="starting-price mb-3">
                                    {`От ${product.min_price.toLocaleString('ru-RU')} ₽`}
                                </p>
                            )} */}
                            
                            <p className="price-note mb-3">
                                Цена товара зависит от выбранной ткани и может отличаться от указанной
                            </p>
                            
                            <div className="product-details mb-4">
                                {product.factory && (
                                    <div className="detail-item">
                                        <span className="detail-label">Производитель</span>
                                        <span className="detail-value">{product.factory.name}</span>
                                    </div>
                                )}
                                
                                {product.product_infos?.find(info => 
                                    info.feature?.name.toLowerCase() === 'материал' && 
                                    info.value && 
                                    info.value !== '0'
                                ) && (
                                    <div className="detail-item">
                                        <span className="detail-label">Материал</span>
                                        <span className="detail-value">
                                            {product.product_infos.find(info => 
                                                info.feature?.name.toLowerCase() === 'материал'
                                            ).value}
                                        </span>
                                    </div>
                                )}
                                
                                {product.width > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">Размеры</span>
                                        <span className="detail-value">
                                            {`${product.width}x${product.depth}x${product.height} см`}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="d-flex justify-content-center mt-4">
                                <ButtonM1 
                                    text="Добавить в корзину" 
                                    onClick={handleAddToBasket}
                                    className="btn-add-to-cart"
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12}>
                    <div className="product-tabs">
                        <TabList tabs={tabs} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage; 