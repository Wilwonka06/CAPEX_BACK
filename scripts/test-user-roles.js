const { Usuario } = require('../src/models/User');
const { Role } = require('../src/models/roles');
const UserRole = require('../src/models/UserRole');
const UserRoleService = require('../src/services/UserRoleService');

async function testUserRoles() {
  try {
    console.log('🧪 Iniciando pruebas de asignación de roles a usuarios...\n');

    // 1. Verificar que existen usuarios y roles
    console.log('1. Verificando usuarios y roles existentes...');
    const usuarios = await Usuario.findAll({ limit: 3 });
    const roles = await Role.findAll({ limit: 3 });

    if (usuarios.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    if (roles.length === 0) {
      console.log('❌ No hay roles en la base de datos');
      return;
    }

    console.log(`✅ Encontrados ${usuarios.length} usuarios y ${roles.length} roles\n`);

    // 2. Probar asignación de rol
    console.log('2. Probando asignación de rol...');
    const usuario = usuarios[0];
    const rol = roles[0];

    console.log(`   Asignando rol "${rol.nombre}" al usuario "${usuario.nombre}"...`);
    
    try {
      const resultado = await UserRoleService.asignarRolAUsuario(usuario.id_usuario, rol.id_rol);
      console.log('   ✅ Rol asignado correctamente:', resultado.message);
    } catch (error) {
      if (error.message.includes('ya tiene asignado')) {
        console.log('   ⚠️  El usuario ya tiene este rol asignado (esto es normal)');
      } else {
        console.log('   ❌ Error al asignar rol:', error.message);
      }
    }

    // 3. Probar obtener roles del usuario
    console.log('\n3. Probando obtención de roles del usuario...');
    try {
      const rolesUsuario = await UserRoleService.obtenerRolesDeUsuario(usuario.id_usuario);
      console.log(`   ✅ Usuario tiene ${rolesUsuario.data.length} roles asignados:`);
      rolesUsuario.data.forEach(rol => {
        console.log(`      - ${rol.nombre}: ${rol.descripcion}`);
      });
    } catch (error) {
      console.log('   ❌ Error al obtener roles:', error.message);
    }

    // 4. Probar obtener usuarios del rol
    console.log('\n4. Probando obtención de usuarios del rol...');
    try {
      const usuariosRol = await UserRoleService.obtenerUsuariosDeRol(rol.id_rol);
      console.log(`   ✅ El rol "${rol.nombre}" tiene ${usuariosRol.data.length} usuarios asignados:`);
      usuariosRol.data.forEach(usuario => {
        console.log(`      - ${usuario.nombre} (${usuario.correo})`);
      });
    } catch (error) {
      console.log('   ❌ Error al obtener usuarios del rol:', error.message);
    }

    // 5. Probar verificación de rol
    console.log('\n5. Probando verificación de rol...');
    try {
      const tieneRol = await UserRoleService.usuarioTieneRol(usuario.id_usuario, rol.nombre);
      console.log(`   ✅ Usuario ${usuario.nombre} tiene rol "${rol.nombre}": ${tieneRol.tieneRol}`);
    } catch (error) {
      console.log('   ❌ Error al verificar rol:', error.message);
    }

    // 6. Probar obtener todas las asignaciones
    console.log('\n6. Probando obtención de todas las asignaciones...');
    try {
      const asignaciones = await UserRoleService.obtenerTodasLasAsignaciones();
      console.log(`   ✅ Total de asignaciones activas: ${asignaciones.data.length}`);
      asignaciones.data.slice(0, 3).forEach(asignacion => {
        console.log(`      - ${asignacion.usuario.nombre} → ${asignacion.rol.nombre}`);
      });
    } catch (error) {
      console.log('   ❌ Error al obtener asignaciones:', error.message);
    }

    // 7. Probar obtener usuarios con roles
    console.log('\n7. Probando obtención de usuarios con roles...');
    try {
      const usuariosConRoles = await UserRoleService.obtenerUsuariosConRoles();
      console.log(`   ✅ Total de usuarios con roles: ${usuariosConRoles.data.length}`);
      usuariosConRoles.data.slice(0, 3).forEach(usuario => {
        console.log(`      - ${usuario.nombre}: ${usuario.roles.length} roles`);
      });
    } catch (error) {
      console.log('   ❌ Error al obtener usuarios con roles:', error.message);
    }

    console.log('\n🎉 Pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
}

// Ejecutar las pruebas
testUserRoles();
