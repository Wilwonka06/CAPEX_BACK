'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
      id_producto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      id_categoria_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categorias_productos',
          key: 'id_categoria_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      costo: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      iva: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      precio_venta: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      fecha_registro: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
      },
      url_foto: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('productos');
  }
};
