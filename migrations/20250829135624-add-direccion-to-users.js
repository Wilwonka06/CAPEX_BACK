'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'direccion', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Dirección completa del usuario'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'direccion');
  }
};
