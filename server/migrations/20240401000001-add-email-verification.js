'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Создаем таблицу email_verifications
      await queryInterface.createTable('email_verifications', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false // Один email может иметь несколько попыток
        },
        pin_code: {
          type: Sequelize.STRING(6),
          allowNull: false
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Добавляем индекс для быстрого поиска по email
      await queryInterface.addIndex('email_verifications', ['email']);
      
      // Добавляем индекс для автоматической очистки просроченных записей
      await queryInterface.addIndex('email_verifications', ['expires_at']);

      // Добавляем поле email_verified в таблицу users
      await queryInterface.addColumn('users', 'email_verified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });

      console.log('Email verification tables created successfully');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Удаляем поле email_verified из таблицы users
      await queryInterface.removeColumn('users', 'email_verified');
      
      // Удаляем таблицу email_verifications
      await queryInterface.dropTable('email_verifications');
      
      console.log('Email verification tables removed successfully');
    } catch (error) {
      console.error('Rollback error:', error);
      throw error;
    }
  }
}; 