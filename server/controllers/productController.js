const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo, Image, Collection} = require('../models/models');
const ApiError = require('../error/apiError');

class productController {
    async create(req, res, next) {
        try {
            let {name, price, width, depth, height, factoryId, typeId, collectionId, info} = req.body;
            const {images} = req.files; // Здесь мы принимаем файлы

            // Создание товар
            const product = await Product.create({name, price, width, depth, height, factoryId, typeId, collectionId});

            // Если есть дополнительные данные о продукте (info)
            if (info) {
                info = JSON.parse(info);
                info.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id,
                    })
                );
            }

            // Обработка изображений
            if (images) {
                // Проверяем, является ли `images` массивом (когда несколько файлов) или одним файлом
                const imageFiles = Array.isArray(images) ? images : [images];

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
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {factoryId, typeId, price, limit, page} = req.query;
            page = page || 1;
            limit = limit || 12;
            let offset = (page - 1) * limit;
            let products;

            const query = {
                limit,
                offset,
                where: {},
                include: [
                    { model: Image, as: 'images' }, // Включаем изображения для каждого продукта
                    // { model: Collection, as: 'collections' }
                ]
            };

            if (factoryId) query.where.factoryId = factoryId;
            if (typeId) query.where.typeId = typeId;
            //if (collectionId) query.where.collectionId = collectionId;

            products = await Product.findAndCountAll(query);

            return res.json(products);
        } catch (e) {
            console.log('Error occurred:', e);  // Лог ошибки
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const product = await Product.findOne({
                where: {id},
                include: [
                    { model: ProductInfo, as: 'product_infos' },  // Включаем информацию о продукте
                    { model: Image, as: 'images' },  // Включаем изображения
                    { model: Collection, as: 'collection' }  // Включаем коллекцию
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
}

module.exports = new productController();
