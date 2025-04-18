import React, { useContext, useEffect, useState, useReducer } from 'react';
import { Button, Col, Form, Modal, Row, Spinner, Alert, Image } from 'react-bootstrap';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import ButtonM2 from '../../shared/ui/buttons/button-m2';
import {
    updateProduct,
    fetchOneProduct,
    fetchTypes,
    fetchFactories,
    fetchFeaturesByTypeAndFactory,
    fetchCollections,
    fetchSubtypes
} from '../../entities/product/api/productApi';
import './EditProductForm.scss';

const EditProductForm = ({ show, onHide, product, onComplete }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [types, setTypes] = useState([]);
    const [factories, setFactories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [features, setFeatures] = useState([]);
    const [subtypes, setSubtypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        min_price: 0,
        description: '',
        width: 0,
        height: 0,
        depth: 0,
        typeId: '',
        subtypeId: '',
        factoryId: '',
        collectionId: '',
        productFeatures: []
    });
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState(null);

    // Загрузка данных при открытии формы
    useEffect(() => {
        if (show && product && product.id) {
            console.log('Loading product data for id:', product.id, 'type:', typeof product.id);
            // Сразу используем числовой формат ID
            const numericId = parseInt(product.id);
            if (!isNaN(numericId)) {
                loadData(numericId);
            } else {
                setError('Некорректный формат ID товара');
            }
        }
    }, [show, product]);

    // Загрузка деталей товара и справочных данных
    const loadData = async (productId) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Fetching product details for ID:', productId);
            const productDetails = await fetchOneProduct(productId);
            console.log('Received product details:', productDetails);
            
            const [typesData, factoriesData] = await Promise.all([
                fetchTypes(),
                fetchFactories()
            ]);
            
            setTypes(typesData);
            setFactories(factoriesData);
            
            // Загрузка подтипов для выбранного типа
            let subtypesData = [];
            if (productDetails.typeId) {
                subtypesData = await fetchSubtypes(productDetails.typeId);
                setSubtypes(subtypesData);
            }
            
            // Загрузка коллекций для выбранной фабрики
            let collectionsData = [];
            if (productDetails.factoryId) {
                collectionsData = await fetchCollections(productDetails.factoryId);
                setCollections(collectionsData);
            }
            
            // Загрузка характеристик для выбранного типа и фабрики
            let featuresData = [];
            if (productDetails.typeId && productDetails.factoryId) {
                featuresData = await fetchFeaturesByTypeAndFactory(productDetails.typeId, productDetails.factoryId);
                setFeatures(featuresData);
            }
            
            // Заполнение формы данными товара
            setFormData({
                name: productDetails.name || '',
                price: productDetails.price || 0,
                min_price: productDetails.min_price || 0,
                description: productDetails.description || '',
                width: productDetails.width || 0,
                height: productDetails.height || 0,
                depth: productDetails.depth || 0,
                typeId: productDetails.typeId || '',
                subtypeId: productDetails.subtypeId || '',
                factoryId: productDetails.factoryId || '',
                collectionId: productDetails.collectionId || '',
                productFeatures: productDetails.product_infos 
                    ? productDetails.product_infos.map(info => ({
                        featureId: info.featureId,
                        value: info.value,
                        name: info.feature?.name || ''
                    })) 
                    : []
            });
            
            console.log('Form data set:', {
                name: productDetails.name,
                price: productDetails.price,
                typeId: productDetails.typeId,
                factoryId: productDetails.factoryId,
                subtypeId: productDetails.subtypeId,
                collectionId: productDetails.collectionId,
                featuresCount: productDetails.product_infos?.length
            });
            
            // Установка изображений товара
            if (productDetails.images && productDetails.images.length > 0) {
                console.log('Setting images:', productDetails.images.length, 'images');
                setImages(productDetails.images.map(img => ({
                    ...img,
                    url: process.env.REACT_APP_API_URL + '/' + img.img
                })));
            } else {
                console.log('No images found for product');
                setImages([]);
            }
            
        } catch (error) {
            console.error('Ошибка при загрузке данных товара:', error);
            setError('Ошибка при загрузке данных товара: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Добавьте эту функцию для повторной попытки с другим форматом ID
    const tryAlternativeFormat = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Попробуем запросить с числовым ID без кавычек
            console.log('Попытка получения товара с альтернативным форматом ID:', parseInt(product.id));
            const productDetails = await fetchOneProduct(parseInt(product.id));
            
            if (productDetails) {
                console.log('Успешно получены данные товара с альтернативным форматом ID');
                
                // Остальной код загрузки - скопируйте из функции loadData()
                // ...
                
                // Установка данных формы
                setFormData({
                    name: productDetails.name || '',
                    price: productDetails.price || 0,
                    min_price: productDetails.min_price || 0,
                    description: productDetails.description || '',
                    width: productDetails.width || 0,
                    height: productDetails.height || 0,
                    depth: productDetails.depth || 0,
                    typeId: productDetails.typeId || '',
                    subtypeId: productDetails.subtypeId || '',
                    factoryId: productDetails.factoryId || '',
                    collectionId: productDetails.collectionId || '',
                    productFeatures: productDetails.product_infos 
                        ? productDetails.product_infos.map(info => ({
                            featureId: info.featureId,
                            value: info.value,
                            name: info.feature?.name || ''
                        })) 
                        : []
                });
                
                // Установка изображений
                if (productDetails.images && productDetails.images.length > 0) {
                    setImages(productDetails.images.map(img => ({
                        ...img,
                        url: process.env.REACT_APP_API_URL + '/' + img.img
                    })));
                }
            }
        } catch (error) {
            console.error('Ошибка при повторной попытке загрузки товара:', error);
            setError(`Не удалось загрузить данные товара. Пожалуйста, проверьте, существует ли товар с ID: ${product.id}`);
        } finally {
            setLoading(false);
        }
    };

    // Обработчик изменения типа товара
    const handleTypeChange = async (e) => {
        const typeId = e.target.value;
        setFormData(prev => ({ ...prev, typeId, subtypeId: '' }));
        
        if (typeId) {
            try {
                const subtypesData = await fetchSubtypes(typeId);
                setSubtypes(subtypesData);
                
                if (formData.factoryId) {
                    const featuresData = await fetchFeaturesByTypeAndFactory(typeId, formData.factoryId);
                    setFeatures(featuresData);
                }
            } catch (error) {
                console.error('Ошибка при загрузке подтипов:', error);
            }
        } else {
            setSubtypes([]);
        }
    };

    // Обработчик изменения фабрики
    const handleFactoryChange = async (e) => {
        const factoryId = e.target.value;
        setFormData(prev => ({ ...prev, factoryId, collectionId: '' }));
        
        if (factoryId) {
            try {
                const collectionsData = await fetchCollections(factoryId);
                setCollections(collectionsData);
                
                if (formData.typeId) {
                    const featuresData = await fetchFeaturesByTypeAndFactory(formData.typeId, factoryId);
                    setFeatures(featuresData);
                }
            } catch (error) {
                console.error('Ошибка при загрузке коллекций:', error);
            }
        } else {
            setCollections([]);
        }
    };

    // Обработчик изменения полей формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Обработчик изменения характеристик
    const handleFeatureChange = (featureId, value) => {
        setFormData(prev => {
            const updatedFeatures = [...prev.productFeatures];
            const index = updatedFeatures.findIndex(f => f.featureId === featureId);
            
            if (index !== -1) {
                updatedFeatures[index].value = value;
            } else {
                const feature = features.find(f => f.id === featureId);
                updatedFeatures.push({
                    featureId,
                    value,
                    name: feature?.name || ''
                });
            }
            
            return { ...prev, productFeatures: updatedFeatures };
        });
    };

    // Обработчик добавления новых изображений
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
        
        // Создаем URL для предпросмотра
        const fileURLs = files.map(file => URL.createObjectURL(file));
        setPreviewImages(fileURLs);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            // Создаем объект FormData для отправки файлов
            const formDataToSend = new FormData();
            
            // Добавляем основные поля
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('min_price', formData.min_price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('width', formData.width);
            formDataToSend.append('height', formData.height);
            formDataToSend.append('depth', formData.depth);
            formDataToSend.append('typeId', formData.typeId);
            formDataToSend.append('factoryId', formData.factoryId);
            
            if (formData.subtypeId) {
                formDataToSend.append('subtypeId', formData.subtypeId);
            }
            
            if (formData.collectionId) {
                formDataToSend.append('collectionId', formData.collectionId);
            }
            
            // Добавляем характеристики
            if (formData.productFeatures.length > 0) {
                formDataToSend.append('features', JSON.stringify(formData.productFeatures));
            }
            
            // Добавляем новые изображения, если они есть
            if (newImages.length > 0) {
                newImages.forEach(file => {
                    formDataToSend.append('images', file);
                });
            }
            
            // Отправляем запрос на обновление
            const result = await updateProduct(product.id, formDataToSend);
            console.log('Update result:', result);
            
            // Уведомляем родительский компонент об успешном обновлении
            if (onComplete) {
                onComplete();
            }
            
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error);
            alert('Произошла ошибка при обновлении товара: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Очистка URL объектов при размонтировании компонента
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
            dialogClassName="edit-product-form-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {product ? `Редактирование товара: ${product.name} (ID: ${product.id})` : 'Редактирование товара'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" />
                        <p className="mt-3">Загрузка данных товара...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">
                        {error}
                        <div className="mt-3 d-flex gap-2">
                            <Button 
                                variant="primary" 
                                onClick={loadData}
                            >
                                Попробовать снова
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                onClick={tryAlternativeFormat}
                            >
                                Альтернативный формат ID
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Название товара</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Цена</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Минимальная цена</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="min_price"
                                                value={formData.min_price}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ширина (см)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="width"
                                                value={formData.width}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Высота (см)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Длина (см)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="depth"
                                                value={formData.depth}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Тип</Form.Label>
                                    <Form.Select
                                        name="typeId"
                                        value={formData.typeId}
                                        onChange={handleTypeChange}
                                        required
                                    >
                                        <option value="">Выберите тип</option>
                                        {types.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                
                                {subtypes.length > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Подтип</Form.Label>
                                        <Form.Select
                                            name="subtypeId"
                                            value={formData.subtypeId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Выберите подтип</option>
                                            {subtypes.map(subtype => (
                                                <option key={subtype.id} value={subtype.id}>
                                                    {subtype.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Производитель</Form.Label>
                                    <Form.Select
                                        name="factoryId"
                                        value={formData.factoryId}
                                        onChange={handleFactoryChange}
                                        required
                                    >
                                        <option value="">Выберите производителя</option>
                                        {factories.map(factory => (
                                            <option key={factory.id} value={factory.id}>
                                                {factory.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                
                                {collections.length > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Коллекция</Form.Label>
                                        <Form.Select
                                            name="collectionId"
                                            value={formData.collectionId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Выберите коллекцию</option>
                                            {collections.map(collection => (
                                                <option key={collection.id} value={collection.id}>
                                                    {collection.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Описание</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Текущие изображения</Form.Label>
                                    <div className="current-images">
                                        {images.length > 0 ? (
                                            <div className="image-gallery">
                                                {images.map(img => (
                                                    <div key={img.id} className="image-item">
                                                        <Image 
                                                            src={img.url} 
                                                            thumbnail 
                                                            style={{ maxHeight: '100px' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted">Нет изображений</p>
                                        )}
                                    </div>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Заменить изображения (необязательно)</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Внимание! При загрузке новых изображений, все существующие изображения будут удалены.
                                    </Form.Text>
                                </Form.Group>
                                
                                {previewImages.length > 0 && (
                                    <div className="preview-images mb-3">
                                        <p>Предпросмотр новых изображений:</p>
                                        <div className="image-gallery">
                                            {previewImages.map((url, idx) => (
                                                <div key={idx} className="image-item">
                                                    <Image 
                                                        src={url} 
                                                        thumbnail 
                                                        style={{ maxHeight: '100px' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Характеристики</Form.Label>
                                    {features.length > 0 ? (
                                        features.map(feature => {
                                            const productFeature = formData.productFeatures.find(
                                                f => f.featureId === feature.id
                                            );
                                            
                                            return (
                                                <div key={feature.id} className="mb-2">
                                                    <Row className="align-items-center">
                                                        <Col xs={5}>
                                                            <Form.Label className="mb-0">
                                                                {feature.name}:
                                                            </Form.Label>
                                                        </Col>
                                                        <Col xs={7}>
                                                            <Form.Control
                                                                type="text"
                                                                value={productFeature?.value || ''}
                                                                onChange={(e) => handleFeatureChange(feature.id, e.target.value)}
                                                                placeholder={`Значение для ${feature.name}`}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-muted">
                                            Нет доступных характеристик для выбранного типа и производителя
                                        </p>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="secondary" onClick={onHide} className="me-2">
                                Отмена
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Spinner 
                                            as="span" 
                                            animation="border" 
                                            size="sm" 
                                            role="status" 
                                            aria-hidden="true" 
                                            className="me-2"
                                        />
                                        Сохранение...
                                    </>
                                ) : 'Сохранить'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditProductForm; 