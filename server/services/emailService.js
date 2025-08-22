const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Создаем транспорт только если доступны учетные данные email
        this.hasCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
        
        if (this.hasCredentials) {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: process.env.EMAIL_PORT || 587,
                secure: false, // true для 465, false для других портов
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        } else {
            console.warn('EMAIL_USER or EMAIL_PASSWORD not set. Email sending is disabled.');
        }
    }

    // Генерация случайного 6-значного пин-кода
    generatePinCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Отправка пин-кода для верификации email
    async sendVerificationPin(email, pinCode) {
        try {
            // Если учетные данные email не настроены, имитируем успешную отправку
            if (!this.hasCredentials) {
                console.log(`[DEV MODE] Simulation of sending PIN ${pinCode} to ${email}`);
                return { success: true, messageId: 'simulated-message-id' };
            }

            const mailOptions = {
                from: `"Рязанов Мебель" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Подтверждение регистрации - Рязанов Мебель',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Подтверждение email</h2>
                        <p>Здравствуйте!</p>
                        <p>Для завершения регистрации на сайте Рязанов Мебель, пожалуйста, введите следующий пин-код:</p>
                        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${pinCode}</h1>
                        </div>
                        <p>Пин-код действителен в течение 15 минут.</p>
                        <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 12px;">С уважением,<br>Команда Рязанов Мебель</p>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    // Отправка приветственного письма после успешной регистрации
    async sendWelcomeEmail(email, name) {
        try {
            // Если учетные данные email не настроены, имитируем успешную отправку
            if (!this.hasCredentials) {
                console.log(`[DEV MODE] Simulation of sending welcome email to ${email}`);
                return { success: true, messageId: 'simulated-message-id' };
            }

            const mailOptions = {
                from: `"Рязанов Мебель" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Добро пожаловать в Рязанов Мебель!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Добро пожаловать${name ? ', ' + name : ''}!</h2>
                        <p>Ваша регистрация успешно завершена.</p>
                        <p>Теперь вы можете:</p>
                        <ul>
                            <li>Просматривать каталог мебели</li>
                            <li>Добавлять товары в корзину</li>
                            <li>Оформлять заказы</li>
                            <li>Отслеживать историю заказов</li>
                        </ul>
                        <p>Если у вас возникнут вопросы, не стесняйтесь обращаться к нам.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 12px;">С уважением,<br>Команда Рязанов Мебель</p>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }

    // Проверка конфигурации транспорта
    async verifyConnection() {
        try {
            if (!this.hasCredentials) {
                console.log('[DEV MODE] Email service is running in simulation mode');
                return true;
            }
            
            await this.transporter.verify();
            console.log('Email service is ready to send messages');
            return true;
        } catch (error) {
            console.error('Email service error:', error);
            return false;
        }
    }
}

module.exports = new EmailService(); 