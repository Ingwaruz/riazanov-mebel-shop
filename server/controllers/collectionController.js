const { Collection } = require("../models/models");

class collectionController {
    async create(req, res) {
        const { name, factoryId } = req.body; // Извлекаем factoryId из тела запроса
        try {
            const collection = await Collection.create({ name, factoryId }); // Создаём коллекцию с названием и ID фабрики
            return res.json(collection);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при создании коллекции", error });
        }
    }

    async getAll(req, res) {
        try {
            const collections = await Collection.findAll(); // Получаем все коллекции
            return res.json(collections);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка при получении коллекций", error });
        }
    }
}

module.exports = new collectionController();
