'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      documentType: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      documentNumber: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });

    // Crear índices para mejorar performance
    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });

    await queryInterface.addIndex('Users', ['documentType', 'documentNumber'], {
      unique: true,
      name: 'users_document_unique'
    });

    await queryInterface.addIndex('Users', ['roleId'], {
      name: 'users_roleId_index'
    });

    await queryInterface.addIndex('Users', ['name'], {
      name: 'users_name_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
