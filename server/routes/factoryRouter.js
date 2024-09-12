const Router = require('express')
const router = new Router()
const factoryController = require('../controllers/factoryController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), factoryController.create)
router.get('/', factoryController.getAll)
router.delete('/',)

module.exports = router