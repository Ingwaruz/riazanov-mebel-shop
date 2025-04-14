import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Breadcrumb } from "react-bootstrap";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from "../../../shared/config/route-constants";
import { productApi } from "../../../entities/product";
import '../../../app/styles/shared.scss';
import ButtonM1 from "../../../shared/ui/buttons/button-m1";
import TabList from '../../../widgets/TabList/TabList';
import "./ProductPage.scss";

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || [];
    const [startIndex, setStartIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
        if (index < startIndex) {
            setStartIndex(index);
        } else if (index >= startIndex + 5) {
            setStartIndex(index - 4);
        }
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
    }, [isFullscreen]);

    if (loading) return <div className="mt-5 container-fluid xl-text justify-content-center">Загрузка...</div>;
    if (error) return <div className="mt-5 container-fluid xl-text justify-content-center">{error}</div>;

    const tabs = [
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
        }
    ];

    return (
        <div className="container-fluid">
            {isFullscreen && (
                <div className="fullscreen-modal" onClick={() => setIsFullscreen(false)}>
                    <img
                        className="fullscreen-image"
                        src={`${process.env.REACT_APP_API_URL}${images[currentImageIndex].img}`}
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
            <Row className="d-flex mx-5">
                <Breadcrumb className="mt-3 p-0">
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
                <Row className="d-flex flex-column xxl-text mb-4">
                    {product.name || 'Название отсутствует'}
                </Row>
                <Col xs={12} sm={9} md={9} lg={9}>
                <div className="main-image-container mb-3 border-color_white position-relative">
                        {images.length > 0 ? (
                            <>
                                <Image
                                    src={process.env.REACT_APP_API_URL + images[currentImageIndex].img}
                                    alt={product.name}
                                    fluid
                                    className="main-product-image"
                                    onClick={() => setIsFullscreen(true)}
                                    style={{ cursor: 'pointer' }}
                                    onError={(e) => {
                                        console.error('Image load error:', e);
                                        console.log('Failed image URL:', process.env.REACT_APP_API_URL + images[currentImageIndex].img);
                                        console.log('Image object:', images[currentImageIndex]);
                                        console.log('API URL:', process.env.REACT_APP_API_URL);
                                    }}
                                />
                                <i
                                    className="fa-solid fa-magnifying-glass magnifier-icon"
                                    onClick={() => setIsFullscreen(true)}
                                ></i>
                            </>
                        ) : (
                            <div>Нет изображений</div>
                        )}
                    </div>
                    <div className="carousel-container w-35">
                        <div className="carousel-container w-15">
                            <div className="carousel-images mt-3 thumbnail-container">
                                {images.slice(startIndex, startIndex + 5).map((image, index) => (
                                    <div
                                        key={startIndex + index}
                                        onClick={() => handleThumbnailClick(startIndex + index)}
                                        className={`thumbnail ${currentImageIndex === startIndex + index ? "active" : ""}`}
                                    >
                                        <Image
                                            className="carousel-images"
                                            src={`${process.env.REACT_APP_API_URL}${image.img}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {images.length > 1 && (
                            <i
                                onClick={prevImage}
                                className="fa-2x fas fa-angle-left arrow-icon left-arrow main_font_color"
                            ></i>
                        )}

                        {images.length > 1 && (
                            <i
                                onClick={nextImage}
                                className="fa-2x fas fa-angle-right arrow-icon right-arrow main_font_color"
                            ></i>
                        )}
                    </div>
                    <div className="d-flex flex-column xl-text mt-5">
                        <TabList tabs={tabs} />
                    </div>
                </Col>
                <Col xs={12} sm={9} md={6} lg={3}>
                    <Card
                        style={{ boxShadow: '0px 0px 32px rgba(0, 0, 0, 0.08)' }}
                        className="border-white d-flex border-radius-0 p-2 sticky-card"
                    >
                        <div className="xxl-text">{`~ ${product.price.toLocaleString('ru-RU')} ₽`}</div>
                        {product.min_price > 0 && (
                            <div className="l-text mt-2 mb-1">
                                {`От ${product.min_price.toLocaleString('ru-RU')} ₽`}
                            </div>
                        )}
                        <div className="m-text mt-1">
                            Цена товара зависит от выбранной ткани и может отличаться от указанной
                        </div>
                        <div className="characteristics mt-3">
                            {product.factory && (
                                <div className="characteristic-item m-text">
                                    <span className="characteristic-key">Производитель</span>
                                    <span className="characteristic-separator"></span>
                                    <span className="characteristic-value">{product.factory.name}</span>
                                </div>
                            )}
                            {product.product_infos?.find(info => 
                                info.feature?.name.toLowerCase() === 'материал' && 
                                info.value && 
                                info.value !== '0'
                            ) && (
                                <div className="characteristic-item m-text">
                                    <span className="characteristic-key">Материал</span>
                                    <span className="characteristic-separator"></span>
                                    <span className="characteristic-value">
                                        {product.product_infos.find(info => 
                                            info.feature?.name.toLowerCase() === 'материал'
                                        ).value}
                                    </span>
                                </div>
                            )}
                            {product.width > 0 && (
                                <div className="characteristic-item m-text">
                                    <span className="characteristic-key">Ширина</span>
                                    <span className="characteristic-separator"></span>
                                    <span className="characteristic-value">{product.width} см</span>
                                </div>
                            )}
                            {product.depth > 0 && (
                                <div className="characteristic-item m-text">
                                    <span className="characteristic-key">Глубина</span>
                                    <span className="characteristic-separator"></span>
                                    <span className="characteristic-value">{product.depth} см</span>
                                </div>
                            )}
                            {product.height > 0 && (
                                <div className="characteristic-item m-text">
                                    <span className="characteristic-key">Высота</span>
                                    <span className="characteristic-separator"></span>
                                    <span className="characteristic-value">{product.height} см</span>
                                </div>
                            )}
                        </div>
                        <ButtonM1 text="Добавить в корзину" />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductPage; 