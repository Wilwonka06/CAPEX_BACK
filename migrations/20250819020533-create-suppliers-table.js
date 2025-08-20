'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('proveedores', {
      id_proveedor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nit: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      tipo_proveedor: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue: 'N'
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      correo: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      contacto: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'Activo'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('proveedores');
  }
};
