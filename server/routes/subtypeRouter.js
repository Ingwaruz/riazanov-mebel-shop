const Router = require('express')
const router = new Router()
const subtypeController = require('../controllers/subtypeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), subtypeController.create)
router.get('/', subtypeController.getAll)
router.get('/:typeId', subtypeController.getByType)

module.exports = router 