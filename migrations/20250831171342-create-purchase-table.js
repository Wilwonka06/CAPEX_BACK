'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('compras', {
      id_compra: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_proveedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'proveedores',
          key: 'id_proveedor'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha_registro: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      fecha_compra: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      iva: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING(10),
        allowNull: true,
        validate: {
          isIn: [['Completada', 'Cancelada']]
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('compras');
  }
};