module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Удаляем ограничение уникальности с поля name
        await queryInterface.removeConstraint('products', 'products_name_key');
        
        // Изменяем тип колонки без ограничения уникальности
        await queryInterface.changeColumn('products', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Возвращаем ограничение уникальности
        await queryInterface.changeColumn('products', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        });
    }
}; 