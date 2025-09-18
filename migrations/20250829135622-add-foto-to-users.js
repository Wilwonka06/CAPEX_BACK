'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'foto', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'URL o ruta de la foto del usuario'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'foto');
  }
};
