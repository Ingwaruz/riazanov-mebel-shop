const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo, Image, Collection, Type, Factory, Feature, FeatureToTypeFactory, Subtype} = require('../models/models');
const ApiError = require('../error/apiError');
const {Op} = require('sequelize');
const csv = require('csv-parser');
const fsPromises = require('fs').promises;
const fs = require('fs');
const sequelize = require('sequelize');
const axios = require('axios');
const cheerio = require('cheerio');

// В начале файла добавим маппинг колонок
const CSV_COLUMN_MAPPING = {
    'name': 'name',
    'price': 'price',
    'min_price': 'min_price',
    'type': 'type',
    //'description': 'description',
    //'collection': 'collection',
    'width': 'width',
    'depth': 'depth',
    //'height': 'height',
    'images-src': 'images'
    //'factory': 'factory', // Фиксированное значение
    //'subtype': 'subtype', // Фиксированное значение
};

// Обновляем маппинг характеристик
const FEATURE_MAPPING = {
    'материал': 'материал',
    //'size-expand': 'размер упаковки',
    'размер-упаковки': 'размер упаковки',
    'вес-упаковки': 'вес упаковки',
    'раздвижение': 'раздвижение',
    'ton': 'тонировка'
};

// Выносим функцию за пределы класса
const createFeatureIfNotExists = async (featureName, typeId, factoryId) => {
    try {
        // Ищем существующую характеристику
        let feature = await Feature.findOne({
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('name')), 
                featureName.toLowerCase()
            )
        });

        // Если характеристики нет, создаем новую
        if (!feature) {
            feature = await Feature.create({
                name: featureName.toLowerCase()
            });
        }

        // Проверяем существование связи
        const existingLink = await FeatureToTypeFactory.findOne({
            where: {
                featureId: feature.id,
                typeId: typeId,
                factoryId: factoryId
            }
        });

        // Если связи нет, создаем её
        if (!existingLink) {
            await FeatureToTypeFactory.create({
                featureId: feature.id,
                typeId: typeId,
                factoryId: factoryId
            });
        }

        return feature;
    } catch (error) {
        console.error('Error creating feature:', error);
        throw error;
    }
};

const downloadImage = async (imageUrl, fileName) => {
    try {
        // Обеспечиваем HTTPS для всех URL
        let fullUrl = imageUrl;
        if (!imageUrl.startsWith('http')) {
            fullUrl = `https://sonum.ru/${imageUrl}`;
        } else if (imageUrl.startsWith('http://')) {
            // Заменяем HTTP на HTTPS для всех URL
            fullUrl = imageUrl.replace('http://', 'https://');
        }
        
        console.log('Downloading image from:', fullUrl); // Отладочный вывод

        const response = await axios({
            method: 'get',
            url: fullUrl,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const staticPath = path.resolve(__dirname, '..', 'static');
        if (!fs.existsSync(staticPath)) {
            await fsPromises.mkdir(staticPath, { recursive: true });
        }

        const filePath = path.resolve(staticPath, fileName);
        await fsPromises.writeFile(filePath, response.data);

        console.log(`Image saved successfully: ${fileName}`); // Отладочный вывод
        return fileName;
    } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error.message);
        throw error;
    }
};

// Функция для очистки и преобразования цены
const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    // Удаляем символ ₽, пробелы и 'от'
    return parseInt(priceStr.replace(/[₽\s]/g, '').replace('от', '')) || 0;
};

// Функция для очистки числовых значений
const parseNumeric = (str) => {
    if (!str) return 0;
    // Удаляем все нечисловые символы, включая единицы измерения
    return parseInt(str.replace(/[^\d]/g, '')) || 0;
};

