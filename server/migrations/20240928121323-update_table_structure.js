// 'use strict';
//
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     return Promise.all([
//       queryInterface.changeColumn('types', 'type_collection_id', {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//       }),
//     ]);
//   },
//
//   // down: async (queryInterface, Sequelize) => {
//   //   return Promise.all([
//   //     queryInterface.changeColumn('products', 'width', {
//   //       type: Sequelize.INTEGER,
//   //       allowNull: false,
//   //     }),
//   //     // Вернуть другие колонки в прежнее состояние, если нужно
//   //   ]);
//   // },
// };