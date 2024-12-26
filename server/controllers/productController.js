const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo, Image, Collection, Type, Factory, Feature} = require('../models/models');
const ApiError = require('../error/apiError');
const {Op} = require('sequelize');
const csv = require('csv-parser');
const fs = require('fs');

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
        try {
            if (!req.files || !req.files.file) {
                return next(ApiError.badRequest('Файл не найден'));
            }

            const file = req.files.file;
            const tempDir = path.resolve(__dirname, '..', 'temp');
            
            // Создаем директорию temp, если она не существует
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const tempPath = path.join(tempDir, file.name);
            
            // Сохраняем файл временно
            await file.mv(tempPath);
            
            const results = [];
            const errors = [];

            // Создаем Promise для обработки CSV
            await new Promise((resolve, reject) => {
                fs.createReadStream(tempPath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });

            // Удаляем временный файл
            fs.unlinkSync(tempPath);

            // Обрабатываем каждую строку
            for (const row of results) {
                try {
                    await Product.create({
                        name: row.name,
                        price: parseInt(row.price),
                        width: parseInt(row.width),
                        depth: parseInt(row.depth),
                        height: parseInt(row.height),
                        factoryId: parseInt(row.factoryId),
                        typeId: parseInt(row.typeId),
                        collectionId: row.collectionId ? parseInt(row.collectionId) : null
                    });
                } catch (error) {
                    errors.push(`Ошибка в строке ${results.indexOf(row) + 1}: ${error.message}`);
                }
            }

            res.json({
                success: true,
                imported: results.length - errors.length,
                errors
            });
        } catch (e) {
            // Если произошла ошибка, пытаемся удалить временный файл
            if (tempPath && fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new productController();
