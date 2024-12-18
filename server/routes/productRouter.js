const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/filter', productController.getFiltered)
router.get('/:id', productController.getOne)

module.exports = router