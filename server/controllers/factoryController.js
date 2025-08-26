const { Factory } = require("../models/models")
const ApiError = require('../error/ApiError')

class factoryController {
    async create(req, res) {
        const {name} = req.body
        const factory = await Factory.create({name})
        return res.json(factory)
    }

    async getAll(req, res) {
        const factories = await Factory.findAll()
        return res.json(factories)
    }
}

module.exports = new factoryController()