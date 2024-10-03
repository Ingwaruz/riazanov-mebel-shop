const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class userController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return next(ApiError.badRequest('Неверная почта или пароль'));
            }

            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с такой почтой уже существует!'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, role, password: hashPassword });
            await Basket.create({ userId: user.id });

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (error) {
            return next(ApiError.internal('Ошибка сервера'));
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({ where: {email} })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден :('))
        }

        let comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Неверный пароль :('))
        }

        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async checkAuth(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new userController()