const { EmailVerification } = require('../models/models');
const { Op } = require('sequelize');

// Функция для очистки просроченных пин-кодов
async function cleanupExpiredPins() {
    try {
        const result = await EmailVerification.destroy({
            where: {
                expires_at: {
                    [Op.lt]: new Date()
                }
            }
        });
        
        if (result > 0) {
            console.log(`Удалено ${result} просроченных пин-кодов`);
        }
    } catch (error) {
        console.error('Ошибка при очистке просроченных пин-кодов:', error);
    }
}

// Запускаем очистку каждые 30 минут
function startCleanupJob() {
    // Первый запуск при старте
    cleanupExpiredPins();
    
    // Затем каждые 30 минут
    setInterval(cleanupExpiredPins, 30 * 60 * 1000);
    
    console.log('Задача очистки просроченных пин-кодов запущена');
}

module.exports = {
    cleanupExpiredPins,
    startCleanupJob
}; 