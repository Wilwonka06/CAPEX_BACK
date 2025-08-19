'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('fichas_tecnicas', {
      id_ficha_tecnica: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_caracteristica: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'caracteristicas',
          key: 'id_caracteristica'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      valor: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Agregar índice único para evitar duplicados
    await queryInterface.addIndex('fichas_tecnicas', ['id_producto', 'id_caracteristica'], {
      unique: true,
      name: 'unique_product_characteristic'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('fichas_tecnicas');
  }
};
