const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

// Срочное исправление - устанавливаем переменные напрямую
if (!process.env.DB_USER) {
    process.env.DB_NAME = 'online_store_riazanov'
    process.env.DB_USER = 'postgres'
    process.env.DB_PASSWORD = '95249524'
    process.env.DB_HOST = 'localhost'
    process.env.DB_PORT = '5432'
    process.env.PORT = '5000'
    process.env.SECRET_KEY = 'h2K8fjkds!dfs+d-fsdxcchslcv938C_frmrfsudo'
    console.log('=== USING HARDCODED ENV VARIABLES ===')
}

// Отладочная информация
console.log('=== DEBUG ENV VARIABLES ===')
console.log('DB_USER:', process.env.DB_USER)
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET')
console.log('DB_NAME:', process.env.DB_NAME)
console.log('DB_HOST:', process.env.DB_HOST)
console.log('DB_PORT:', process.env.DB_PORT)
console.log('============================')

const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors({
  origin: [
    'https://domu-mebel.ru', 
    'https://www.domu-mebel.ru', 
    'http://domu-mebel.ru', 
    'http://www.domu-mebel.ru',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
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