const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')

router.post('/', typeController.create)
router.post('/', typeController.getAll)

module.exports = router