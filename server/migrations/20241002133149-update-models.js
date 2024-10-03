'use strict';

module.exports = {
  // up: async (queryInterface, Sequelize) => {
  //   return Promise.all([
  //     queryInterface.changeColumn('types', 'type_collection_id', {
  //       type: Sequelize.INTEGER,
  //       allowNull: true,
  //     }),
  //   ]);
  // },

  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('collections', 'typeId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
    ]);
  },
};
