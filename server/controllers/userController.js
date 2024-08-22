const ApiError = require('../error/apiError');

class userController {
    async registartion(req, res) {

    }

    async login(req, res) {

    }

    async checkAuth(req, res, next) {
        const {id} = req.query
        if (!id) {
            return next(ApiError.badRequest('Не задан id'))
        }
        res.json(id) 
    }
}

module.exports = new userController()