// Функция для парсинга HTML и извлечения характеристик
const parseProductInfo = (html) => {
    const $ = cheerio.load(html);
    const features = {};
    let productWidth = null, productDepth = null, productHeight = null;

    // Проходим по всем блокам с характеристиками
    $('.table-characteristic__row').each((_, element) => {
        const key = $(element).find('.table-characteristic__col:first span').text().trim();
        const value = $(element).find('.table-characteristic__col:last span').text().trim();

        if (key && value) {
            processFeature(key, value);
        }
    });

    function processFeature(key, value) {
        // Проверяем стандартные размеры
        if (key.includes('Ширина')) {
            productWidth = parseNumeric(value);
        } else if (key.includes('Длина')) {
            productDepth = parseNumeric(value);
        } else if (key.includes('Высота') || key.includes('Высота матраса')) {
            productHeight = parseNumeric(value);
        } else {
            // Все остальные характеристики добавляем в features
            features[key] = value;
        }
    }

    return { features, width: productWidth, depth: productDepth, height: productHeight };
};

class productController {
    async create(req, res, next) {
        try {
            const {name, price, min_price, width, depth, height, factoryId, typeId, collectionId, description, features} = req.body;
            console.log('Creating product with data:', {
                name, price, min_price, width, depth, height, factoryId, typeId, collectionId, description
            });

            const product = await Product.create({
                name, 
                price, 
                min_price,
                width, 
                depth, 
                height, 
                factoryId, 
                typeId, 
                collectionId, 
                description
            });

            if (features) {
                const featuresData = JSON.parse(features);
                for (let feature of featuresData) {
                    await ProductInfo.create({
                        featureId: feature.featureId,
                        value: feature.value,
                        productId: product.id
                    });
                }
            }

            // Обработка изображений
            if (req.files && req.files.images) { // Проверяем наличие файлов
                // Проверяем, является ли `images` массивом (когда несколько файлов) или одним файлом
                const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

                // Сохраняем каждое изображение
                let order = 0;
                for (const image of imageFiles) {
                    let fileName = uuid.v4() + path.extname(image.name);
                    await image.mv(path.resolve(__dirname, '..', 'static', fileName)); // Сохраняем файл

                    // Сохраняем ссылку на изображение в таблицу `Images`
                    await Image.create({
                        img: fileName, 
                        productId: product.id,
                        order: order++
                    });
                }
            }

            return res.json(product);
        } catch (e) {
            console.error('Error creating product:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {factoryId, typeId, price, limit, page, size} = req.query;
            page = page || 1;
            limit = limit || 20;
            let offset = (page - 1) * limit;
            
            const whereClause = {};
            
            if (factoryId) whereClause.factoryId = factoryId;
            if (typeId) whereClause.typeId = typeId;
            
            if (size) {
                const {width, depth, height} = JSON.parse(size);
                if (width) {
                    whereClause.width = {
                        [Op.between]: width
                    };
                }
                if (depth) {
                    whereClause.depth = {
                        [Op.between]: depth
                    };
                }
                if (height) {
                    whereClause.height = {
                        [Op.between]: height
                    };
                }
            }

            const products = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                include: [
                    { 
                        model: Image, 
                        as: 'images',
                        required: false,
                        attributes: ['id', 'img', 'order']
                    },
                    { 
                        model: Type,
                        required: false
                    },
                    { 
                        model: Factory,
                        required: false
                    },
                    { 
                        model: Collection, 
                        as: 'collection',
                        required: false
                    },
                    {
                        model: ProductInfo,
                        as: 'product_infos',
                        required: false,
                        include: [
                            {
                                model: Feature,
                                required: false
                            }
                        ]
                    }
                ],
                order: [
                    ['typeId', 'ASC'],
                    ['id', 'DESC'],
                    [{ model: Image, as: 'images' }, 'order', 'ASC']
                ],
                distinct: true
            });

            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            console.log(`Получен запрос на товар с ID: ${id}, тип: ${typeof id}`);
            
            // Попробуем обработать id как number и как string
            let whereCondition = {};
            if (!isNaN(id)) {
                whereCondition = {
                    [Op.or]: [
                        { id: parseInt(id) },
                        { id: id.toString() }
                    ]
                };
            } else {
                whereCondition = { id };
            }
            
            const product = await Product.findOne({
                where: whereCondition,
                include: [
                    {
                        model: Image,
                        as: 'images',
                        attributes: ['id', 'img', 'order']
                    },
                    {
                        model: ProductInfo,
                        as: 'product_infos',
                        include: [{
                            model: Feature,
                            attributes: ['name']
                        }]
                    },
                    {
                        model: Type
                    },
                    {
                        model: Subtype
                    },
                    {
                        model: Factory
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    }
                ],
                order: [
                    [{ model: Image, as: 'images' }, 'order', 'ASC']
                ]
            });

            if (!product) {
                console.log(`Товар с ID ${id} не найден`);
                return next(ApiError.badRequest('Продукт не найден'));
            }

            console.log(`Товар с ID ${id} успешно найден`);
            return res.json(product);
        } catch (e) {
            console.error('Error in getOne:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    async getFiltered(req, res, next) {
        try {
            let {typeIds, factoryIds, size, price, limit, page, selectedSubtype} = req.query;
            page = page || 1;
            limit = limit || 20;
            let offset = (page - 1) * limit;
            
            const whereClause = {};
            
            // Обработка фильтрации по типам
            if (typeIds) {
                try {
                    const typeIdsArray = JSON.parse(typeIds);
                    if (Array.isArray(typeIdsArray) && typeIdsArray.length > 0) {
                        whereClause.typeId = {
                            [Op.in]: typeIdsArray
                        };
                    }
                } catch (error) {
                    console.error('Error parsing typeIds:', error);
                }
            }

            // Обработка фильтрации по фабрикам
            if (factoryIds) {
                try {
                    const factoryIdsArray = JSON.parse(factoryIds);
                    if (Array.isArray(factoryIdsArray) && factoryIdsArray.length > 0) {
                        whereClause.factoryId = {
                            [Op.in]: factoryIdsArray
                        };
                    }
                } catch (error) {
                    console.error('Error parsing factoryIds:', error);
                }
            }

            if (selectedSubtype) {
                whereClause.subtypeId = selectedSubtype;
            }
            
            if (size) {
                const {width, depth, height} = JSON.parse(size);
                
                if (width) {
                    whereClause.width = {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { [Op.between]: width },
                                    { [Op.ne]: 0 }
                                ]
                            },
                            { [Op.eq]: 0 }
                        ]
                    };
                }
                
                if (depth) {
                    whereClause.depth = {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { [Op.between]: depth },
                                    { [Op.ne]: 0 }
                                ]
                            },
                            { [Op.eq]: 0 }
                        ]
                    };
                }
                
                if (height) {
                    whereClause.height = {
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { [Op.between]: height },
                                    { [Op.ne]: 0 }
                                ]
                            },
                            { [Op.eq]: 0 }
                        ]
                    };
                }
            }

            if (price) {
                const [minPrice, maxPrice] = JSON.parse(price);
                whereClause[Op.or] = [
                    {
                        price: {
                            [Op.between]: [minPrice, maxPrice]
                        }
                    },
                    {
                        min_price: {
                            [Op.between]: [minPrice, maxPrice]
                        }
                    }
                ];
            }

            console.log('Applied filters:', whereClause); // Добавляем логирование

            const products = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                include: [
                    { 
                        model: Image,
                        as: 'images',
                        attributes: ['id', 'img', 'order'],
                        required: false
                    },
                    { 
                        model: Type,
                        required: false
                    },
                    { 
                        model: Factory,
                        required: false
                    },
                    { 
                        model: Collection,
                        as: 'collection',
                        required: false
                    }
                ],
                order: [
                    ['typeId', 'ASC'],
                    ['id', 'DESC'],
                    [{ model: Image, as: 'images' }, 'order', 'ASC']
                ],
                distinct: true
            });

            console.log('Products query result:', {
                count: products.count,
                sampleProduct: products.rows[0] ? {
                    id: products.rows[0].id,
                    name: products.rows[0].name,
                    images: products.rows[0].images
                } : null
            });

            return res.json(products);
        } catch (e) {
            console.error('Error in getFiltered:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    async getSizeRanges(req, res, next) {
        try {
            const products = await Product.findAll({
                attributes: ['width', 'depth', 'height']
            });

            // Получаем все значения размеров
            const widths = products.map(p => p.width).filter(w => w !== null);
            const depths = products.map(p => p.depth).filter(d => d !== null);
            const heights = products.map(p => p.height).filter(h => h !== null);

            // Находим минимальные и максимальные значения, исключая нули
            const result = {
                widths,
                depths,
                heights,
                minWidth: Math.min(...widths.filter(w => w > 0) || [0]),
                maxWidth: Math.max(...widths || [100]),
                minDepth: Math.min(...depths.filter(d => d > 0) || [0]),
                maxDepth: Math.max(...depths || [100]),
                minHeight: Math.min(...heights.filter(h => h > 0) || [0]),
                maxHeight: Math.max(...heights || [100])
            };

            return res.json(result);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async importFromCsv(req, res, next) {
        let tempPath;
        try {
            if (!req.files || !req.files.file) {
                return next(ApiError.badRequest('Файл не был загружен'));
            }

            // Создаем или находим временный тип для импорта
            const [tempType] = await Type.findOrCreate({
                where: { name: 'Без типа' }
            });

            const file = req.files.file;
            console.log('Received file:', {
                name: file.name,
                size: file.size,
                mimetype: file.mimetype
            });
            
            // Создаем временную директорию с уникальным именем
            const tempDir = path.join(__dirname, '..', 'temp', uuid.v4());
            tempPath = path.join(tempDir, file.name);
            
            try {
                // Создаем временную директорию рекурсивно
                await fsPromises.mkdir(tempDir, { recursive: true });
                
                // Перемещаем файл
                await file.mv(tempPath);
                
                // Проверяем, что файл существует и читаем его первые байты
                const stats = await fsPromises.stat(tempPath);
                console.log('File stats:', {
                    size: stats.size,
                    path: tempPath
                });
                
                // Читаем первые 1000 байт файла для проверки
                const buffer = Buffer.alloc(1000);
                const fd = await fsPromises.open(tempPath, 'r');
                const { bytesRead } = await fd.read(buffer, 0, 1000, 0);
                await fd.close();
                
                console.log('File preview:', buffer.toString('utf8', 0, bytesRead));
                
            } catch (err) {
                console.error('Error handling file:', err);
                // Если произошла ошибка при создании директории или перемещении файла,
                // попробуем использовать системную временную директорию
                tempPath = path.join(require('os').tmpdir(), `${uuid.v4()}_${file.name}`);
                await file.mv(tempPath);
            }

            const results = [];
            const errors = [];
            const productGroups = new Map();

            await new Promise((resolve, reject) => {
                console.log('Starting CSV parsing from:', tempPath);
                
                fs.createReadStream(tempPath, { encoding: 'utf8' })
                    .on('error', (error) => {
                        console.error('Error creating read stream:', error);
                        reject(error);
                    })
                    .pipe(csv({
                        escape: '"',
                        quote: '"',
                        raw: false,
                        skipLines: 0,
                        separator: ',',
                        newline: '\n',
                        strict: false,
                        relax_column_count: true,
                        trim: true,
                        skip_empty_lines: true,
                        mapHeaders: ({ header }) => header.trim(),
                        mapValues: ({ header, value }) => value.trim()
                    }))
                    .on('headers', (headers) => {
                        console.log('CSV Headers:', headers);
                    })
                    .on('error', (error) => {
                        console.error('Error reading CSV:', error);
                        reject(error);
                    })
                    .on('data', (row) => {
                        try {
                            console.log('Processing row:', row);
                            
                            const productName = row['name'];
                            if (!productName) {
                                console.warn('Skipping row without product name:', row);
                                return;
                            }

                            // Парсим HTML из поля all-info
                            let productData = {
                                name: productName,
                                price: parsePrice(row['price']),
                                min_price: 0,
                                width: 0,
                                depth: 0,
                                height: 0,
                                features: {}
                            };

                            if (row['all-info']) {
                                const parsedInfo = parseProductInfo(row['all-info']);
                                productData = {
                                    ...productData,
                                    width: parsedInfo.width || 0,
                                    depth: parsedInfo.depth || 0,
                                    height: parsedInfo.height || 0,
                                    features: parsedInfo.features
                                };
                            }

                            const productKey = productName;

                            if (!productGroups.has(productKey)) {
                                productGroups.set(productKey, {
                                    productData,
                                    images: new Set()
                                });
                            }

                            // Добавляем URL изображения
                            if (row['images-src']) {
                                const imageUrl = row['images-src'].trim();
                                if (imageUrl) {
                                    productGroups.get(productKey).images.add(imageUrl);
                                }
                            }

                        } catch (error) {
                            console.error('Error processing row:', error);
                            errors.push({
                                error: error.message,
                                row: row
                            });
                        }
                    })
                    .on('end', () => {
                        console.log('Finished parsing CSV. Products found:', productGroups.size);
                        resolve();
                    });
            });

            // Создаем товары
            for (const [key, data] of productGroups) {
                try {
                    console.log(`Processing product: ${key}`);

                    let factory = null;

                    if (data.productData.allInfo) {
                        const parsedInfo = parseProductInfo(data.productData.allInfo);
                        
                        // Определяем фабрику из характеристик
                        const factoryName = parsedInfo.features['Производитель'];
                        if (factoryName) {
                            [factory] = await Factory.findOrCreate({
                                where: { name: factoryName }
                            });
                        }
                    }

                    // Если фабрика не определена, используем значение по умолчанию
                    if (!factory) {
                        [factory] = await Factory.findOrCreate({
                            where: { name: 'Без производителя' }
                        });
                    }

                    // Проверяем, существует ли уже такой продукт
                    let product = await Product.findOne({
                        where: {
                            name: data.productData.name
                        }
                    });

                    if (!product) {
                        product = await Product.create({
                            name: data.productData.name,
                            price: data.productData.price,
                            min_price: data.productData.min_price,
                            width: data.productData.width,
                            depth: data.productData.depth,
                            height: data.productData.height,
                            factoryId: factory.id,
                            typeId: tempType.id // Добавляем временный тип
                        });

                        // Создаем характеристики
                        for (const [name, value] of Object.entries(data.productData.features)) {
                            if (value) {
                                try {
                                    // Создаем характеристику
                                    const feature = await createFeatureIfNotExists(name, tempType.id, factory.id);
                                    
                                    // Создаем связь с продуктом
                                    await ProductInfo.create({
                                        productId: product.id,
                                        featureId: feature.id,
                                        value: value
                                    });
                                } catch (error) {
                                    console.error(`Error processing feature ${name}:`, error);
                                    errors.push({
                                        productKey: key,
                                        feature: name,
                                        error: error.message
                                    });
                                }
                            }
                        }
                    }

                    // Обработка изображений
                    let imageOrder = 0;
                    for (const imageUrl of data.images) {
                        try {
                            const originalExt = path.extname(imageUrl) || '.webp';
                            const fileName = `${uuid.v4()}${originalExt}`;
                            
                            await downloadImage(imageUrl, fileName);
                            
                            await Image.create({
                                productId: product.id,
                                img: fileName,
                                order: imageOrder++
                            });
                        } catch (imgError) {
                            console.error(`Error processing image ${imageUrl}:`, imgError);
                            errors.push({
                                productKey: key,
                                imageUrl: imageUrl,
                                error: imgError.message
                            });
                        }
                    }

                    results.push({
                        success: true,
                        productId: product.id,
                        name: data.productData.name,
                        imagesCount: data.images.size
                    });

                } catch (error) {
                    console.error('Error processing product:', error);
                    errors.push({
                        productKey: key,
                        error: error.message
                    });
                }
            }

            await fsPromises.unlink(tempPath);

            res.json({
                success: true,
                processed: productGroups.size,
                successful: results.length,
                failed: errors.length,
                results,
                errors: errors.length ? errors : undefined
            });

        } catch (e) {
            console.error('Fatal import error:', e);
            next(ApiError.badRequest(e.message));
        } finally {
            // Очищаем временные файлы
            if (tempPath) {
                try {
                    await fsPromises.unlink(tempPath);
                    // Пытаемся удалить временную директорию, если она существует
                    const tempDir = path.dirname(tempPath);
                    if (tempDir.includes('temp')) {
                        await fsPromises.rmdir(tempDir);
                    }
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }
        }
    }

    async getPriceRange(req, res, next) {
        try {
            const products = await Product.findAll({
                attributes: ['price', 'min_price'],
                raw: true
            });

            // Собираем все ненулевые цены
            const allPrices = products.reduce((prices, product) => {
                if (product.price > 0) prices.push(product.price);
                if (product.min_price > 0) prices.push(product.min_price);
                return prices;
            }, []);

            // Если нет ненулевых цен, возвращаем значения по умолчанию
            if (allPrices.length === 0) {
                return res.json({
                    minPrice: 0,
                    maxPrice: 100000
                });
            }

            return res.json({
                minPrice: Math.min(...allPrices),
                maxPrice: Math.max(...allPrices)
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Добавляем метод для поиска товаров
    async searchProducts(req, res, next) {
        try {
            const { query, searchType } = req.query;
            
            if (!query) {
                return res.json({
                    count: 0,
                    rows: []
                });
            }
            
            let whereClause = {};
            
            if (searchType === 'id') {
                whereClause.id = query;
            } else {
                // Поиск по имени (частичное совпадение)
                whereClause.name = {
                    [Op.iLike]: `%${query}%`
                };
            }
            
            const products = await Product.findAndCountAll({
                where: whereClause,
                include: [
                    { 
                        model: Image,
                        as: 'images',
                        attributes: ['id', 'img', 'order'],
                        required: false
                    },
                    { 
                        model: Type,
                        required: false
                    },
                    { 
                        model: Factory,
                        required: false
                    },
                    { 
                        model: Collection,
                        as: 'collection',
                        required: false
                    }
                ],
                order: [
                    ['typeId', 'ASC'],
                    ['id', 'DESC'],
                    [{ model: Image, as: 'images' }, 'order', 'ASC']
                ],
                distinct: true,
                limit: 20
            });
            
            return res.json(products);
        } catch (e) {
            console.error('Ошибка при поиске товаров:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    // Метод для обновления товара
    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { 
                name, 
                price, 
                min_price, 
                width, 
                depth, 
                height, 
                factoryId, 
                typeId, 
                subtypeId,
                collectionId, 
                description, 
                features 
            } = req.body;
            
            // Находим продукт по ID
            const product = await Product.findByPk(id);
            
            if (!product) {
                return next(ApiError.badRequest('Продукт не найден'));
            }
            
            // Обновляем базовые данные продукта
            await product.update({
                name, 
                price, 
                min_price,
                width, 
                depth, 
                height, 
                factoryId, 
                typeId,
                subtypeId, 
                collectionId, 
                description
            });
            
            // Обновляем характеристики продукта
            if (features) {
                const featuresData = JSON.parse(features);
                
                // Удаляем старые характеристики
                await ProductInfo.destroy({
                    where: { productId: id }
                });
                
                // Добавляем новые характеристики
                for (let feature of featuresData) {
                    await ProductInfo.create({
                        featureId: feature.featureId,
                        value: feature.value,
                        productId: id
                    });
                }
            }
            
            // Обработка изображений
            if (req.files && req.files.images) {
                // Получаем текущие изображения продукта
                const currentImages = await Image.findAll({
                    where: { productId: id }
                });
                
                // Удаляем старые файлы из папки static
                for (const image of currentImages) {
                    const filePath = path.resolve(__dirname, '..', 'static', image.img);
                    try {
                        await fsPromises.unlink(filePath);
                    } catch (error) {
                        console.error(`Ошибка при удалении файла ${filePath}:`, error);
                    }
                }
                
                // Удаляем записи из базы данных
                await Image.destroy({
                    where: { productId: id }
                });
                
                // Загружаем новые изображения
                const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
                
                let order = 0;
                for (const image of imageFiles) {
                    let fileName = uuid.v4() + path.extname(image.name);
                    await image.mv(path.resolve(__dirname, '..', 'static', fileName));
                    
                    await Image.create({
                        img: fileName, 
                        productId: id,
                        order: order++
                    });
                }
            }
            
            return res.json({ 
                message: 'Продукт успешно обновлен', 
                id: product.id 
            });
        } catch (e) {
            console.error('Ошибка при обновлении товара:', e);
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new productController();
