'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero agregar el nuevo campo concepto_estado (opcional)
    await queryInterface.addColumn('usuarios', 'concepto_estado', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Concepto o razón del estado actual del usuario (opcional, principalmente para empleados)'
    });

    // Actualizar el campo estado para cambiar 'Suspendido' por 'Inactivo'
    await queryInterface.sequelize.query(`
      UPDATE usuarios 
      SET estado = 'Inactivo', concepto_estado = 'Usuario suspendido - migrado automáticamente'
      WHERE estado = 'Suspendido'
    `);

    // Modificar el ENUM del campo estado para solo permitir 'Activo' e 'Inactivo'
    // Para PostgreSQL
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_usuarios_estado" RENAME TO "enum_usuarios_estado_old"
      `);
      
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_usuarios_estado" AS ENUM('Activo', 'Inactivo')
      `);
      
      await queryInterface.sequelize.query(`
        ALTER TABLE usuarios 
        ALTER COLUMN estado TYPE "enum_usuarios_estado" 
        USING estado::text::"enum_usuarios_estado"
      `);
      
      await queryInterface.sequelize.query(`
        DROP TYPE "enum_usuarios_estado_old"
      `);
    }
    // Para MySQL
    else if (queryInterface.sequelize.getDialect() === 'mysql') {
      await queryInterface.sequelize.query(`
        ALTER TABLE usuarios 
        MODIFY COLUMN estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo'
      `);
    }
    // Para SQLite
    else if (queryInterface.sequelize.getDialect() === 'sqlite') {
      // SQLite no soporta ALTER COLUMN con ENUM, se recrea la tabla
      await queryInterface.sequelize.query(`
        CREATE TABLE usuarios_new (
          id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(100) NOT NULL,
          tipo_documento VARCHAR(50) NOT NULL,
          documento VARCHAR(20) NOT NULL UNIQUE,
          telefono VARCHAR(20) NOT NULL,
          correo VARCHAR(100) NOT NULL UNIQUE,
          contrasena VARCHAR(100) NOT NULL,
          roleId INTEGER,
          foto VARCHAR(255),
          estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
          concepto_estado TEXT,
          direccion TEXT,
          FOREIGN KEY (roleId) REFERENCES roles (id_rol)
        )
      `);
      
      await queryInterface.sequelize.query(`
        INSERT INTO usuarios_new 
        SELECT id_usuario, nombre, tipo_documento, documento, telefono, correo, 
               contrasena, roleId, foto, 
               CASE WHEN estado = 'Suspendido' THEN 'Inactivo' ELSE estado END,
               CASE WHEN estado = 'Suspendido' THEN 'Usuario suspendido - migrado automáticamente' ELSE NULL END,
               direccion
        FROM usuarios
      `);
      
      await queryInterface.sequelize.query(`DROP TABLE usuarios`);
      await queryInterface.sequelize.query(`ALTER TABLE usuarios_new RENAME TO usuarios`);
    }

    console.log('✅ Campo estado actualizado y concepto_estado agregado exitosamente');
  },

  async down(queryInterface, Sequelize) {
    // Revertir el campo concepto_estado
    await queryInterface.removeColumn('usuarios', 'concepto_estado');

    // Revertir el ENUM del campo estado para permitir 'Suspendido' nuevamente
    // Para PostgreSQL
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_usuarios_estado" RENAME TO "enum_usuarios_estado_new"
      `);
      
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_usuarios_estado" AS ENUM('Activo', 'Inactivo', 'Suspendido')
      `);
      
      await queryInterface.sequelize.query(`
        ALTER TABLE usuarios 
        ALTER COLUMN estado TYPE "enum_usuarios_estado" 
        USING estado::text::"enum_usuarios_estado"
      `);
      
      await queryInterface.sequelize.query(`
        DROP TYPE "enum_usuarios_estado_new"
      `);
    }
    // Para MySQL
    else if (queryInterface.sequelize.getDialect() === 'mysql') {
      await queryInterface.sequelize.query(`
        ALTER TABLE usuarios 
        MODIFY COLUMN estado ENUM('Activo', 'Inactivo', 'Suspendido') NOT NULL DEFAULT 'Activo'
      `);
    }
    // Para SQLite
    else if (queryInterface.sequelize.getDialect() === 'sqlite') {
      // Recrear la tabla con el ENUM original
      await queryInterface.sequelize.query(`
        CREATE TABLE usuarios_old (
          id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(100) NOT NULL,
          tipo_documento VARCHAR(50) NOT NULL,
          documento VARCHAR(20) NOT NULL UNIQUE,
          telefono VARCHAR(20) NOT NULL,
          correo VARCHAR(100) NOT NULL UNIQUE,
          contrasena VARCHAR(100) NOT NULL,
          roleId INTEGER,
          foto VARCHAR(255),
          estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
          direccion TEXT,
          FOREIGN KEY (roleId) REFERENCES roles (id_rol)
        )
      `);
      
      await queryInterface.sequelize.query(`
        INSERT INTO usuarios_old 
        SELECT id_usuario, nombre, tipo_documento, documento, telefono, correo, 
               contrasena, roleId, foto, estado, direccion
        FROM usuarios
      `);
      
      await queryInterface.sequelize.query(`DROP TABLE usuarios`);
      await queryInterface.sequelize.query(`ALTER TABLE usuarios_old RENAME TO usuarios`);
    }

    console.log('Campo estado revertido y concepto_estado eliminado exitosamente');
  }
};
