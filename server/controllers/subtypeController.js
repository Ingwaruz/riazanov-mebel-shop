const {Subtype} = require('../models/models')
const ApiError = require('../error/apiError');

class SubtypeController {
    async create(req, res, next) {
        try {
            const {name, typeId} = req.body
            const subtype = await Subtype.create({name, typeId})
            return res.json(subtype)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const subtypes = await Subtype.findAll()
        return res.json(subtypes)
    }

    async getByType(req, res) {
        const {typeId} = req.params
        const subtypes = await Subtype.findAll({where: {typeId}})
        return res.json(subtypes)
    }
}

module.exports = new SubtypeController() 