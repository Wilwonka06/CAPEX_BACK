'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'roles',
        key: 'id_rol'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Agregar índice para mejorar el rendimiento
    await queryInterface.addIndex('usuarios', ['roleId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('usuarios', 'roleId');
  }
};
