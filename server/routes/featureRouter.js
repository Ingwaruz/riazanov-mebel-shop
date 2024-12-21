const Router = require('express');
const router = new Router();
const featureController = require('../controllers/featureController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), featureController.create);
router.get('/', featureController.getAll);
router.get('/byTypeAndFactory', featureController.getByTypeAndFactory);
router.get('/search', featureController.searchFeatures);

module.exports = router; 