'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('programaciones', {
      id_programacion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fecha_inicio: {
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Restricción única (fecha_inicio, hora_entrada, id_usuario)
    await queryInterface.addConstraint('programaciones', {
      fields: ['fecha_inicio', 'hora_entrada', 'id_usuario'],
      type: 'unique',
      name: 'unique_programacion_usuario'
    });

    // Restricción CHECK (hora_salida > hora_entrada)
    await queryInterface.sequelize.query(`
      ALTER TABLE programaciones
      ADD CONSTRAINT chk_horas CHECK (hora_salida > hora_entrada)
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('programaciones');
  }
};
