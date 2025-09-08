'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'estado', {
      type: Sequelize.ENUM('Activo', 'Inactivo', 'Suspendido'),
      allowNull: false,
      defaultValue: 'Activo',
      comment: 'Estado del usuario: Activo, Inactivo, Suspendido'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'estado');
  }
};
