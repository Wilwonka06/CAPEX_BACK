'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('roles_permisos_privilegios', {
      id_rpp: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_permiso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permisos',
          key: 'id_permiso'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_privilegio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'privilegios',
          key: 'id_privilegio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('roles_permisos_privilegios');
  }
};
