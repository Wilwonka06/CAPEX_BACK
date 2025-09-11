'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('servicios_clientes', {
      id_servicio_cliente: {
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
      id_servicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servicios',
          key: 'id_servicio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_servicio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_entrada: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_salida: {
        type: Sequelize.TIME,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM(
          'Agendada',
          'Confirmada',
          'Reprogramada',
          'En proceso',
          'Finalizada',
          'Pagada',
          'Cancelada por el cliente',
          'No asistio'
        ),
        allowNull: false,
        defaultValue: 'Agendada'
      },
      valor_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      motivo: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex('servicios_clientes', ['id_usuario']);
    await queryInterface.addIndex('servicios_clientes', ['id_servicio']);
    await queryInterface.addIndex('servicios_clientes', ['fecha_servicio']);
    await queryInterface.addIndex('servicios_clientes', ['estado']);
    await queryInterface.addIndex('servicios_clientes', ['id_usuario', 'fecha_servicio']);

    // Agregar constraint para validar que hora_salida > hora_entrada
    await queryInterface.addConstraint('servicios_clientes', {
      fields: ['hora_entrada', 'hora_salida'],
      type: 'check',
      name: 'check_hora_salida_mayor_entrada',
      where: {
        hora_salida: {
          [Sequelize.Op.gt]: Sequelize.col('hora_entrada')
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('servicios_clientes');
  }
};
