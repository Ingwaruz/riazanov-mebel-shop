module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const backup = { types: [], factories: [], features: [], feature_type_factories: [] };
            
            // Проверяем существование таблиц перед чтением данных
            try {
                backup.types = await queryInterface.sequelize.query(
                    'SELECT * FROM types',
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );
            } catch (e) {
                console.log('Table types not found');
            }

            try {
                backup.factories = await queryInterface.sequelize.query(
                    'SELECT * FROM factories',
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );
            } catch (e) {
                console.log('Table factories not found');
            }

            try {
                backup.features = await queryInterface.sequelize.query(
                    'SELECT * FROM features',
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );
            } catch (e) {
                console.log('Table features not found');
            }

            try {
                backup.feature_type_factories = await queryInterface.sequelize.query(
                    'SELECT * FROM feature_type_factories',
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );
            } catch (e) {
                console.log('Table feature_type_factories not found');
            }

            // Сохраняем в файлы
            const fs = require('fs');
            const path = require('path');
            const backupDir = path.resolve(__dirname, '..', 'backup');

            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir);
            }

            fs.writeFileSync(path.join(backupDir, 'backup.json'), JSON.stringify(backup));

            // Удаляем существующие таблицы
            try {
                await queryInterface.dropTable('feature_type_factories', { cascade: true });
            } catch (e) {}
            try {
                await queryInterface.dropTable('features', { cascade: true });
            } catch (e) {}
            try {
                await queryInterface.dropTable('factories', { cascade: true });
            } catch (e) {}
            try {
                await queryInterface.dropTable('types', { cascade: true });
            } catch (e) {}

            // Создаем таблицы заново
            await queryInterface.createTable('types', {
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
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            });

            await queryInterface.createTable('factories', {
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
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            });

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
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            });

            await queryInterface.createTable('feature_type_factories', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                featureId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'features',
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
                factoryId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'factories',
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

            // Восстанавливаем данные, если они были
            if (backup.types.length) {
                for (const type of backup.types) {
                    await queryInterface.bulkInsert('types', [{
                        id: type.id,
                        name: type.name,
                        createdAt: type.createdAt,
                        updatedAt: type.updatedAt
                    }]);
                }
            }

            if (backup.factories.length) {
                for (const factory of backup.factories) {
                    await queryInterface.bulkInsert('factories', [{
                        id: factory.id,
                        name: factory.name,
                        createdAt: factory.createdAt,
                        updatedAt: factory.updatedAt
                    }]);
                }
            }

            if (backup.features.length) {
                for (const feature of backup.features) {
                    await queryInterface.bulkInsert('features', [{
                        id: feature.id,
                        name: feature.name,
                        createdAt: feature.createdAt,
                        updatedAt: feature.updatedAt
                    }]);
                }
            }

            if (backup.feature_type_factories.length) {
                await queryInterface.bulkInsert('feature_type_factories', backup.feature_type_factories);
            }

        } catch (error) {
            console.error('Error during backup and recreation:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        // В случае отката можно восстановить данные из бэкапа
        const fs = require('fs');
        const path = require('path');
        const backupPath = path.join(__dirname, '..', 'backup', 'backup.json');
        
        if (fs.existsSync(backupPath)) {
            const backup = JSON.parse(fs.readFileSync(backupPath));
            
            if (backup.types.length) await queryInterface.bulkInsert('types', backup.types);
            if (backup.factories.length) await queryInterface.bulkInsert('factories', backup.factories);
            if (backup.features.length) await queryInterface.bulkInsert('features', backup.features);
            if (backup.feature_type_factories.length) {
                await queryInterface.bulkInsert('feature_type_factories', backup.feature_type_factories);
            }
        }
    }
}; 