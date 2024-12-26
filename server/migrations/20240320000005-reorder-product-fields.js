module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Сохраняем данные из всех связанных таблиц
        const products = await queryInterface.sequelize.query(
            'SELECT * FROM products',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        const basketProducts = await queryInterface.sequelize.query(
            'SELECT * FROM basket_products',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const images = await queryInterface.sequelize.query(
            'SELECT * FROM images',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const productInfos = await queryInterface.sequelize.query(
            'SELECT * FROM product_infos',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        // Удаляем зависимые таблицы
        await queryInterface.dropTable('basket_products');
        await queryInterface.dropTable('images');
        await queryInterface.dropTable('product_infos');

        // Удаляем таблицу products
        await queryInterface.dropTable('products');

        // Создаем таблицу products заново с нужным порядком полей
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
            factoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'factories',
                    key: 'id'
                }
            },
            typeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'types',
                    key: 'id'
                }
            },
            subtypeId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'subtypes',
                    key: 'id'
                }
            },
            collectionId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'collections',
                    key: 'id'
                }
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
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Восстанавливаем данные в products
        if (products.length) {
            await queryInterface.bulkInsert('products', products);
        }

        // Создаем зависимые таблицы заново
        await queryInterface.createTable('basket_products', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            basketId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'baskets',
                    key: 'id'
                }
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('images', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            file: {
                type: Sequelize.STRING,
                allowNull: false
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

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
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            featureId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'features',
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Восстанавливаем данные в зависимых таблицах
        if (basketProducts.length) {
            await queryInterface.bulkInsert('basket_products', basketProducts);
        }
        if (images.length) {
            await queryInterface.bulkInsert('images', images);
        }
        if (productInfos.length) {
            await queryInterface.bulkInsert('product_infos', productInfos);
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Аналогичные действия в обратном порядке
        const products = await queryInterface.sequelize.query(
            'SELECT * FROM products',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const basketProducts = await queryInterface.sequelize.query(
            'SELECT * FROM basket_products',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const images = await queryInterface.sequelize.query(
            'SELECT * FROM images',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const productInfos = await queryInterface.sequelize.query(
            'SELECT * FROM product_infos',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        await queryInterface.dropTable('basket_products');
        await queryInterface.dropTable('images');
        await queryInterface.dropTable('product_infos');
        await queryInterface.dropTable('products');

        // Восстанавливаем таблицы в исходном виде
        // ... (код создания таблиц в исходном виде)

        // Восстанавливаем данные
        if (products.length) await queryInterface.bulkInsert('products', products);
        if (basketProducts.length) await queryInterface.bulkInsert('basket_products', basketProducts);
        if (images.length) await queryInterface.bulkInsert('images', images);
        if (productInfos.length) await queryInterface.bulkInsert('product_infos', productInfos);
    }
}; 