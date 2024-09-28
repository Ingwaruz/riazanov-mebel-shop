'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('products', 'width', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('products', 'depth', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('products', 'height', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('products', 'collectionId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'collection', // название таблицы, с которой связана эта колонка
          key: 'id',            // название колонки внешнего ключа
        },
        onUpdate: 'CASCADE',   // что произойдет при обновлении или удалении записи
        onDelete: 'CASCADE',
      }),
      // добавьте другие столбцы, если нужно
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('products', 'img'),
      // удалите другие столбцы, если нужно
    ]);
  },
};