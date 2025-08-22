const Router = require('express');
const router = new Router();
const contactsController = require('../controllers/contactsController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// Публичные маршруты
router.get('/', contactsController.getAll); // Получить все активные контакты

// Защищенные маршруты (только для админа)
router.get('/:id', checkRole('ADMIN'), contactsController.getOne);
router.post('/', checkRole('ADMIN'), contactsController.create);
router.put('/:id', checkRole('ADMIN'), contactsController.update);
router.delete('/:id', checkRole('ADMIN'), contactsController.delete);
router.put('/order/update', checkRole('ADMIN'), contactsController.updateOrder);

module.exports = router; 