'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear la tabla clientes
    await queryInterface.createTable('clientes', {
      id_cliente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      direccion: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fecha_actualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Agregar índices
    await queryInterface.addIndex('clientes', ['id_usuario'], {
      name: 'idx_clientes_usuario',
      unique: true // Un usuario solo puede ser cliente una vez
    });

    await queryInterface.addIndex('clientes', ['estado'], {
      name: 'idx_clientes_estado'
    });

    await queryInterface.addIndex('clientes', ['fecha_creacion'], {
      name: 'idx_clientes_fecha_creacion'
    });

    // Agregar constraint de unique para id_usuario
    await queryInterface.addConstraint('clientes', {
      fields: ['id_usuario'],
      type: 'unique',
      name: 'uk_cliente_usuario'
    });

    // Crear función y trigger para actualizar fecha_actualizacion (solo para PostgreSQL)
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

      await queryInterface.sequelize.query(`
        CREATE TRIGGER trigger_update_fecha_actualizacion
            BEFORE UPDATE ON clientes
            FOR EACH ROW
            EXECUTE FUNCTION update_fecha_actualizacion();
      `);
    }

    console.log('✅ Tabla clientes creada exitosamente');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar triggers y funciones (solo para PostgreSQL)
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS trigger_update_fecha_actualizacion ON clientes;
      `);

      await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS update_fecha_actualizacion();
      `);
    }

    // Eliminar índices
    await queryInterface.removeIndex('clientes', 'idx_clientes_usuario');
    await queryInterface.removeIndex('clientes', 'idx_clientes_estado');
    await queryInterface.removeIndex('clientes', 'idx_clientes_fecha_creacion');

    // Eliminar la tabla
    await queryInterface.dropTable('clientes');

    console.log('Tabla clientes eliminada exitosamente');
  }
};