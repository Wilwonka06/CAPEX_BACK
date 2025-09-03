'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla ventas_productos
    await queryInterface.createTable('ventas_productos', {
      id_venta_producto: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clientes',
          key: 'id_cliente'
        },
        onDelete: 'SET NULL'
      },
      total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      estado: {
        type: Sequelize.STRING(10),
        allowNull: true,
        validate: {
          isIn: [['Completado', 'Cancelado', 'Pendiente']]
        }
      }
    });

    // Crear tabla detalles_ventas_productos
    await queryInterface.createTable('detalles_ventas_productos', {
      id_detalle_venta_producto: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_venta_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ventas_productos',
          key: 'id_venta_producto'
        },
        onDelete: 'CASCADE'
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'productos',
          key: 'id_producto'
        },
        onDelete: 'SET NULL'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detalles_ventas_productos');
    await queryInterface.dropTable('ventas_productos');
  }
};