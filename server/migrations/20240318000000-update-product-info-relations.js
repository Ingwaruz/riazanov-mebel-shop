module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Сначала удаляем существующие связи
        await queryInterface.removeConstraint('product_infos', 'product_infos_productId_fkey');
        await queryInterface.removeConstraint('product_infos', 'product_infos_featureId_fkey');

        // Добавляем новые связи с правильными внешними ключами
        await queryInterface.addConstraint('product_infos', {
            fields: ['productId'],
            type: 'foreign key',
            name: 'product_infos_productId_fkey',
            references: {
                table: 'products',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('product_infos', {
            fields: ['featureId'],
            type: 'foreign key',
            name: 'product_infos_featureId_fkey',
            references: {
                table: 'features',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Обновляем индексы для оптимизации запросов
        await queryInterface.addIndex('product_infos', ['productId']);
        await queryInterface.addIndex('product_infos', ['featureId']);
    },

    down: async (queryInterface, Sequelize) => {
        // Удаляем индексы
        await queryInterface.removeIndex('product_infos', ['productId']);
        await queryInterface.removeIndex('product_infos', ['featureId']);

        // Удаляем новые связи
        await queryInterface.removeConstraint('product_infos', 'product_infos_productId_fkey');
        await queryInterface.removeConstraint('product_infos', 'product_infos_featureId_fkey');

        // Восстанавливаем старые связи (если нужно)
        await queryInterface.addConstraint('product_infos', {
            fields: ['productId'],
            type: 'foreign key',
            references: {
                table: 'products',
                field: 'id'
            }
        });
    }
}; 