const ApiError = require('../error/apiError');
const bcript = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

class userController {
    async registartion(req, res) {
        const {email, password, role} = req.body
        if(!email || !password) {
            return next(ApiError.badRequest('Неверная почта или пароль'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с такой почтой уже существует!'))
        }
        const hashPassword = await bcript.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const Basket = await Basket.create({userId: user.id})
        const token = jwt.sign(
            {id: user.id, email, role}, 
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
        return res.json({token})
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