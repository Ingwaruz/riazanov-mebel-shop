const Router = require('express');
const router = new Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Публичные маршруты
router.get('/', contentController.getAll); // Получить все активные страницы
router.get('/key/:key', contentController.getByKey); // Получить страницу по ключу

// Защищенные маршруты (только для админа)
router.get('/:id', checkRole('ADMIN'), contentController.getOne);
router.post('/', checkRole('ADMIN'), contentController.create);
router.put('/:id', checkRole('ADMIN'), contentController.update);
router.delete('/:id', checkRole('ADMIN'), contentController.delete);

module.exports = router; 