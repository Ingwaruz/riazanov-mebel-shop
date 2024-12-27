const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/filter', productController.getFiltered)
router.get('/sizes', productController.getSizeRanges)
router.get('/prices', productController.getPriceRange)
router.get('/:id', productController.getOne)
router.post('/import', checkRole('ADMIN'), productController.importFromCsv)

module.exports = router