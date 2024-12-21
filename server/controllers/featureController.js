const {Feature, FeatureToTypeFactory, Type, Factory, Sequelize} = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');
const sequelize = require('../db');

// Функция для форматирования названия
const formatFeatureName = (name) => {
    return name.trim()
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase());
};

class FeatureController {
    async create(req, res, next) {
        try {
            console.log('Received data:', req.body);
            let {name, typeId, factoryId} = req.body;

            // Форматируем название
            name = formatFeatureName(name);
            typeId = parseInt(typeId);
            factoryId = parseInt(factoryId);

            if (!name || isNaN(typeId) || isNaN(factoryId)) {
                return next(ApiError.badRequest('Не все поля заполнены корректно'));
            }

            // Ищем существующую характеристику с таким именем
            let feature = await Feature.findOne({
                where: { 
                    name: sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('name')), 
                        name.toLowerCase()
                    ) 
                }
            });

            // Если характеристики нет, создаем новую
            if (!feature) {
                feature = await Feature.create({ 
                    name: formatFeatureName(name) // С заглавной буквы
                });
            }

            try {
                // Создаем связь с типом и фабрикой
                await FeatureToTypeFactory.create({
                    featureId: feature.id,
                    typeId,
                    factoryId
                });

                return res.json({
                    id: feature.id,
                    name: feature.name, // Возвращаем как есть
                    typeId,
                    factoryId
                });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return next(ApiError.badRequest('Такая характеристика уже существует для данного типа и фабрики'));
                }
                throw error;
            }
        } catch (e) {
            console.error('Create feature error:', e);
            return next(ApiError.internal(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const features = await Feature.findAll({
                include: [FeatureToTypeFactory]
            });
            return res.json(features);
        } catch (e) {
            console.error('Get all features error:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    async getByTypeAndFactory(req, res, next) {
        try {
            const {typeId, factoryId} = req.query;
            console.log('Query params:', {typeId, factoryId});

            if (!typeId || !factoryId) {
                return res.json([]);
            }

            const features = await Feature.findAll({
                include: {
                    model: FeatureToTypeFactory,
                    attributes: ['typeId', 'factoryId'],
                    where: {
                        typeId: Number(typeId),
                        factoryId: Number(factoryId)
                    },
                    required: true
                }
            });

            console.log('Found features:', features);
            return res.json(features);
        } catch (e) {
            console.error('Get features by type and factory error:', e);
            return res.status(500).json({
                message: e.message,
                stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
            });
        }
    }

    // Добавим метод для поиска характеристик по частичному совпадению
    async searchFeatures(req, res, next) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.json([]);
            }

            const features = await Feature.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${query}%`
                    }
                },
                limit: 10
            });

            return res.json(features);
        } catch (e) {
            console.error('Search features error:', e);
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new FeatureController(); 