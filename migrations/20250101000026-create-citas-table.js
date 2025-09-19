'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('citas', {
      id_cita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
          'Cancelada por el usuario',
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
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      fecha_actualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Crear índices para optimizar consultas
    await queryInterface.addIndex('citas', ['id_cliente']);
    await queryInterface.addIndex('citas', ['fecha_servicio']);
    await queryInterface.addIndex('citas', ['estado']);
    await queryInterface.addIndex('citas', ['fecha_servicio', 'hora_entrada']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('citas');
  }
};
