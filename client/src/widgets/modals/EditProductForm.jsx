import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Container, Row, Col, Spinner, ListGroup, Alert } from 'react-bootstrap';
import { Context } from "../../index";
import {
  fetchOneProduct, 
  updateProduct,
  fetchTypes, 
  fetchFactories, 
  fetchSubtypesByType,
  fetchSubtypes,
  fetchCollections, 
  fetchFeatures,
  uploadAdminImage,
  deleteAdminImage 
} from '../../entities/product/api/productApi';
import './EditProductForm.scss';

const EditProductForm = ({ show, onHide, product: initialProduct, onComplete }) => {
  const { product: productStore } = useContext(Context);
  const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Состояния для списков и селектов
    const [types, setTypes] = useState([]);
    const [factories, setFactories] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
    const [collections, setCollections] = useState([]);
    const [features, setFeatures] = useState([]);

  // Состояние редактируемого товара
  const [product, setProduct] = useState({
    id: 0,
        name: '',
        price: 0,
    old_price: 0,
    in_stock: true,
    hit: false,
    new: false,
        typeId: '',
    factoryId: '',
        subtypeId: '',
        collectionId: '',
    discount: 0,
    img: [],
    info: []
  });

  // Состояния для полей характеристик
  const [featureId, setFeatureId] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  const [productFeatures, setProductFeatures] = useState([]);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [creatingFeature, setCreatingFeature] = useState(false);

    // Загрузка данных при открытии формы
    useEffect(() => {
    if (show) {
      loadData();
    }
  }, [show, initialProduct?.id]);

  // Логирование состояния характеристик при каждом изменении
  useEffect(() => {
    if (productFeatures && productFeatures.length > 0) {
      console.log('Текущие характеристики товара:', productFeatures);
    }
  }, [productFeatures]);

  // Загрузка подтипов при изменении типа товара
  useEffect(() => {
    if (show && product.typeId) {
      loadSubtypesByType(product.typeId);
    }
  }, [show, product.typeId]);

  // Загрузка всех необходимых данных для формы
  const loadData = async () => {
        setLoading(true);
    setLoadError(null);
        
        try {
      console.log('Начинаем загрузку данных для формы редактирования');
            
      // Загружаем все необходимые данные параллельно
      const [typesData, factoriesData, collectionsData, featuresData] = await Promise.all([
                fetchTypes(),
        fetchFactories(),
        fetchCollections(),
        fetchFeatures()
      ]);
      
      console.log('Загружены типы:', typesData?.length || 0);
      console.log('Загружены фабрики:', factoriesData?.length || 0);
      console.log('Загружены коллекции:', collectionsData?.length || 0);
      console.log('Загружены характеристики:', featuresData?.length || 0);
      
      setTypes(typesData || []);
      setFactories(factoriesData || []);
      setCollections(collectionsData || []);
      setFeatures(featuresData || []);
      
      // Если есть ID товара, загружаем данные товара
      if (initialProduct && initialProduct.id) {
        console.log('Загружаем товар по ID:', initialProduct.id);
        await loadProduct(initialProduct.id);
      }
        } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setLoadError('Не удалось загрузить необходимые данные. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

  // Загрузка товара по ID с повторной попыткой в альтернативном формате при необходимости
  const loadProduct = async (productId) => {
    console.log('Загрузка товара, ID:', productId, 'типа:', typeof productId);
    try {
      // Преобразуем ID в число, если он строка
      const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      console.log('Используем числовой ID:', numericId);
      
      const productData = await fetchOneProduct(numericId);
      if (productData) {
        console.log('Товар успешно загружен:', productData);
        console.log('Характеристики в ответе API:', productData.info);
        
        // Преобразуем характеристики товара для отображения в форме
        let mappedFeatures = [];
        
        // Проверяем разные форматы характеристик, которые могут прийти с сервера
        if (productData.info && productData.info.length > 0) {
          mappedFeatures = productData.info.map(item => ({
            id: item.id,
            featureId: item.featureId || item.feature_id,
            featureName: item.feature ? item.feature.name : (item.featureName || 'Неизвестная характеристика'),
            value: item.value || ''
          }));
        } else if (productData.product_infos && productData.product_infos.length > 0) {
          mappedFeatures = productData.product_infos.map(item => ({
            id: item.id,
            featureId: item.featureId || item.feature_id,
            featureName: item.feature ? item.feature.name : (item.featureName || 'Неизвестная характеристика'),
            value: item.value || ''
          }));
        }
        
        console.log('Преобразованные характеристики товара:', mappedFeatures);
        setProductFeatures(mappedFeatures);
        
        // Обновляем данные товара
        setProduct({
          ...productData,
          old_price: productData.old_price || 0,
          discount: productData.discount || 0,
          typeId: productData.typeId ? String(productData.typeId) : '',
          factoryId: productData.factoryId ? String(productData.factoryId) : '',
          subtypeId: productData.subtypeId ? String(productData.subtypeId) : '',
          collectionId: productData.collectionId ? String(productData.collectionId) : '',
          // Проверяем различные форматы хранения изображений в API
          img: productData.img || productData.images || []
        });
        
        // Сразу загружаем подтипы, если выбран тип
        if (productData.typeId) {
          loadSubtypesByType(productData.typeId);
        }
      } else {
        console.error('Товар не найден');
        throw new Error('Не удалось загрузить информацию о товаре');
      }
    } catch (error) {
      console.error('Ошибка при загрузке товара:', error);
      
      // Пробуем альтернативный формат ID
      if (typeof productId !== 'string') {
        console.log('Пробуем строковый ID:', String(productId));
        try {
          const productData = await fetchOneProduct(String(productId));
          if (productData) {
            console.log('Товар успешно загружен через строковый ID:', productData);
            console.log('Характеристики в ответе API (строковый ID):', productData.info);
            
            // Преобразуем характеристики товара для отображения в форме
            let mappedFeatures = [];
            
            // Проверяем разные форматы характеристик, которые могут прийти с сервера
            if (productData.info && productData.info.length > 0) {
              mappedFeatures = productData.info.map(item => ({
                id: item.id,
                featureId: item.featureId || item.feature_id,
                featureName: item.feature ? item.feature.name : (item.featureName || 'Неизвестная характеристика'),
                value: item.value || ''
              }));
            } else if (productData.product_infos && productData.product_infos.length > 0) {
              mappedFeatures = productData.product_infos.map(item => ({
                id: item.id,
                featureId: item.featureId || item.feature_id,
                featureName: item.feature ? item.feature.name : (item.featureName || 'Неизвестная характеристика'),
                value: item.value || ''
              }));
            }
            
            console.log('Преобразованные характеристики товара (строковый ID):', mappedFeatures);
            setProductFeatures(mappedFeatures);
            
            setProduct({
              ...productData,
              old_price: productData.old_price || 0,
              discount: productData.discount || 0,
              typeId: productData.typeId ? String(productData.typeId) : '',
              factoryId: productData.factoryId ? String(productData.factoryId) : '',
              subtypeId: productData.subtypeId ? String(productData.subtypeId) : '',
              collectionId: productData.collectionId ? String(productData.collectionId) : '',
              // Проверяем различные форматы хранения изображений в API
              img: productData.img || productData.images || []
            });
            
            if (productData.typeId) {
              loadSubtypesByType(productData.typeId);
            }
          } else {
            throw new Error('Не удалось загрузить информацию о товаре');
          }
        } catch (secondError) {
          console.error('Ошибка при использовании строкового ID:', secondError);
          setLoadError(`Не удалось загрузить товар с ID ${productId}.`);
        }
      } else {
        setLoadError(`Не удалось загрузить товар с ID ${productId}.`);
      }
    }
  };

  // Загрузка подтипов в зависимости от выбранного типа
  const loadSubtypesByType = async (typeId) => {
    try {
      if (!typeId) return;
      
      console.log('Загрузка подтипов для типа:', typeId);
      const data = await fetchSubtypesByType(typeId);
      console.log('Загружены подтипы:', data?.length || 0, data);
      
      if (Array.isArray(data) && data.length > 0) {
        setSubtypes(data);
      } else {
        // Если вернулся пустой массив, попробуем загрузить через запрос к обычным подтипам
        const backupData = await fetchSubtypes(typeId);
        console.log('Загружены подтипы через запасной метод:', backupData?.length || 0);
        setSubtypes(backupData || []);
      }
    } catch (error) {
      console.error('Ошибка при загрузке подтипов:', error);
      setSubtypes([]);
    }
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProduct({ ...product, [name]: checked });
    } else if (['price', 'old_price', 'discount'].includes(name)) {
      // Преобразование строки в число для числовых полей
      setProduct({ ...product, [name]: value === '' ? '' : Number(value) });
        } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // Добавление характеристики в товар
  const addFeature = () => {
    if (!featureId || !featureValue.trim()) {
      alert('Пожалуйста, выберите характеристику и укажите её значение');
      return;
    }

    // Находим выбранную характеристику в списке
    const selectedFeature = features.find(f => f.id === Number(featureId));
    if (!selectedFeature) {
      alert('Выбранная характеристика не найдена');
      return;
    }

    // Проверяем, не добавлена ли уже такая характеристика
    const exists = productFeatures.some(f => f.featureId === Number(featureId));
    if (exists) {
      alert('Эта характеристика уже добавлена к товару');
      return;
    }

    // Добавляем новую характеристику
    const newFeature = {
      featureId: Number(featureId),
      featureName: selectedFeature.name,
      value: featureValue
    };

    setProductFeatures([...productFeatures, newFeature]);
    setFeatureId('');
    setFeatureValue('');
  };

  // Создание новой характеристики (имитация)
  const createNewFeature = () => {
    if (!newFeatureName.trim()) {
      alert('Введите название характеристики');
      return;
    }

    // Добавляем в локальный список (в реальном приложении это был бы API запрос)
    const newFeature = {
      id: Date.now(), // временный ID
      name: newFeatureName
    };

    setFeatures([...features, newFeature]);
    setNewFeatureName('');
    setCreatingFeature(false);
    // После создания сразу выбираем эту характеристику
    setFeatureId(String(newFeature.id));
  };

  // Удаление характеристики
  const removeFeature = (indexToRemove) => {
    setProductFeatures(productFeatures.filter((_, index) => index !== indexToRemove));
  };

  // Добавление изображений
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setImagesUploading(true);
    
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      
      const response = await uploadAdminImage(formData);
      if (response && response.length) {
        setProduct({
          ...product,
          img: [...product.img, ...response]
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      alert('Не удалось загрузить изображения');
    } finally {
      setImagesUploading(false);
    }
  };

  // Удаление изображения
  const handleImageDelete = async (imageName) => {
    if (!window.confirm('Вы действительно хотите удалить это изображение?')) return;
    
    try {
      await deleteAdminImage(imageName);
      setProduct({
        ...product,
        img: product.img.filter(image => !image.includes(imageName))
      });
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      alert('Не удалось удалить изображение');
    }
  };

  // Сохранение изменений
    const handleSubmit = async (e) => {
        e.preventDefault();
    setSaveAttempted(true);
    setSaveError(null);

    // Валидация формы
    if (!product.name || !product.price || !product.typeId || !product.factoryId) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

        setSaving(true);
        
        try {
      // Подготавливаем характеристики в правильном формате
      const featuresForAPI = productFeatures.map(feature => ({
        featureId: feature.featureId,
        value: feature.value
      }));
      
      // Подготавливаем данные для сохранения
      const productData = {
        ...product,
        price: Number(product.price),
        old_price: Number(product.old_price) || 0,
        discount: Number(product.discount) || 0,
        typeId: Number(product.typeId),
        factoryId: Number(product.factoryId),
        subtypeId: product.subtypeId ? Number(product.subtypeId) : null,
        collectionId: product.collectionId ? Number(product.collectionId) : null,
        // Преобразуем массив характеристик в JSON-строку, как ожидает сервер
        features: JSON.stringify(featuresForAPI)
      };

      console.log('Сохранение товара (данные):', productData);
      console.log('ID товара:', productData.id, typeof productData.id);
      console.log('Характеристики (JSON):', productData.features);
      console.log('URL запроса:', `api/product/${productData.id}`);
      
      const updatedProduct = await updateProduct(productData);
      console.log('Ответ сервера:', updatedProduct);
      
      alert('Товар успешно обновлен');
      
            if (onComplete) {
                onComplete();
      } else {
        onHide();
            }
        } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
      console.error('Детали запроса:', error.request ? {
        method: error.request.method,
        url: error.request.responseURL,
        status: error.request.status
      } : 'Нет данных запроса');
      console.error('Ответ сервера:', error.response ? error.response.data : 'Нет ответа');
      
      setSaveError('Не удалось сохранить изменения: ' + 
                    (error.response ? `Ошибка ${error.response.status} - ${error.response.statusText}` : 
                    error.message || 'Неизвестная ошибка'));
        } finally {
            setSaving(false);
        }
    };

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
          {initialProduct && initialProduct.id 
            ? `Редактирование товара: ${product.name || `ID: ${initialProduct.id}`}` 
            : 'Новый товар'}
                </Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
        {loadError && (
          <Alert variant="danger">
            {loadError}
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="danger">
            {saveError}
          </Alert>
        )}
        
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" />
            <p className="mt-2">Загрузка данных...</p>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
            <Container fluid>
                        <Row>
                            <Col md={6}>
                  <h5>Основная информация</h5>
                                <Form.Group className="mb-3">
                    <Form.Label>Название товара *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                      value={product.name}
                                        onChange={handleInputChange}
                      isInvalid={saveAttempted && !product.name}
                                    />
                    <Form.Control.Feedback type="invalid">
                      Укажите название товара
                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Row>
                    <Col md={4}>
                                        <Form.Group className="mb-3">
                        <Form.Label>Цена (руб.) *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                          value={product.price}
                                                onChange={handleInputChange}
                          isInvalid={saveAttempted && !product.price}
                        />
                        <Form.Control.Feedback type="invalid">
                          Укажите цену
                        </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                        <Form.Label>Старая цена (руб.)</Form.Label>
                                            <Form.Control
                                                type="number"
                          name="old_price"
                          value={product.old_price}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                        <Form.Label>Скидка (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                          name="discount"
                          value={product.discount}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                  <Row>
                    <Col md={6}>
                                <Form.Group className="mb-3">
                        <Form.Label>Тип мебели *</Form.Label>
                                    <Form.Select
                                        name="typeId"
                          value={product.typeId}
                          onChange={(e) => {
                            handleInputChange(e);
                            loadSubtypesByType(e.target.value);
                          }}
                          isInvalid={saveAttempted && !product.typeId}
                                    >
                                        <option value="">Выберите тип</option>
                                        {types.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Выберите тип мебели
                        </Form.Control.Feedback>
                                </Form.Group>
                    </Col>
                    <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Подтип</Form.Label>
                                        <Form.Select
                                            name="subtypeId"
                          value={product.subtypeId || ''}
                                            onChange={handleInputChange}
                          disabled={!product.typeId || subtypes.length === 0}
                                        >
                                            <option value="">Выберите подтип</option>
                                            {subtypes.map(subtype => (
                            <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                    </Col>
                  </Row>
                                
                  <Row>
                    <Col md={6}>
                                <Form.Group className="mb-3">
                        <Form.Label>Фабрика *</Form.Label>
                                    <Form.Select
                                        name="factoryId"
                          value={product.factoryId || ''}
                          onChange={handleInputChange}
                          isInvalid={saveAttempted && !product.factoryId}
                        >
                          <option value="">Выберите фабрику</option>
                                        {factories.map(factory => (
                            <option key={factory.id} value={factory.id}>{factory.name}</option>
                                        ))}
                                    </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Выберите фабрику
                        </Form.Control.Feedback>
                                </Form.Group>
                    </Col>
                    <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Коллекция</Form.Label>
                                        <Form.Select
                                            name="collectionId"
                          value={product.collectionId || ''}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Выберите коллекцию</option>
                                            {collections.map(collection => (
                            <option key={collection.id} value={collection.id}>{collection.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="В наличии"
                          name="in_stock"
                          checked={product.in_stock}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Хит"
                          name="hit"
                          checked={product.hit}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                                <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Новинка"
                          name="new"
                          checked={product.new}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                    </Col>
                  </Row>
                            </Col>
                            
                            <Col md={6}>
                  <h5>Характеристики</h5>
                  
                  {/* Текущие характеристики товара */}
                  <div className="mb-4">
                    <h6>Текущие характеристики товара:</h6>
                    {productFeatures.length === 0 ? (
                      <p className="text-muted">Характеристики не добавлены</p>
                    ) : (
                      <ListGroup>
                        {productFeatures.map((feature, index) => (
                          <ListGroup.Item 
                            key={index}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <strong>{feature.featureName}:</strong> {feature.value}
                                                    </div>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeFeature(index)}
                            >
                              Удалить
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                                        )}
                                    </div>
                  
                  {/* Форма добавления характеристики */}
                  <div className="mb-4">
                    <h6>Добавить характеристику:</h6>
                    <Row className="mb-2">
                      <Col>
                        <Form.Group>
                          <Form.Label>Характеристика</Form.Label>
                          <Form.Select
                            value={featureId}
                            onChange={(e) => setFeatureId(e.target.value)}
                          >
                            <option value="">Выберите характеристику</option>
                            {features.map(feature => (
                              <option key={feature.id} value={feature.id}>
                                {feature.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col>
                        {!creatingFeature && (
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            className="mb-2"
                            onClick={() => setCreatingFeature(true)}
                          >
                            + Создать новую характеристику
                          </Button>
                        )}
                        
                        {creatingFeature && (
                          <div className="p-2 border rounded mb-3">
                            <h6>Новая характеристика</h6>
                            <Form.Group className="mb-2">
                              <Form.Control
                                type="text"
                                placeholder="Название характеристики"
                                value={newFeatureName}
                                onChange={(e) => setNewFeatureName(e.target.value)}
                              />
                            </Form.Group>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={createNewFeature}
                                className="bg-main_color"
                              >
                                Создать
                              </Button>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => setCreatingFeature(false)}
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Значение</Form.Label>
                          <Form.Control
                            type="text"
                            value={featureValue}
                            onChange={(e) => setFeatureValue(e.target.value)}
                            placeholder="Введите значение характеристики"
                          />
                                </Form.Group>
                      </Col>
                    </Row>
                    
                    <Button 
                      variant="primary" 
                      onClick={addFeature}
                      disabled={!featureId || !featureValue.trim()}
                      className="bg-main_color"
                    >
                      Добавить характеристику
                    </Button>
                  </div>
                  
                  <h5 className="mt-4">Изображения</h5>
                                <Form.Group className="mb-3">
                    <Form.Label>Загрузить изображения</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        multiple 
                      onChange={handleImageUpload}
                      disabled={imagesUploading}
                                    />
                                    <Form.Text className="text-muted">
                      Вы можете загрузить несколько изображений
                                    </Form.Text>
                                </Form.Group>
                                
                  {imagesUploading && (
                    <div className="text-center my-3">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Загрузка изображений...</span>
                                    </div>
                                )}
                                
                  <div className="product-images-container">
                    {product.img && product.img.length > 0 ? (
                      <Row>
                        {product.img.map((image, index) => (
                          <Col xs={6} md={4} key={index} className="mb-3">
                            <div className="position-relative">
                              <img
                                src={typeof image === 'string' 
                                  ? (image.includes('http') ? image : process.env.REACT_APP_API_URL + image)
                                  : (image.img ? process.env.REACT_APP_API_URL + image.img : '')}
                                alt={`Изображение ${index + 1}`}
                                className="img-thumbnail"
                                style={{ height: '150px', objectFit: 'cover' }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={() => handleImageDelete(
                                  typeof image === 'string' 
                                    ? image.split('/').pop() 
                                    : (image.img ? image.img.split('/').pop() : '')
                                )}
                              >
                                &times;
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                                    ) : (
                      <p className="text-muted">Нет загруженных изображений</p>
                                    )}
                  </div>
                            </Col>
                        </Row>
                        
              <Row className="mt-4">
                <Col className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    onClick={onHide} 
                    className="me-2"
                    disabled={saving}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={saving}
                    className="bg-main_color"
                  >
                    {saving ? (
                      <>
                        <Spinner 
                          as="span" 
                          animation="border" 
                          size="sm" 
                          role="status" 
                          aria-hidden="true" 
                          className="me-1"
                        />
                        Сохранение...
                      </>
                    ) : (
                      'Сохранить'
                    )}
                  </Button>
                </Col>
              </Row>
            </Container>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditProductForm; 