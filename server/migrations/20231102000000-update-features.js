module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Удаляем уникальное ограничение с имени характеристики
        await queryInterface.changeColumn('features', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        });

        // Добавляем составной уникальный индекс для связей
        await queryInterface.addIndex(
            'feature_to_type_factories',
            ['featureId', 'typeId', 'factoryId'],
            {
                unique: true,
                name: 'feature_type_factory_unique'
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Возвращаем уникальное ограничение на имя
        await queryInterface.changeColumn('features', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        });

        // Удаляем составной индекс
        await queryInterface.removeIndex(
            'feature_to_type_factories',
            'feature_type_factory_unique'
        );
    }
}; 