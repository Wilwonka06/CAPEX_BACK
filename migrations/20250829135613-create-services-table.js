'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('servicios', {
      id_servicio: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duracion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      id_categoria_servicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias_servicios',
          key: 'id_categoria_servicio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      foto: {
        type: Sequelize.STRING(250),
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      fecha_actualizacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('services');
  }
};
