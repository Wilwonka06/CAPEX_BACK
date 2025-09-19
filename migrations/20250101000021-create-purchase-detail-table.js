'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detalles_compras', {
      id_detalle_compra: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_compra: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'compras',
          key: 'id_compra'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'productos',
          key: 'id_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0
        }
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      }
    });

    // Índice para optimizar consultas
    await queryInterface.addIndex('detalles_compras', ['id_compra']);
    await queryInterface.addIndex('detalles_compras', ['id_producto']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detalles_compras');
  }
};