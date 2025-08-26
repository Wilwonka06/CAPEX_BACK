require('dotenv').config();
const { sequelize } = require('../src/config/database');

// Importar modelos individualmente
const { Usuario } = require('../src/models/User');
const { Role } = require('../src/models/roles');
const UserRole = require('../src/models/UserRole');

async function testAssociations() {
  try {
    console.log('🧪 Probando asociaciones paso a paso...\n');

    // 1. Verificar que los modelos se importan correctamente
    console.log('1. Verificando importación de modelos...');
    console.log('Usuario:', typeof Usuario);
    console.log('Role:', typeof Role);
    console.log('UserRole:', typeof UserRole);
    console.log('✅ Modelos importados correctamente\n');

    // 2. Verificar que las tablas existen
    console.log('2. Verificando existencia de tablas...');
    const [usuariosResult] = await sequelize.query("SHOW TABLES LIKE 'usuarios'");
    const [rolesResult] = await sequelize.query("SHOW TABLES LIKE 'roles'");
    const [userRolesResult] = await sequelize.query("SHOW TABLES LIKE 'usuarios_roles'");
    
    console.log('Tabla usuarios existe:', usuariosResult.length > 0);
    console.log('Tabla roles existe:', rolesResult.length > 0);
    console.log('Tabla usuarios_roles existe:', userRolesResult.length > 0);
    console.log('✅ Todas las tablas existen\n');

    // 3. Verificar datos en las tablas
    console.log('3. Verificando datos en las tablas...');
    const usuariosCount = await Usuario.count();
    const rolesCount = await Role.count();
    const userRolesCount = await UserRole.count();
    
    console.log(`Usuarios: ${usuariosCount}`);
    console.log(`Roles: ${rolesCount}`);
    console.log(`Asignaciones usuario-rol: ${userRolesCount}\n`);

    // 4. Mostrar roles disponibles
    console.log('4. Roles disponibles:');
    const roles = await Role.findAll();
    roles.forEach(role => {
      console.log(`  - ID: ${role.id_rol}, Nombre: ${role.nombre}`);
    });
    console.log('');

    // 5. Probar consulta simple de usuarios
    console.log('5. Probando consulta simple de usuarios...');
    const usuarios = await Usuario.findAll({
      attributes: ['id_usuario', 'nombre', 'correo', 'roleId']
    });
    console.log(`Encontrados ${usuarios.length} usuarios`);
    usuarios.forEach(usuario => {
      console.log(`  - ${usuario.nombre} (${usuario.correo}) - RoleId: ${usuario.roleId}`);
    });
    console.log('');

    // 6. Probar consulta simple de roles
    console.log('6. Probando consulta simple de roles...');
    const rolesSimple = await Role.findAll({
      attributes: ['id_rol', 'nombre']
    });
    console.log(`Encontrados ${rolesSimple.length} roles`);
    rolesSimple.forEach(role => {
      console.log(`  - ${role.nombre} (ID: ${role.id_rol})`);
    });
    console.log('');

    // 7. Probar consulta de UserRole
    console.log('7. Probando consulta de UserRole...');
    const userRoles = await UserRole.findAll();
    console.log(`Encontradas ${userRoles.length} asignaciones usuario-rol`);
    userRoles.forEach(ur => {
      console.log(`  - Usuario ${ur.id_usuario} -> Rol ${ur.id_rol} (${ur.estado})`);
    });
    console.log('');

    // 8. Probar join manual
    console.log('8. Probando join manual...');
    const [joinResult] = await sequelize.query(`
      SELECT u.nombre, u.correo, r.nombre as rol_nombre
      FROM usuarios u
      LEFT JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
      LEFT JOIN roles r ON ur.id_rol = r.id_rol
      LIMIT 5
    `);
    console.log('Resultado del join manual:');
    joinResult.forEach(row => {
      console.log(`  - ${row.nombre} (${row.correo}) -> ${row.rol_nombre || 'Sin rol'}`);
    });
    console.log('');

    console.log('✅ Pruebas básicas completadas exitosamente');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar las pruebas
testAssociations();
