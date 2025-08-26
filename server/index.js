const path = require('path')
const fs = require('fs')

// Загружаем правильный .env файл в зависимости от NODE_ENV
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : 
                process.env.NODE_ENV === 'production' ? '.env.production' : '.env'

const envPath = path.join(__dirname, envFile)

console.log(`=== TRYING TO LOAD ${envFile} ===`)
console.log('File path:', envPath)
console.log('File exists:', fs.existsSync(envPath))

if (fs.existsSync(envPath)) {
    try {
        let content = fs.readFileSync(envPath, 'utf8')
        console.log('File content length:', content.length)
        console.log('First 100 chars:', content.substring(0, 100))
        
        // Удаляем BOM если он есть (более надежный способ)
        content = content.replace(/^\uFEFF/, '').replace(/^\ufeff/, '')
        console.log('After BOM removal, first 50 chars:', content.substring(0, 50))
        
        // Парсим переменные вручную
        const lines = content.split(/\r?\n/)
        lines.forEach(line => {
            const trimmed = line.trim()
            if (trimmed && !trimmed.startsWith('#')) {
                const equalIndex = trimmed.indexOf('=')
                if (equalIndex > 0) {
                    const key = trimmed.substring(0, equalIndex).trim()
                    const value = trimmed.substring(equalIndex + 1).trim()
                    process.env[key] = value
                    console.log(`Set ${key}=${value}`)
                }
            }
        })
        
    } catch (e) {
        console.log('Error reading file:', e.message)
}
}

console.log('=== VARIABLES SET BEFORE REQUIRING MODULES ===')
console.log('DB_NAME:', process.env.DB_NAME)
console.log('DB_USER:', process.env.DB_USER)
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET')
console.log('==============================================')

const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlingMiddleware')
const { startCleanupJob } = require('./utils/cleanupExpiredPins')

const PORT = process.env.PORT || (process.env.NODE_ENV === 'development' ? 5001 : 5000)
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
        
        // Запускаем очистку просроченных пин-кодов
        startCleanupJob()
        
        app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT} and is accessible from outside`))
    } catch (e) {
        console.log(e)
    }
}

start()