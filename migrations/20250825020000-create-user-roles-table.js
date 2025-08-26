'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios_roles', {
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'roles',
          key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_asignacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
      }
    });

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex('usuarios_roles', ['id_usuario']);
    await queryInterface.addIndex('usuarios_roles', ['id_rol']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios_roles');
  }
};
