const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const factoryRouter = require('./factoryRouter')
const collectionRouter = require('./collectionRouter')
const productRouter = require('./productRouter')
const featureRouter = require('./featureRouter')
const subtypeRouter = require('./subtypeRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/factory', factoryRouter)
router.use('/collection', collectionRouter)
router.use('/product', productRouter)
router.use('/feature', featureRouter)
router.use('/subtype', subtypeRouter)

module.exports = router