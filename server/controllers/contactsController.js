const ApiError = require('../error/apiError');
const { Contact } = require('../models/models');

class ContactsController {
    // Получить все контакты
    async getAll(req, res, next) {
        try {
            const { type, active } = req.query;
            const where = {};
            
            if (type) {
                where.type = type;
            }
            
            if (active !== undefined) {
                where.is_active = active === 'true';
            }
            
            const contacts = await Contact.findAll({
                where,
                order: [['sort_order', 'ASC'], ['id', 'ASC']]
            });
            
            return res.json(contacts);
        } catch (error) {
            console.error('Error in getAll contacts:', error);
            return next(ApiError.internal('Ошибка при получении контактов'));
        }
    }
    
    // Получить контакт по id
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const contact = await Contact.findByPk(id);
            
            if (!contact) {
                return next(ApiError.badRequest('Контакт не найден'));
            }
            
            return res.json(contact);
        } catch (error) {
            console.error('Error in getOne contact:', error);
            return next(ApiError.internal('Ошибка при получении контакта'));
        }
    }
    
    // Создать новый контакт
    async create(req, res, next) {
        try {
            const { type, value, label, is_active, sort_order } = req.body;
            
            if (!type || !value || !label) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }
            
            const contact = await Contact.create({
                type,
                value,
                label,
                is_active: is_active !== undefined ? is_active : true,
                sort_order: sort_order || 0
            });
            
            return res.json(contact);
        } catch (error) {
            console.error('Error in create contact:', error);
            return next(ApiError.internal('Ошибка при создании контакта'));
        }
    }
    
    // Обновить контакт
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { type, value, label, is_active, sort_order } = req.body;
            
            const contact = await Contact.findByPk(id);
            
            if (!contact) {
                return next(ApiError.badRequest('Контакт не найден'));
            }
            
            // Обновляем только переданные поля
            if (type !== undefined) contact.type = type;
            if (value !== undefined) contact.value = value;
            if (label !== undefined) contact.label = label;
            if (is_active !== undefined) contact.is_active = is_active;
            if (sort_order !== undefined) contact.sort_order = sort_order;
            
            await contact.save();
            
            return res.json(contact);
        } catch (error) {
            console.error('Error in update contact:', error);
            return next(ApiError.internal('Ошибка при обновлении контакта'));
        }
    }
    
    // Удалить контакт
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            const contact = await Contact.findByPk(id);
            
            if (!contact) {
                return next(ApiError.badRequest('Контакт не найден'));
            }
            
            await contact.destroy();
            
            return res.json({ message: 'Контакт успешно удален' });
        } catch (error) {
            console.error('Error in delete contact:', error);
            return next(ApiError.internal('Ошибка при удалении контакта'));
        }
    }
    
    // Массовое обновление порядка сортировки
    async updateOrder(req, res, next) {
        try {
            const { contacts } = req.body;
            
            if (!Array.isArray(contacts)) {
                return next(ApiError.badRequest('Неверный формат данных'));
            }
            
            // Обновляем порядок для каждого контакта
            for (const item of contacts) {
                await Contact.update(
                    { sort_order: item.sort_order },
                    { where: { id: item.id } }
                );
            }
            
            return res.json({ message: 'Порядок контактов обновлен' });
        } catch (error) {
            console.error('Error in updateOrder contacts:', error);
            return next(ApiError.internal('Ошибка при обновлении порядка контактов'));
        }
    }
}

module.exports = new ContactsController(); 