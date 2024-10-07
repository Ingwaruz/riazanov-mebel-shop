const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const factoryRouter = require('./factoryRouter')
const collectionRouter = require('./collectionRouter')
const productRouter = require('./productRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/factory', factoryRouter)
router.use('/collection', collectionRouter)
router.use('/product', productRouter)

module.exports = router