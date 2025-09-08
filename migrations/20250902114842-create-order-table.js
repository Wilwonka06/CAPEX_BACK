'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'),
        defaultValue: 'Pendiente'
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
    await queryInterface.dropTable('pedidos');
  }
};