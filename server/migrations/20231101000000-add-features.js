module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Добавляем поле description в таблицу products
        await queryInterface.addColumn('products', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        // Создаем таблицу features
        await queryInterface.createTable('features', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        // Создаем таблицу feature_to_type_factories
        await queryInterface.createTable('feature_to_type_factories', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            featureId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'features',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            typeId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'types',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            factoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'factories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        // Изменяем таблицу product_infos
        await queryInterface.dropTable('product_infos');
        await queryInterface.createTable('product_infos', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            featureId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'features',
                    key: 'id',
                },
                allowNull: false,
            },
            productId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('products', 'description');
        await queryInterface.dropTable('feature_to_type_factories');
        await queryInterface.dropTable('features');
        // Восстанавливаем старую структуру product_infos
        await queryInterface.dropTable('product_infos');
        await queryInterface.createTable('product_infos', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            productId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
}; 