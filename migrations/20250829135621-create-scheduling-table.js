'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('programaciones', {
      id_programacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_empleado: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fin: {
        type: Sequelize.TIME,
        allowNull: false
      },
      tipo_turno: {
        type: Sequelize.ENUM('mañana', 'tarde', 'noche', 'completo'),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('programado', 'en_curso', 'completado', 'cancelado'),
        defaultValue: 'programado'
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

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex('programaciones', ['id_empleado']);
    await queryInterface.addIndex('programaciones', ['fecha']);
    await queryInterface.addIndex('programaciones', ['estado']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('programaciones');
  }
};
