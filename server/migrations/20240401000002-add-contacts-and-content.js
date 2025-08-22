'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Создаем таблицу contacts
      await queryInterface.createTable('contacts', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false
          // Типы: phone, email, address, social, messenger
        },
        value: {
          type: Sequelize.STRING,
          allowNull: false
        },
        label: {
          type: Sequelize.STRING,
          allowNull: false
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        sort_order: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Добавляем индексы для contacts
      await queryInterface.addIndex('contacts', ['type']);
      await queryInterface.addIndex('contacts', ['is_active']);
      await queryInterface.addIndex('contacts', ['sort_order']);

      // Создаем таблицу content_pages
      await queryInterface.createTable('content_pages', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        page_key: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
          // Ключи: about_us, delivery, payment, warranty, etc.
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        meta_title: {
          type: Sequelize.STRING,
          allowNull: true
        },
        meta_description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Добавляем индексы для content_pages
      await queryInterface.addIndex('content_pages', ['page_key']);
      await queryInterface.addIndex('content_pages', ['is_active']);

      // Заполняем начальными данными - контакты
      await queryInterface.bulkInsert('contacts', [
        {
          type: 'phone',
          value: '+7 (495) 123-45-67',
          label: 'Основной телефон',
          is_active: true,
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          type: 'email',
          value: 'info@riazanov-mebel.ru',
          label: 'Email для связи',
          is_active: true,
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          type: 'address',
          value: 'г. Москва, ул. Примерная, д. 1',
          label: 'Адрес магазина',
          is_active: true,
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          type: 'social',
          value: 'https://vk.com/riazanov_mebel',
          label: 'ВКонтакте',
          is_active: true,
          sort_order: 4,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          type: 'messenger',
          value: 'https://wa.me/74951234567',
          label: 'WhatsApp',
          is_active: true,
          sort_order: 5,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      // Заполняем начальными данными - страницы
      await queryInterface.bulkInsert('content_pages', [
        {
          page_key: 'about_us',
          title: 'О нас',
          content: `<h2>О компании Рязанов Мебель</h2>
          <p>Добро пожаловать в мир качественной мебели!</p>
          <p>Компания "Рязанов Мебель" - это надежный партнер в создании уютного и функционального интерьера вашего дома. Мы работаем на рынке мебели более 10 лет и за это время заслужили доверие тысяч клиентов.</p>
          <h3>Наши преимущества:</h3>
          <ul>
            <li>Широкий ассортимент мебели от ведущих производителей</li>
            <li>Гарантия качества на всю продукцию</li>
            <li>Индивидуальный подход к каждому клиенту</li>
            <li>Профессиональная консультация при выборе мебели</li>
            <li>Доставка и сборка мебели</li>
          </ul>
          <p>Мы постоянно расширяем ассортимент и следим за последними тенденциями в мире мебельной индустрии, чтобы предложить вам самые современные и стильные решения.</p>`,
          meta_title: 'О компании - Рязанов Мебель',
          meta_description: 'Информация о компании Рязанов Мебель. Наша история, преимущества и принципы работы.',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          page_key: 'delivery',
          title: 'Доставка',
          content: `<h2>Условия доставки</h2>
          <p>Мы осуществляем доставку мебели по Москве и Московской области.</p>
          <h3>Стоимость доставки:</h3>
          <ul>
            <li>В пределах МКАД - от 500 рублей</li>
            <li>За МКАД - 500 рублей + 30 руб/км от МКАД</li>
            <li>Подъем на этаж - 100 рублей за этаж</li>
            <li>Подъем на лифте - бесплатно</li>
          </ul>
          <h3>Сроки доставки:</h3>
          <p>Доставка осуществляется в течение 3-5 рабочих дней после оформления заказа. Точное время доставки согласовывается с менеджером.</p>
          <h3>Важно:</h3>
          <p>Перед доставкой убедитесь, что габариты мебели позволяют внести ее в помещение. Наши специалисты помогут вам с замерами.</p>`,
          meta_title: 'Условия доставки - Рязанов Мебель',
          meta_description: 'Информация о доставке мебели по Москве и области. Стоимость и сроки доставки.',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);

      console.log('Contacts and content tables created successfully');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Удаляем таблицы в обратном порядке
      await queryInterface.dropTable('content_pages');
      await queryInterface.dropTable('contacts');
      
      console.log('Contacts and content tables removed successfully');
    } catch (error) {
      console.error('Rollback error:', error);
      throw error;
    }
  }
}; 