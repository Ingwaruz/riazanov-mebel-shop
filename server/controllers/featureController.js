const {Feature, FeatureToTypeFactory} = require('../models/models');
const ApiError = require('../error/ApiError');

class FeatureController {
    async create(req, res, next) {
        try {
            const {name, typeId, factoryId} = req.body;

            // Валидация
            if (!name || !typeId || !factoryId) {
                return next(ApiError.badRequest('Не все поля заполнены'));
            }

            // Проверка на дубликаты
            const existing = await Feature.findOne({
                include: [{
                    model: FeatureToTypeFactory,
                    where: { typeId, factoryId }
                }],
                where: { name }
            });

            if (existing) {
                return next(ApiError.badRequest('Такая характеристика уже существует для данного типа и производителя'));
            }

            const feature = await Feature.create({name});
            await FeatureToTypeFactory.create({
                featureId: feature.id,
                typeId,
                factoryId
            });
            
            return res.json(feature);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getByTypeAndFactory(req, res, next) {
        try {
            const {typeId, factoryId} = req.query;
            const features = await Feature.findAll({
                include: [{
                    model: FeatureToTypeFactory,
                    where: {
                        typeId,
                        factoryId
                    }
                }]
            });
            return res.json(features);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new FeatureController(); 