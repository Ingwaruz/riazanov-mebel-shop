require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors({
  origin: ['https://domu-mebel.ru', 'https://www.domu-mebel.ru', 'http://domu-mebel.ru', 'http://www.domu-mebel.ru'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        // Отключаем автоматическую синхронизацию моделей
        // await sequelize.sync({ force: true })
        app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT} and is accessible from outside`))
    } catch (e) {
        console.log(e)
    }
}

start()