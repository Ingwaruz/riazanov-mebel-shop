const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo} = require('../models/models');
const ApiError = require('../error/apiError');

class productController {
    async create(req, res, next) {
        try {
            let {name, price, factoryId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({name, price, factoryId, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                )
            }

            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {

        try {
            let {factoryId, typeId, limit, page} = req.query;
            console.log('Request query:', req.query);  // Лог запроса
            page = page || 1;
            limit = limit || 12;
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
