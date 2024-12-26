'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Проверяем существование таблиц
      const tables = await queryInterface.showAllTables();
      
      // Если таблицы уже существуют, пропускаем миграцию
      if (tables.includes('users')) {
        console.log('Tables already exist, skipping migration');
        return;
      }

      // 2. Создаем таблицы
      
      // Users
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING,
          unique: true
        },
        password: {
          type: Sequelize.STRING
        },
        role: {
          type: Sequelize.STRING,
          defaultValue: "USER"
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Types
      await queryInterface.createTable('types', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Factories
      await queryInterface.createTable('factories', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Collections
      await queryInterface.createTable('collections', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        factoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'factories',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Products
      await queryInterface.createTable('products', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        min_price: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        width: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        depth: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        height: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT
        },
        typeId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'types',
            key: 'id'
          }
        },
        factoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'factories',
            key: 'id'
          }
        },
        collectionId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'collections',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Images
      await queryInterface.createTable('images', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        img: {
          type: Sequelize.STRING,
          allowNull: false
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        productId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'products',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Features
      await queryInterface.createTable('features', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // ProductInfo
      await queryInterface.createTable('product_infos', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        value: {
          type: Sequelize.STRING,
          allowNull: false
        },
        productId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'products',
            key: 'id'
          }
        },
        featureId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'features',
            key: 'id'
          }
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем все таблицы в правильном порядке
    await queryInterface.dropTable('product_infos', { cascade: true });
    await queryInterface.dropTable('images', { cascade: true });
    await queryInterface.dropTable('products', { cascade: true });
    await queryInterface.dropTable('collections', { cascade: true });
    await queryInterface.dropTable('features', { cascade: true });
    await queryInterface.dropTable('types', { cascade: true });
    await queryInterface.dropTable('factories', { cascade: true });
    await queryInterface.dropTable('users', { cascade: true });
  }
}; 