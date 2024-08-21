const Router = require('express')
const router = new Router()
const userRouter = require('./productRouter')
const typeRouter = require('./productRouter')
const factoryRouter = require('./productRouter')
const productRouter = require('./productRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/factory', factoryRouter)
router.use('/product', productRouter)

module.exports = router