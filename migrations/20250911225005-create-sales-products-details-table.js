'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('detalles_ventas_productos', {
      id_detalle_venta_producto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_venta_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ventas_productos',
          key: 'id_venta_producto'
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
      id_servicios_cliente: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'servicios_clientes',
          key: 'id_servicio_cliente'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      descuento_unitario: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0
      }
    });

    // Crear índices
    await queryInterface.addIndex('detalles_ventas_productos', ['id_venta_producto']);
    await queryInterface.addIndex('detalles_ventas_productos', ['id_producto']);
    await queryInterface.addIndex('detalles_ventas_productos', ['id_servicios_cliente']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('detalles_ventas_productos');
  }
};
