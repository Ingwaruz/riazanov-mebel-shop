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
    'product': 'name',        // название товара
    'type': 'type',          // тип товара
    'subtype': null,         // подтип (пока игнорируем)
    'name': 'name',          // альтернативное название
    'price': 'price',        // цена
    'min_price': 'min_price',// минимальная цена
    'description': 'description', // описание
    'collection': 'collection',   // коллекция
    'width': 'width',        // ширина
    'depth': 'depth',        // глубина
    'height': 'height',      // высота
    'factory': 'factory',    // производитель
    
    // Характеристики (будут обработаны отдельно)
    'material': null,        // материал
    'комплектация': null,    // комплектация
    'country': null,         // страна
    'цвет': null,           // цвет
    'гарантия': null,       // гарантия
    'базовая-единица': null, // базовая единица
    'img-src': null         // ссылки на изображения
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
        // Формируем полный URL, если это относительный путь
        const fullUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : `https://geniuspark.ru${imageUrl}`;

        const response = await axios({
            method: 'get',
            url: fullUrl,
            responseType: 'stream'
        });

        const staticPath = path.resolve(__dirname, '..', 'static');
        // Создаем папку static, если её нет
        if (!fs.existsSync(staticPath)) {
            await fsPromises.mkdir(staticPath, { recursive: true });
        }

        const filePath = path.resolve(staticPath, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error);
        throw error;
    }
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
                attributes: [
                    'id', 
                    'name', 
                    'price', 
                    'min_price',
                    'width', 
                    'depth', 
                    'height', 
                    'description'
                ],
                include: [
                    { 
                        model: ProductInfo, 
                        as: 'product_infos',
                        include: [
                            { model: Feature }
                        ]
                    },
                    { model: Image, as: 'images' },
                    { model: Collection, as: 'collection' }
                ]
            });

            if (!product) {
                throw ApiError.badRequest('Product not found');
            }

            return res.json(product);
        } catch (e) {
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
                    { model: Image, as: 'images' },
                    { model: Type },
                    { model: Factory },
                    { model: Collection, as: 'collection' }
                ]
            });

            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async importFromCsv(req, res, next) {
        if (!req.files || !req.files.file) {
            return next(ApiError.badRequest('No file uploaded'));
        }

        const file = req.files.file;
        const tempDir = path.resolve(__dirname, '..', 'temp');
        const tempPath = path.resolve(tempDir, `${Date.now()}_${file.name}`);
        const errors = [];
        const processedNames = new Set();

        try {
            await fsPromises.mkdir(tempDir, { recursive: true });
            await file.mv(tempPath);
            console.log('CSV file saved to:', tempPath);

            const results = await new Promise((resolve, reject) => {
                const results = [];
                fs.createReadStream(tempPath, { encoding: 'utf8' })
                    .pipe(csv({
                        separator: ',',
                        skipLines: 0,
                        headers: false,
                        trim: true
                    }))
                    .on('data', (data) => {
                        console.log('Raw CSV row data:', data);
                        if (Object.keys(data).length > 0) {
                            results.push(data);
                        }
                    })
                    .on('end', () => {
                        console.log('CSV parsing completed. Headers:', Object.keys(results[0] || {}));
                        console.log('First row data:', results[0]);
                        resolve(results);
                    })
                    .on('error', (error) => {
                        console.error('CSV parsing error:', error);
                        reject(error);
                    });
            });

            for (const rawRow of results) {
                try {
                    if (!rawRow || Object.keys(rawRow).length === 0) {
                        console.log('Empty row detected, skipping...');
                        continue;
                    }

                    console.log('Processing row:', rawRow);
                    
                    const row = {
                        name: rawRow['2'] || rawRow['7'],      // product или name
                        type: rawRow['5'],                     // type
                        factory: rawRow['17'],                 // factory
                        price: rawRow['8'],                    // price
                        min_price: rawRow['9'],                // min_price
                        width: rawRow['13'],                   // width
                        depth: rawRow['14'],                   // depth
                        height: rawRow['15'],                  // height
                        description: rawRow['10'],             // description
                        collection: rawRow['11']               // collection
                    };

                    // Добавим русские характеристики
                    const russianFeatures = {
                        'материал': rawRow['12'],      // Материал
                        'страна': rawRow['18'],        // Страна
                        'цвет': rawRow['19'],          // Цвет
                        'гарантия': rawRow['20'],      // Гарантия
                        'единица измерения': rawRow['21']  // Базовая единица
                    };

                    // Очистка значений от лишних символов
                    if (row.price) {
                        row.price = row.price.replace(/[^\d]/g, ''); // Оставляем только цифры
                    }
                    if (row.min_price) {
                        row.min_price = row.min_price.replace(/[^\d]/g, '').replace(/^от\s*/, ''); // Убираем "от" и оставляем только цифры
                    }
                    if (row.width) {
                        row.width = row.width.replace(/[^\d]/g, ''); // Убираем "см" и пробелы
                    }
                    if (row.depth) {
                        row.depth = row.depth.replace(/[^\d]/g, '');
                    }
                    if (row.height) {
                        row.height = row.height.replace(/[^\d]/g, '');
                    }

                    console.log('Mapped row data:', {
                        name: row.name,
                        type: row.type,
                        factory: row.factory,
                        price: row.price,
                        min_price: row.min_price,
                        width: row.width,
                        depth: row.depth,
                        height: row.height,
                        features: russianFeatures
                    });

                    if (!row.name || !row.type || !row.factory) {
                        throw new Error(`Missing required fields. Found in CSV: ${JSON.stringify({
                            name: row.name,
                            type: row.type,
                            factory: row.factory,
                            rawProduct: rawRow.product,
                            rawName: rawRow.name
                        })}`);
                    }

                    // Пропускаем дубликаты по имени
                    if (processedNames.has(row.name)) {
                        console.log(`Skipping duplicate product: ${row.name}`);
                        continue;
                    }

                    // Находим или создаем тип и подтип
                    const [type] = await Type.findOrCreate({
                        where: { name: row.type }
                    });
                    console.log('Type created/found:', type.name);

                    let subtype = null;
                    if (rawRow['6']) { // subtype находится в колонке 6
                        [subtype] = await Subtype.findOrCreate({
                            where: { 
                                name: rawRow['6'],
                                typeId: type.id 
                            }
                        });
                        console.log('Subtype created/found:', subtype.name);
                    }

                    // Находим или создаем фабрику
                    const [factory] = await Factory.findOrCreate({
                        where: { name: row.factory }
                    });
                    console.log('Factory created/found:', factory.name);

                    // Находим или создаем коллекцию
                    let collection = null;
                    if (row.collection) {
                        [collection] = await Collection.findOrCreate({
                            where: { 
                                name: row.collection,
                                factoryId: factory.id
                            }
                        });
                        console.log('Collection created/found:', collection?.name);
                    }

                    // Создаем продукт
                    const productData = {
                        name: row.name,
                        price: parseInt(row.price) || 0,
                        min_price: row.min_price ? parseInt(row.min_price) : null,
                        width: parseInt(row.width) || 0,
                        depth: parseInt(row.depth) || 0,
                        height: parseInt(row.height) || 0,
                        description: row.description,
                        factoryId: factory.id,
                        typeId: type.id,
                        subtypeId: subtype?.id,
                        collectionId: collection?.id
                    };

                    console.log('Creating product with data:', productData);
                    const product = await Product.create(productData);
                    console.log('Product created:', product.id);

                    // Обрабатываем характеристики
                    for (const featureName in russianFeatures) {
                        if (russianFeatures[featureName]) {
                            console.log(`Processing feature: ${featureName} = ${russianFeatures[featureName]}`);
                            const feature = await createFeatureIfNotExists(featureName, type.id, factory.id);
                            await ProductInfo.create({
                                productId: product.id,
                                featureId: feature.id,
                                value: russianFeatures[featureName]
                            });
                        }
                    }

                    // Добавляем изображения
                    const imagesDir = path.resolve(__dirname, '..', 'static', row.name);
                    console.log('Checking images directory:', imagesDir);
                    
                    if (fs.existsSync(imagesDir)) {
                        const files = fs.readdirSync(imagesDir);
                        console.log(`Found ${files.length} images for product`);
                        
                        for (const file of files) {
                            await Image.create({
                                file: file,
                                productId: product.id
                            });
                            console.log('Image added:', file);
                        }
                    }

                    if (rawRow['22']) { // Ссылка на картинку находится в колонке 22
                        const imageUrl = rawRow['22'];
                        const fileName = `${uuid.v4()}${path.extname(imageUrl)}`;
                        
                        try {
                            // Скачиваем и сохраняем изображение
                            await downloadImage(imageUrl, fileName);
                            
                            // Создаем запись в базе данных
                            await Image.create({
                                file: fileName,
                                productId: product.id
                            });
                            console.log('Image downloaded and saved:', fileName);
                        } catch (error) {
                            console.error('Error processing image:', error);
                            // Продолжаем импорт даже если с картинкой проблема
                        }
                    }

                    processedNames.add(row.name);
                    console.log(`Successfully processed product: ${row.name}`);
                } catch (error) {
                    console.error('Row processing error:', error);
                    errors.push(`Ошибка в строке ${results.indexOf(rawRow) + 1}: ${error.message}`);
                }
            }

            // Очистка временного файла
            await fsPromises.unlink(tempPath);

            const response = {
                success: true,
                imported: processedNames.size,
                errors: errors.length ? errors : undefined
            };
            console.log('Import completed:', response);
            res.json(response);

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
