const Router = require('express')
const router = new Router()
const factoryController = require('../controllers/factoryController')

router.post('/', factoryController.create)
router.get('/', factoryController.getAll)
router.delete('/',)

module.exports = router