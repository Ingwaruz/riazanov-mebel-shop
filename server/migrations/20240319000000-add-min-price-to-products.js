module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('products', 'min_price', {
            type: Sequelize.INTEGER,
            allowNull: true,
            after: 'price'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('products', 'min_price');
    }
}; 