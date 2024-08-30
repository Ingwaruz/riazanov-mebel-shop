const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo} = require('../models/models');
const ApiError = require('../error/apiError');
const {Sequelize} = require('sequelize');

class productController {
    async create(req, res, next) {
        const transaction = await Sequelize.transaction();
        try {
            let {name, price, factoryId, typeId, info} = req.body;
            const {img} = req.files;

            if (!name || !price || !factoryId || !typeId || !img) {
                throw ApiError.badRequest('All fields must be filled');
            }

            const fileExtension = path.extname(img.name);
            let fileName = uuid.v4() + fileExtension;
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const product = await Product.create({name, price, factoryId, typeId, img: fileName}, {transaction});

            if (info) {
                info = JSON.parse(info);
                info.forEach(element => {
                    ProductInfo.create({
                        title: element.title,
                        description: element.description,
                        productId: product.id
                    }, {transaction});
                });
            }

            await transaction.commit();
            return res.json(product);
        } catch (e) {
            await transaction.rollback();
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {factoryId, typeId, limit, page} = req.query;
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
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const product = await Product.findOne({
                where: {id},
                include: [{model: ProductInfo, as: 'product_infos'}]
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
