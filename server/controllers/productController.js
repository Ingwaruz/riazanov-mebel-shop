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

// В начале файла добавим маппинг колонок
const CSV_COLUMN_MAPPING = {
    // Игнорируемые колонки
    'web-scraper-order': null,
    'web-scraper-start-url': null,
    'product-href': null,
    'paginator': null,
    'unit': null,
    'guarantee': null,    // игнорируем, так как используем 'гарантия'
    'assembly': null,     // сборка будет игнорироваться
    
    // Основные поля
    'product': 'name',
    'type': 'type',
    'subtype': 'subtype',
    'name': 'name',
    'price': 'price',
    'min_price': 'min_price',
    'description': 'description',
    'collection': 'collection',
    'width': 'width',
    'depth': 'depth',
    'height': 'height',
    'factory': 'factory',
    'img-src': 'images',
    
    // Характеристики
    'материал': 'Материал',
    'цвет': 'Цвет',
    'гарантия': 'Гарантия',
    'опоры': 'Опоры'
};

// Обновляем маппинг характеристик
const FEATURE_MAPPING = {
    'материал': 'Материал',
    'цвет': 'Цвет',
    'гарантия': 'Гарантия',
    'опоры': 'Опоры'
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
        // Формируем полный URL
        let fullUrl = imageUrl;
        if (!imageUrl.startsWith('http')) {
            fullUrl = `https://geniuspark.ru${imageUrl}`;
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
    return parseInt(str.replace(/[^\d]/g, '')) || 0;
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
            const product = await Product.findOne({
                where: {id},
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
                return next(ApiError.badRequest('Продукт не найден'));
            }

            // Добавляем отладочный вывод
            console.log('Product details:', {
                id: product.id,
                name: product.name,
                type: product.type?.name,
                subtype: product.subtype?.name,
                images: product.images?.map(img => ({
                    id: img.id,
                    img: img.img,
                    fullUrl: `${process.env.PORT}/${img.img}`
                })),
                features: product.product_infos
            });

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
                    ['createdAt', 'DESC'],
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
                        mapHeaders: ({ header }) => {
                            console.log('Mapping header:', header);
                            return header.trim();
                        },
                        mapValues: ({ header, value }) => {
                            console.log(`Mapping value for ${header}:`, value);
                            return value.trim();
                        }
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
                            
                            // Создаем уникальный ключ на основе имени и коллекции
                            const productName = row['name'] || row['product'];
                            if (!productName) {
                                console.warn('Skipping row without product name:', row);
                                return;
                            }
                            
                            // Логируем значения для отладки
                            console.log('Product values:', {
                                name: productName,
                                collection: row['collection'],
                                price: row['price'],
                                min_price: row['min_price'],
                                description: row['description']?.substring(0, 50) + '...',
                                width: row['width'],
                                height: row['height'],
                                depth: row['depth']
                            });

                            const productKey = `${productName}_${row['collection'] || ''}`;

                            if (!productGroups.has(productKey)) {
                                // Обработка цен с логированием
                                const price = parsePrice(row['price']);
                                const minPrice = parsePrice(row['min_price']);
                                console.log('Parsed prices:', { price, minPrice });

                                // Обрабатываем описание, сохраняя переносы строк
                                const description = row['description'] ? row['description'].replace(/\\n/g, '\n') : '';

                                productGroups.set(productKey, {
                                    productData: {
                                        name: productName,
                                        description: description,
                                        price: price,
                                        min_price: minPrice,
                                        width: parseNumeric(row['width']),
                                        height: parseNumeric(row['height']),
                                        depth: parseNumeric(row['depth'])
                                    },
                                    factory: row['factory'] || '',
                                    type: row['type'] || '',
                                    subtype: row['subtype'] || '',
                                    collection: row['collection'] || '',
                                    characteristics: {
                                        [FEATURE_MAPPING['материал']]: row['материал'] || '',
                                        [FEATURE_MAPPING['цвет']]: row['цвет'] || '',
                                        [FEATURE_MAPPING['гарантия']]: row['гарантия'] || ''
                                    },
                                    images: new Set()
                                });

                                console.log('Created product group:', productKey);
                            }

                            // Добавляем URL изображения в Set
                            if (row['img-src']) {
                                const imageUrl = row['img-src'].trim();
                                if (imageUrl) {
                                    console.log(`Found image URL for ${productName}:`, imageUrl);
                                    productGroups.get(productKey).images.add(imageUrl);
                                }
                            }
                        } catch (error) {
                            console.error('Error processing row:', error);
                            console.error('Problematic row data:', row);
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
                    console.log('Product data:', data.productData);

                    const [factory] = await Factory.findOrCreate({
                        where: { name: data.factory }
                    });

                    const [type] = await Type.findOrCreate({
                        where: { name: data.type }
                    });

                    // Создаем подтип, если он есть
                    let subtypeId = null;
                    if (data.subtype) {
                        const [subtype] = await Subtype.findOrCreate({
                            where: { 
                                name: data.subtype,
                                typeId: type.id
                            }
                        });
                        subtypeId = subtype.id;
                    }

                    const [collection] = await Collection.findOrCreate({
                        where: { 
                            name: data.collection,
                            factoryId: factory.id
                        }
                    });

                    // Проверяем, существует ли уже такой продукт
                    let product = await Product.findOne({
                        where: {
                            name: data.productData.name,
                            collectionId: collection.id
                        }
                    });

                    if (!product) {
                        product = await Product.create({
                            ...data.productData,
                            factoryId: factory.id,
                            typeId: type.id,
                            subtypeId,
                            collectionId: collection.id,
                            price: data.productData.price,
                            min_price: data.productData.min_price
                        });

                        // Создаем характеристики
                        for (const [name, value] of Object.entries(data.characteristics)) {
                            if (value) {
                                console.log(`Creating feature: ${name} = ${value}`); // Отладочный вывод
                                try {
                                    const feature = await createFeatureIfNotExists(name, type.id, factory.id);
                                    await ProductInfo.create({
                                        productId: product.id,
                                        featureId: feature.id,
                                        value: value
                                    });
                                    console.log(`Successfully created feature: ${name} for product ${product.name}`);
                                } catch (error) {
                                    console.error(`Error creating feature ${name}:`, error);
                                }
                            }
                        }
                    }

                    // Обработка изображений
                    console.log(`Processing images for product ${data.productData.name}`);
                    console.log('Images to process:', Array.from(data.images));

                    let imageOrder = 0;
                    for (const imageUrl of data.images) {
                        try {
                            // Генерируем уникальное имя файла с сохранением расширения
                            const originalExt = path.extname(imageUrl) || '.webp';
                            const fileName = `${uuid.v4()}${originalExt}`;

                            console.log(`Downloading image: ${imageUrl}`);
                            
                            try {
                                await downloadImage(imageUrl, fileName);
                                
                                // Создаем запись в базе данных
                                const imageRecord = await Image.create({
                                    productId: product.id,
                                    img: fileName,
                                    order: imageOrder++
                                });

                                console.log('Created image record:', {
                                    id: imageRecord.id,
                                    productId: imageRecord.productId,
                                    img: imageRecord.img,
                                    order: imageRecord.order
                                });
                            } catch (downloadError) {
                                console.error(`Error downloading image: ${downloadError.message}`);
                                throw downloadError;
                            }
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
}

module.exports = new productController();
