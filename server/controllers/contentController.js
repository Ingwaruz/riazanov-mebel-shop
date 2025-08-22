const ApiError = require('../error/apiError');
const { ContentPage } = require('../models/models');

class ContentController {
    // Получить все страницы
    async getAll(req, res, next) {
        try {
            const { active } = req.query;
            const where = {};
            
            if (active !== undefined) {
                where.is_active = active === 'true';
            }
            
            const pages = await ContentPage.findAll({
                where,
                order: [['page_key', 'ASC']]
            });
            
            return res.json(pages);
        } catch (error) {
            console.error('Error in getAll pages:', error);
            return next(ApiError.internal('Ошибка при получении страниц'));
        }
    }
    
    // Получить страницу по ключу
    async getByKey(req, res, next) {
        try {
            const { key } = req.params;
            const page = await ContentPage.findOne({
                where: { 
                    page_key: key,
                    is_active: true 
                }
            });
            
            if (!page) {
                return next(ApiError.badRequest('Страница не найдена'));
            }
            
            return res.json(page);
        } catch (error) {
            console.error('Error in getByKey page:', error);
            return next(ApiError.internal('Ошибка при получении страницы'));
        }
    }
    
    // Получить страницу по id
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const page = await ContentPage.findByPk(id);
            
            if (!page) {
                return next(ApiError.badRequest('Страница не найдена'));
            }
            
            return res.json(page);
        } catch (error) {
            console.error('Error in getOne page:', error);
            return next(ApiError.internal('Ошибка при получении страницы'));
        }
    }
    
    // Создать новую страницу
    async create(req, res, next) {
        try {
            const { page_key, title, content, meta_title, meta_description, is_active } = req.body;
            
            if (!page_key || !title || !content) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }
            
            // Проверяем уникальность ключа
            const existingPage = await ContentPage.findOne({ where: { page_key } });
            if (existingPage) {
                return next(ApiError.badRequest('Страница с таким ключом уже существует'));
            }
            
            const page = await ContentPage.create({
                page_key,
                title,
                content,
                meta_title: meta_title || title,
                meta_description,
                is_active: is_active !== undefined ? is_active : true
            });
            
            return res.json(page);
        } catch (error) {
            console.error('Error in create page:', error);
            return next(ApiError.internal('Ошибка при создании страницы'));
        }
    }
    
    // Обновить страницу
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, content, meta_title, meta_description, is_active } = req.body;
            
            const page = await ContentPage.findByPk(id);
            
            if (!page) {
                return next(ApiError.badRequest('Страница не найдена'));
            }
            
            // Обновляем только переданные поля
            if (title !== undefined) page.title = title;
            if (content !== undefined) page.content = content;
            if (meta_title !== undefined) page.meta_title = meta_title;
            if (meta_description !== undefined) page.meta_description = meta_description;
            if (is_active !== undefined) page.is_active = is_active;
            
            await page.save();
            
            return res.json(page);
        } catch (error) {
            console.error('Error in update page:', error);
            return next(ApiError.internal('Ошибка при обновлении страницы'));
        }
    }
    
    // Удалить страницу
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            const page = await ContentPage.findByPk(id);
            
            if (!page) {
                return next(ApiError.badRequest('Страница не найдена'));
            }
            
            // Не удаляем основные страницы, только деактивируем
            const protectedKeys = ['about_us', 'delivery', 'payment', 'warranty'];
            if (protectedKeys.includes(page.page_key)) {
                page.is_active = false;
                await page.save();
                return res.json({ message: 'Страница деактивирована' });
            }
            
            await page.destroy();
            
            return res.json({ message: 'Страница успешно удалена' });
        } catch (error) {
            console.error('Error in delete page:', error);
            return next(ApiError.internal('Ошибка при удалении страницы'));
        }
    }
}

module.exports = new ContentController(); 