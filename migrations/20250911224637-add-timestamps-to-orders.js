'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Verificar si las columnas ya existen antes de agregarlas
    const tableDesc = await queryInterface.describeTable('pedidos');
    
    if (!tableDesc.fecha_creacion) {
      await queryInterface.addColumn('pedidos', 'fecha_creacion', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      });
    }
    
    if (!tableDesc.fecha_actualizacion) {
      await queryInterface.addColumn('pedidos', 'fecha_actualizacion', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      });
    }

    // Agregar índices si no existen
    const indexes = await queryInterface.showIndex('pedidos');
    const indexNames = indexes.map(index => index.name);
    
    if (!indexNames.includes('pedidos_fecha')) {
      await queryInterface.addIndex('pedidos', ['fecha'], { name: 'pedidos_fecha' });
    }
    
    if (!indexNames.includes('pedidos_estado')) {
      await queryInterface.addIndex('pedidos', ['estado'], { name: 'pedidos_estado' });
    }
    
    if (!indexNames.includes('pedidos_fecha_creacion')) {
      await queryInterface.addIndex('pedidos', ['fecha_creacion'], { name: 'pedidos_fecha_creacion' });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('pedidos', 'pedidos_fecha');
    await queryInterface.removeIndex('pedidos', 'pedidos_estado');
    await queryInterface.removeIndex('pedidos', 'pedidos_fecha_creacion');
    await queryInterface.removeColumn('pedidos', 'fecha_creacion');
    await queryInterface.removeColumn('pedidos', 'fecha_actualizacion');
  }
};