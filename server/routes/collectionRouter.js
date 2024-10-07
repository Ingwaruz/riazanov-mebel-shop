const Router = require('express')
const router = new Router()
const collectionController = require('../controllers/collectionController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', checkRole('ADMIN'), collectionController.create)
router.get('/', collectionController.getAll)
router.delete('/',)

module.exports = router