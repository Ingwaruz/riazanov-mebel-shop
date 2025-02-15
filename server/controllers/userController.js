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

const validateEmail = (email) => {
    const validEmailDomains = ['@mail.ru', '@gmail.com', '@yandex.ru', '@outlook.com', '@yahoo.com'];
    const hasValidDomain = validEmailDomains.some(domain => email.endsWith(domain));
    if (!email) {
        return 'Email обязателен';
    }
    if (!hasValidDomain) {
        return 'Некорректный email домен';
    }
    return '';
};

const validatePassword = (password) => {
    if (!password) {
        return 'Пароль обязателен';
    }
    if (password.length < 8) {
        return 'Пароль должен содержать минимум 8 символов';
    }
    return '';
};

class userController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body;
            
            // Валидация email
            const emailError = validateEmail(email);
            if (emailError) {
                return next(ApiError.badRequest(emailError));
            }

            // Валидация пароля
            const passwordError = validatePassword(password);
            if (passwordError) {
                return next(ApiError.badRequest(passwordError));
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
        try {
            const {email, password} = req.body;
            
            // Валидация email
            const emailError = validateEmail(email);
            if (emailError) {
                return next(ApiError.badRequest(emailError));
            }

            const user = await User.findOne({ where: {email} });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            let comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return next(ApiError.badRequest('Неверный пароль'));
            }

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({token});
        } catch (error) {
            return next(ApiError.internal('Ошибка сервера'));
        }
    }

    async checkAuth(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new userController()