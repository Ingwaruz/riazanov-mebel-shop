const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, EmailVerification} = require('../models/models')
const emailService = require('../services/emailService')
const { Op } = require('sequelize')

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
            const { email, password, role, verified } = req.body;
            
            // Проверяем, что email был верифицирован
            if (!verified) {
                return next(ApiError.badRequest('Email не подтвержден'));
            }
            
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
            const user = await User.create({ 
                email, 
                role, 
                password: hashPassword,
                email_verified: true 
            });
            await Basket.create({ userId: user.id });

            const token = generateJwt(user.id, user.email, user.role);
            
            // Отправляем приветственное письмо
            await emailService.sendWelcomeEmail(email, user.name);
            
            return res.json({ token });
        } catch (error) {
            console.error('Error in registration:', error);
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

    // Отправка пин-кода для верификации email
    async sendVerificationPin(req, res, next) {
        try {
            const { email } = req.body;
            
            // Валидация email
            const emailError = validateEmail(email);
            if (emailError) {
                return next(ApiError.badRequest(emailError));
            }
            
            // Проверка, не существует ли уже пользователь с таким email
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(ApiError.badRequest('Пользователь с такой почтой уже существует!'));
            }
            
            // Удаляем просроченные пин-коды для этого email
            await EmailVerification.destroy({
                where: {
                    email,
                    expires_at: {
                        [Op.lt]: new Date()
                    }
                }
            });
            
            // Проверяем, не слишком ли часто отправляются пин-коды
            const recentPin = await EmailVerification.findOne({
                where: {
                    email,
                    created_at: {
                        [Op.gt]: new Date(Date.now() - 60000) // Последняя минута
                    }
                },
                order: [['created_at', 'DESC']]
            });
            
            if (recentPin) {
                return next(ApiError.badRequest('Пожалуйста, подождите минуту перед повторной отправкой пин-кода'));
            }
            
            // Генерируем и сохраняем пин-код
            const pinCode = emailService.generatePinCode();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
            
            // Создаем запись о верификации, даже если отправка не удалась
            await EmailVerification.create({
                email,
                pin_code: pinCode,
                expires_at: expiresAt,
                created_at: new Date()
            });
            
            // Отправляем пин-код на email
            const result = await emailService.sendVerificationPin(email, pinCode);
            
            if (!result.success) {
                console.error('Error sending email:', result.error);
                // Но не возвращаем ошибку, так как запись о верификации уже создана
            }
            
            // Определяем, находимся ли в режиме разработки
            const isDevelopmentMode = process.env.NODE_ENV === 'development';
            
            return res.json({ 
                message: 'Пин-код отправлен на указанный email',
                expires_in: 900, // 15 минут в секундах
                // Возвращаем пин-код только в режиме разработки
                dev_pin_code: isDevelopmentMode ? pinCode : undefined
            });
        } catch (error) {
            console.error('Error in sendVerificationPin:', error);
            return next(ApiError.internal('Ошибка сервера'));
        }
    }
    
    // Проверка пин-кода
    async verifyPin(req, res, next) {
        try {
            const { email, pin_code } = req.body;
            
            if (!email || !pin_code) {
                return next(ApiError.badRequest('Email и пин-код обязательны'));
            }
            
            // Находим активный пин-код
            const verification = await EmailVerification.findOne({
                where: {
                    email,
                    pin_code,
                    expires_at: {
                        [Op.gt]: new Date()
                    }
                }
            });
            
            if (!verification) {
                return next(ApiError.badRequest('Неверный или истекший пин-код'));
            }
            
            // Удаляем использованный пин-код
            await verification.destroy();
            
            // Удаляем все остальные пин-коды для этого email
            await EmailVerification.destroy({
                where: { email }
            });
            
            return res.json({ 
                message: 'Email успешно подтвержден',
                verified: true
            });
        } catch (error) {
            console.error('Error in verifyPin:', error);
            return next(ApiError.internal('Ошибка сервера при проверке пин-кода'));
        }
    }
}

module.exports = new userController()