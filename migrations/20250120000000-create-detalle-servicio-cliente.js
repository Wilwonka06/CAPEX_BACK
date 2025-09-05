'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detalle_servicio_cliente', {
      id_detalle: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_servicio_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servicios_clientes',
          key: 'id_servicio_cliente'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'productos',
          key: 'id_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_servicio: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'servicios',
          key: 'id_servicio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_empleado: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'empleados',
          key: 'id_empleado'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('En ejecución', 'Pagada', 'Anulada'),
        allowNull: false,
        defaultValue: 'En ejecución'
      },
      fecha_servicio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_finalizacion: {
        type: Sequelize.TIME,
        allowNull: false
      },
      dinero_proporcionado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      }
    }, {
      // Configuraciones adicionales
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // Crear índices para mejorar el rendimiento
    await queryInterface.addIndex('detalle_servicio_cliente', ['id_servicio_cliente'], {
      name: 'idx_detalle_servicio_cliente_id_servicio_cliente'
    });

    await queryInterface.addIndex('detalle_servicio_cliente', ['id_producto'], {
      name: 'idx_detalle_servicio_cliente_id_producto'
    });

    await queryInterface.addIndex('detalle_servicio_cliente', ['id_servicio'], {
      name: 'idx_detalle_servicio_cliente_id_servicio'
    });

    await queryInterface.addIndex('detalle_servicio_cliente', ['id_empleado'], {
      name: 'idx_detalle_servicio_cliente_id_empleado'
    });

    await queryInterface.addIndex('detalle_servicio_cliente', ['estado'], {
      name: 'idx_detalle_servicio_cliente_estado'
    });

    await queryInterface.addIndex('detalle_servicio_cliente', ['fecha_servicio'], {
      name: 'idx_detalle_servicio_cliente_fecha_servicio'
    });

    // Índice compuesto para consultas frecuentes
    await queryInterface.addIndex('detalle_servicio_cliente', ['id_servicio_cliente', 'estado'], {
      name: 'idx_detalle_servicio_cliente_servicio_estado'
    });

    console.log('✅ Tabla detalle_servicio_cliente creada exitosamente');
    console.log('✅ Índices creados para optimizar consultas');
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar índices primero
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_servicio_estado');
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_fecha_servicio');
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_estado');
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_id_empleado');
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_id_servicio');
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_id_producto');
    await queryInterface.removeIndex('detalle_servicio_cliente', 'idx_detalle_servicio_cliente_id_servicio_cliente');

    // Eliminar la tabla
    await queryInterface.dropTable('detalle_servicio_cliente');
    
    console.log('🗑️ Tabla detalle_servicio_cliente eliminada');
  }
};

