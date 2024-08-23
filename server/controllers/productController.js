const uuid = require('uuid')
const path = require('path')
const {Product, ProductInfo} = require('../models/models')
const ApiError = require('../error/apiError')

class productController {
    async create(req, res, next) {
        try {
            let {name, price, factoryId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({name, price, factoryId, typeId, img: fileName})

            if(info) {
                info = JSON.parse(info)
                info.array.forEach(element => {
                    ProductInfo.create({
                        title: element.title,
                        describtion: element.describtion,
                        productId: product.id
                    })
                });
            }

            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {factoryId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let products

        if (!factoryId && !typeId) {
            products = await Product.findAndCountAll({limit, offset})
        }
        if (factoryId && !typeId) {
            products = await Product.findAndCountAll({where: {factoryId, limit, offset}})
        }
        if (!factoryId && typeId) {
            products = await Product.findAndCountAll({where: {typeId, limit, offset}})
        }
        if (factoryId && typeId) {
            products = await Product.findAndCountAll({where: {typeId, factoryId, limit, offset}})
    }
        
        return res.json(products)
    }

    async getOne(req, res) {
        const {id} = req.params
        const product = await Product.findOne(
            {
                where: {id},
                include: [{model: ProductInfo, as: 'product_infos'}]
            },
        )
        return res.json(product)
    }
}

module.exports = new productController()