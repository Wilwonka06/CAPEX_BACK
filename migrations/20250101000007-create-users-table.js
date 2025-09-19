'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipo_documento: {
        type: Sequelize.ENUM('Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'),
        allowNull: false
      },
      documento: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      contrasena: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'roles',
          key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      foto: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL o ruta de la foto del usuario'
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Dirección completa del usuario'
      },
      concepto_estado: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Concepto o razón del estado actual del usuario (opcional, requerido para empleados)'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
