'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la tabla clientes
    await queryInterface.dropTable('clientes');
    
    console.log('✅ Tabla clientes eliminada exitosamente');
  },

  async down(queryInterface, Sequelize) {
    // Recrear la tabla clientes
    await queryInterface.createTable('clientes', {
      id_cliente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      direccion: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fecha_actualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Agregar índices
    await queryInterface.addIndex('clientes', ['id_usuario'], {
      name: 'idx_clientes_usuario',
      unique: true
    });

    await queryInterface.addIndex('clientes', ['estado'], {
      name: 'idx_clientes_estado'
    });

    await queryInterface.addIndex('clientes', ['fecha_creacion'], {
      name: 'idx_clientes_fecha_creacion'
    });

    // Agregar constraint de unique para id_usuario
    await queryInterface.addConstraint('clientes', {
      fields: ['id_usuario'],
      type: 'unique',
      name: 'uk_cliente_usuario'
    });

    console.log('Tabla clientes recreada exitosamente');
  }
};
