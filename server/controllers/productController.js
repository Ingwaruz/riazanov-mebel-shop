const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo} = require('../models/models');
const ApiError = require('../error/apiError');
const {sequelize} = require('../models/models');  // Экземпляр sequelize

class productController {
    async create(req, res, next) {
        console.log('Create product request received.');  // Лог начала обработки запроса

        const transaction = await sequelize.transaction();  // Создание транзакции
        try {
            let {name, price, factoryId, typeId, info} = req.body;
            console.log('Request body:', req.body);  // Лог содержимого тела запроса
            const {img} = req.files;

            // Проверка на наличие всех необходимых полей
            if (!name || !price || !factoryId || !typeId || !img) {
                throw ApiError.badRequest('All fields must be filled');
            }

            // Генерация уникального имени файла с расширением
            const fileExtension = path.extname(img.name);
            let fileName = uuid.v4() + fileExtension;
            console.log('Generated file name:', fileName);  // Лог имени файла

            // Перемещение файла в нужную директорию
            img.mv(path.resolve(__dirname, '..', 'static', fileName), (err) => {
                if (err) {
                    console.log('Error moving file:', err);  // Лог ошибки при перемещении файла
                    throw ApiError.badRequest('File upload error');
                }
            });

            // Создание продукта
            console.log('Creating product...');
            const product = await Product.create(
                {name, price, factoryId, typeId, img: fileName},
                {transaction}
            );
            console.log('Product created:', product);  // Лог созданного продукта

            // Если есть дополнительная информация о продукте
            if (info) {
                console.log('Parsing additional product info:', info);  // Лог информации о продукте
                info = JSON.parse(info);  // Парсинг строки info в JSON
                console.log('Parsed info:', info);  // Лог успешного парсинга
                for (const element of info) {
                    console.log('Creating product info entry:', element);  // Лог данных элемента информации
                    await ProductInfo.create({
                        title: element.title,
                        description: element.description,
                        productId: product.id
                    }, {transaction});
                }
            }

            // Коммит транзакции
            console.log('Committing transaction...');
            await transaction.commit();
            console.log('Transaction committed successfully.');
            return res.json(product);
        } catch (e) {
            console.log('Error occurred:', e);  // Лог ошибки
            await transaction.rollback();  // Откат транзакции при ошибке
            console.log('Transaction rolled back.');
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        console.log('Get all products request received.');

        try {
            let {factoryId, typeId, limit, page} = req.query;
            console.log('Request query:', req.query);  // Лог запроса
            page = page || 1;
            limit = limit || 9;
            let offset = (page - 1) * limit;
            let products;

            const query = {
                limit,
                offset,
                where: {}
            };

            if (factoryId) query.where.factoryId = factoryId;
            if (typeId) query.where.typeId = typeId;

            products = await Product.findAndCountAll(query);

            return res.json(products);
        } catch (e) {
            console.log('Error occurred:', e);  // Лог ошибки
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        console.log('Get product by ID request received:', req.params);  // Лог параметров запроса

        try {
            const {id} = req.params;
            console.log('Searching for product with ID:', id);  // Лог ID продукта
            const product = await Product.findOne({
                where: {id},
                include: [{model: ProductInfo, as: 'product_infos'}]
            });

            if (!product) {
                console.log('Product not found.');  // Лог отсутствующего продукта
                throw ApiError.badRequest('Product not found');
            }

            console.log('Product found:', product);  // Лог найденного продукта
            return res.json(product);
        } catch (e) {
            console.log('Error occurred:', e);  // Лог ошибки
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new productController();
