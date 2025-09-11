'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ventas_productos', {
      id_venta_producto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_pedido: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pedidos',
          key: 'id_pedido'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      descuento: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      },
      metodo_pago: {
        type: Sequelize.ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'Otro'),
        allowNull: true,
        defaultValue: 'Efectivo'
      },
      estado: {
        type: Sequelize.ENUM('Completado', 'Cancelado', 'Pendiente'),
        allowNull: false,
        defaultValue: 'Completado'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Crear índices
    await queryInterface.addIndex('ventas_productos', ['fecha']);
    await queryInterface.addIndex('ventas_productos', ['id_usuario']);
    await queryInterface.addIndex('ventas_productos', ['estado']);
    await queryInterface.addIndex('ventas_productos', ['id_pedido']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ventas_productos');
  }
};