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
    
    // Характеристики
    'material': 'Материал',
    'комплектация': 'Комплектация',
    'country': 'Страна производства',
    'цвет': 'Цвет',
    'гарантия': 'Гарантия',
    'базовая-единица': 'Единица измерения',
    'img-src': 'images'
};

// Обновляем маппинг характеристик
const FEATURE_MAPPING = {
    'материал': 'Материал',
    'страна': 'Страна производства',
    'комплектация': 'Комплектация',
    'цвет': 'Цвет',
    'гарантия': 'Гарантия',
    'базовая-единица': 'Единица измерения'
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
                for (const image of imageFiles) {
                    let fileName = uuid.v4() + path.extname(image.name);
                    await image.mv(path.resolve(__dirname, '..', 'static', fileName)); // Сохраняем файл

                    // Сохраняем ссылку на изображение в таблицу `Images`
                    await Image.create({file: fileName, productId: product.id});
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
            limit = limit || 12;
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
                        required: false  // Делаем связь необязательной
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
                        required: false  // Делаем связь необязательной
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
                distinct: true  // Добавляем для корректного подсчета при использовании include
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
                        attributes: ['id', 'img'],
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
                        model: Factory
                    },
                    {
                        model: Collection,
                        as: 'collection'
                    }
                ]
            });

            if (!product) {
                return next(ApiError.badRequest('Продукт не найден'));
            }

            // Добавляем отладочный вывод
            console.log('Product details:', {
                id: product.id,
                name: product.name,
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
            let {typeId, factoryId, size} = req.query;
            
            const whereClause = {};
            
            if (typeId) {
                whereClause.typeId = typeId;
            }
            
            if (factoryId) {
                whereClause.factoryId = factoryId;
            }
            
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
                include: [
                    { 
                        model: Image,
                        as: 'images',
                        attributes: ['img'],
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
                distinct: true,
                order: [
                    ['createdAt', 'DESC']
                ]
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

    async importFromCsv(req, res, next) {
        let tempPath;
        try {
            if (!req.files || !req.files.file) {
                return next(ApiError.badRequest('Файл не был загружен'));
            }

            const file = req.files.file;
            tempPath = path.join(__dirname, '..', 'temp', file.name);
            
            await fsPromises.mkdir(path.join(__dirname, '..', 'temp'), { recursive: true });
            await file.mv(tempPath);

            const results = [];
            const errors = [];
            const productGroups = new Map();

            await new Promise((resolve, reject) => {
                fs.createReadStream(tempPath)
                    .pipe(csv())
                    .on('data', (row) => {
                        // Создаем уникальный ключ на основе имени и коллекции
                        const productName = row['name'] || row['product'];
                        const productKey = `${productName}_${row['collection']}`;

                        if (!productGroups.has(productKey)) {
                            // Обработка цен
                            const price = parsePrice(row['price']);
                            const minPrice = parsePrice(row['min_price']);
                            
                            // Используем минимальную цену, если она есть, иначе обычную
                            const finalPrice = minPrice || price;

                            productGroups.set(productKey, {
                                productData: {
                                    name: productName,
                                    description: row['description'] || '',
                                    price: finalPrice,
                                    min_price: parsePrice(row['min_price']),
                                    width: parseNumeric(row['width']),
                                    height: parseNumeric(row['height']),
                                    depth: parseNumeric(row['depth'])
                                },
                                factory: row['factory'],
                                type: row['type'],
                                subtype: row['subtype'],
                                collection: row['collection'],
                                characteristics: {
                                    [FEATURE_MAPPING['материал']]: row['материал'],
                                    [FEATURE_MAPPING['страна']]: row['страна'],
                                    [FEATURE_MAPPING['комплектация']]: row['комплектация'],
                                    [FEATURE_MAPPING['цвет']]: row['цвет'],
                                    [FEATURE_MAPPING['гарантия']]: row['гарантия'],
                                    [FEATURE_MAPPING['базовая-единица']]: row['базовая-единица']
                                },
                                images: new Set()
                            });
                        }

                        // Добавляем URL изображения в Set
                        if (row['img-src']) {
                            const imageUrl = row['img-src'].trim();
                            if (imageUrl) {
                                console.log(`Found image URL for ${productName}:`, imageUrl); // Отладочный вывод
                                productGroups.get(productKey).images.add(imageUrl);
                            }
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
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
                                    img: fileName
                                });

                                console.log('Created image record:', {
                                    id: imageRecord.id,
                                    productId: imageRecord.productId,
                                    img: imageRecord.img
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
            if (tempPath) {
                try {
                    await fsPromises.unlink(tempPath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new productController();
