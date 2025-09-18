'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primero, crear la nueva tabla con la estructura actualizada
    await queryInterface.createTable('detalles_servicios_clientes', {
      id_detalle_servicio_cliente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_empleado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_servicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servicios',
          key: 'id_servicio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_cita: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'citas',
          key: 'id_cita'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_finalizacion: {
        type: Sequelize.TIME,
        allowNull: false
      },
      duracion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha_programada: {
        type: Sequelize.DATEONLY,
        allowNull: true
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
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('detalles_servicios_clientes', ['id_empleado']);
    await queryInterface.addIndex('detalles_servicios_clientes', ['id_servicio']);
    await queryInterface.addIndex('detalles_servicios_clientes', ['id_cita']);
    await queryInterface.addIndex('detalles_servicios_clientes', ['fecha_programada']);
    await queryInterface.addIndex('detalles_servicios_clientes', ['estado']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('detalles_servicios_clientes');
  }
};
