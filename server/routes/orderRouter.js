const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Создание заказа (может любой, даже неавторизованный)
router.post('/', orderController.create);

// Получение заказов (только авторизованные)
router.get('/', authMiddleware, orderController.getAll);

// Получение одного заказа (только авторизованные)
router.get('/:id', authMiddleware, orderController.getOne);

// Обновление статуса заказа (только админ)
router.put('/:id/status', authMiddleware, checkRole('ADMIN'), orderController.updateStatus);

// Отмена заказа (авторизованные)
router.put('/:id/cancel', authMiddleware, orderController.cancel);

module.exports = router; 