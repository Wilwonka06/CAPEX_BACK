const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../src/models/roles');
const { sequelize } = require('../src/config/database');

const reinicializarPermisos = async () => {
  try {
    console.log('🔄 Reinicializando sistema de permisos y privilegios...\n');

    // 1. Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    
    await RolePermissionPrivilege.destroy({ where: {} });
    console.log('  ✅ Combinaciones eliminadas');
    
    await Role.destroy({ where: {} });
    console.log('  ✅ Roles eliminados');
    
    await Permission.destroy({ where: {} });
    console.log('  ✅ Permisos eliminados');
    
    await Privilege.destroy({ where: {} });
    console.log('  ✅ Privilegios eliminados');

    // 2. Crear permisos (MÓDULOS DEL SISTEMA)
    console.log('\n📋 Creando permisos (módulos del sistema)...');
    const permisos = await Permission.bulkCreate([
      { nombre: 'Compras' },
      { nombre: 'Servicios' },
      { nombre: 'Venta' },
      { nombre: 'Configuración' },
      { nombre: 'Usuarios' }
    ]);
    console.log('  ✅ Permisos creados:', permisos.map(p => p.nombre).join(', '));

    // 3. Crear privilegios (ACCIONES)
    console.log('\n🔧 Creando privilegios (acciones)...');
    const privilegios = await Privilege.bulkCreate([
      { nombre: 'Create' },
      { nombre: 'Read' },
      { nombre: 'Edit' },
      { nombre: 'Delete' }
    ]);
    console.log('  ✅ Privilegios creados:', privilegios.map(p => p.nombre).join(', '));

    // 4. Crear roles
    console.log('\n👥 Creando roles...');
    const roles = await Role.bulkCreate([
      { 
        nombre: 'Administrador',
        descripcion: 'Rol con acceso completo al sistema',
        estado_rol: true
      },
      { 
        nombre: 'Empleado',
        descripcion: 'Rol con acceso limitado para operaciones diarias',
        estado_rol: true
      },
      { 
        nombre: 'Cliente',
        descripcion: 'Rol para clientes del sistema',
        estado_rol: true
      }
    ]);
    console.log('  ✅ Roles creados:', roles.map(r => r.nombre).join(', '));

    // 5. Obtener referencias
    const adminRole = roles.find(r => r.nombre === 'Administrador');
    const employeeRole = roles.find(r => r.nombre === 'Empleado');
    const clientRole = roles.find(r => r.nombre === 'Cliente');

    const comprasPermission = permisos.find(p => p.nombre === 'Compras');
    const serviciosPermission = permisos.find(p => p.nombre === 'Servicios');
    const ventaPermission = permisos.find(p => p.nombre === 'Venta');
    const configuracionPermission = permisos.find(p => p.nombre === 'Configuración');
    const usuariosPermission = permisos.find(p => p.nombre === 'Usuarios');

    const createPrivilege = privilegios.find(p => p.nombre === 'Create');
    const readPrivilege = privilegios.find(p => p.nombre === 'Read');
    const editPrivilege = privilegios.find(p => p.nombre === 'Edit');
    const deletePrivilege = privilegios.find(p => p.nombre === 'Delete');

    // 6. Asignar combinaciones - ADMINISTRADOR
    console.log('\n🔗 Asignando combinaciones al Administrador...');
    const adminCombinaciones = [];
    
    // Administrador tiene acceso completo a todo
    for (const permiso of permisos) {
      for (const privilegio of privilegios) {
        adminCombinaciones.push({
          id_rol: adminRole.id_rol,
          id_permiso: permiso.id_permiso,
          id_privilegio: privilegio.id_privilegio
        });
      }
    }
    
    await RolePermissionPrivilege.bulkCreate(adminCombinaciones);
    console.log(`  ✅ ${adminCombinaciones.length} combinaciones asignadas al Administrador`);

    // 7. Asignar combinaciones - EMPLEADO
    console.log('\n🔗 Asignando combinaciones al Empleado...');
    const employeeCombinaciones = [];
    
    // Empleado puede: Read, Create, Edit en Compras, Servicios, Venta
    const employeePermisos = [comprasPermission, serviciosPermission, ventaPermission];
    const employeePrivileges = [createPrivilege, readPrivilege, editPrivilege];
    
    for (const permiso of employeePermisos) {
      for (const privilegio of employeePrivileges) {
        employeeCombinaciones.push({
          id_rol: employeeRole.id_rol,
          id_permiso: permiso.id_permiso,
          id_privilegio: privilegio.id_privilegio
        });
      }
    }
    
    await RolePermissionPrivilege.bulkCreate(employeeCombinaciones);
    console.log(`  ✅ ${employeeCombinaciones.length} combinaciones asignadas al Empleado`);

    // 8. Asignar combinaciones - CLIENTE
    console.log('\n🔗 Asignando combinaciones al Cliente...');
    const clientCombinaciones = [];
    
    // Cliente puede: Read en Servicios y Venta
    const clientPermisos = [serviciosPermission, ventaPermission];
    
    for (const permiso of clientPermisos) {
      clientCombinaciones.push({
        id_rol: clientRole.id_rol,
        id_permiso: permiso.id_permiso,
        id_privilegio: readPrivilege.id_privilegio
      });
    }
    
    await RolePermissionPrivilege.bulkCreate(clientCombinaciones);
    console.log(`  ✅ ${clientCombinaciones.length} combinaciones asignadas al Cliente`);

    // 9. Verificar resultados
    console.log('\n📊 RESUMEN FINAL:');
    const totalCombinaciones = await RolePermissionPrivilege.count();
    console.log(`  🔗 Total combinaciones creadas: ${totalCombinaciones}`);
    
    const adminCount = await RolePermissionPrivilege.count({ where: { id_rol: adminRole.id_rol } });
    const employeeCount = await RolePermissionPrivilege.count({ where: { id_rol: employeeRole.id_rol } });
    const clientCount = await RolePermissionPrivilege.count({ where: { id_rol: clientRole.id_rol } });
    
    console.log(`  👑 Administrador: ${adminCount} combinaciones`);
    console.log(`  👨‍💼 Empleado: ${employeeCount} combinaciones`);
    console.log(`  👤 Cliente: ${clientCount} combinaciones`);

    console.log('\n🎉 Reinicialización completada exitosamente!');
    console.log('\n💡 Para verificar la configuración, ejecuta:');
    console.log('   node scripts/verificar-permisos.js');

  } catch (error) {
    console.error('❌ Error durante la reinicialización:', error);
  } finally {
    await sequelize.close();
  }
};

// Ejecutar la reinicialización
reinicializarPermisos();
