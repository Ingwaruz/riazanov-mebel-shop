import React, { useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './ProductGallery.scss';

const ProductGallery = ({ images = [] }) => {
    const [mainImage, setMainImage] = useState(images.length > 0 ? images[0].img : '');

    const handleThumbnailClick = (image) => {
        setMainImage(image.img);
    };

    if (!images || images.length === 0) {
        return (
            <div className="main-image-container">
                <Image 
                    src="/no-image.png" 
                    alt="Изображение отсутствует" 
                    className="main-product-image" 
                />
            </div>
        );
    }

    return (
        <div className="product-gallery">
            <div className="main-image-container mb-3">
                <Image 
                    src={process.env.REACT_APP_API_URL + mainImage} 
                    alt="Основное изображение" 
                    className="main-product-image" 
                />
            </div>
            {images.length > 1 && (
                <Row className="thumbnails-container">
                    {images.map((image, index) => (
                        <Col key={index} xs={3} className="mb-2">
                            <div 
                                className={`thumbnail-wrapper ${image.img === mainImage ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(image)}
                            >
                                <Image 
                                    src={process.env.REACT_APP_API_URL + image.img} 
                                    alt={`Миниатюра ${index + 1}`}
                                    className="product-thumbnail"
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ProductGallery; 