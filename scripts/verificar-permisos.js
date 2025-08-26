const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../src/models/roles');
const { sequelize } = require('../src/config/database');

const verificarPermisos = async () => {
  try {
    console.log('🔍 Verificando configuración de permisos y privilegios...\n');

    // 1. Verificar permisos creados
    console.log('📋 PERMISOS CREADOS:');
    const permisos = await Permission.findAll({
      order: [['id_permiso', 'ASC']]
    });
    
    permisos.forEach(permiso => {
      console.log(`  ✅ ID: ${permiso.id_permiso} | Nombre: ${permiso.nombre}`);
    });

    // 2. Verificar privilegios creados
    console.log('\n🔧 PRIVILEGIOS CREADOS:');
    const privilegios = await Privilege.findAll({
      order: [['id_privilegio', 'ASC']]
    });
    
    privilegios.forEach(privilegio => {
      console.log(`  ✅ ID: ${privilegio.id_privilegio} | Nombre: ${privilegio.nombre}`);
    });

    // 3. Verificar roles creados
    console.log('\n👥 ROLES CREADOS:');
    const roles = await Role.findAll({
      order: [['id_rol', 'ASC']]
    });
    
    roles.forEach(rol => {
      console.log(`  ✅ ID: ${rol.id_rol} | Nombre: ${rol.nombre} | Estado: ${rol.estado_rol ? 'Activo' : 'Inactivo'}`);
    });

    // 4. Verificar combinaciones de permisos y privilegios
    console.log('\n🔗 COMBINACIONES DE PERMISOS Y PRIVILEGIOS:');
    
    for (const rol of roles) {
      console.log(`\n🎯 ROL: ${rol.nombre} (ID: ${rol.id_rol}) - Estado: ${rol.estado_rol ? 'Activo' : 'Inactivo'}`);
      
      const combinaciones = await RolePermissionPrivilege.findAll({
        where: { id_rol: rol.id_rol },
        include: [
          {
            model: Permission,
            as: 'permiso',
            attributes: ['nombre']
          },
          {
            model: Privilege,
            as: 'privilegio',
            attributes: ['nombre']
          }
        ]
      });

      if (combinaciones.length === 0) {
        console.log('  ❌ No tiene combinaciones asignadas');
      } else {
        console.log(`  📊 Total combinaciones: ${combinaciones.length}`);
        
        // Agrupar por permiso para mejor visualización
        const agrupado = {};
        combinaciones.forEach(combo => {
          const permiso = combo.permiso.nombre;
          const privilegio = combo.privilegio.nombre;
          
          if (!agrupado[permiso]) {
            agrupado[permiso] = [];
          }
          agrupado[permiso].push(privilegio);
        });

        Object.entries(agrupado).forEach(([permiso, privilegios]) => {
          console.log(`    📋 ${permiso}: ${privilegios.join(', ')}`);
        });
      }
    }

    // 5. Resumen estadístico
    console.log('\n📊 RESUMEN ESTADÍSTICO:');
    const totalPermisos = permisos.length;
const totalPrivilegios = privilegios.length;
    const totalRoles = roles.length;
    const totalCombinaciones = await RolePermissionPrivilege.count();
    const rolesActivos = roles.filter(r => r.estado_rol).length;
    const rolesInactivos = roles.filter(r => !r.estado_rol).length;

    console.log(`  📋 Total Permisos: ${totalPermisos}`);
    console.log(`  🔧 Total Privilegios: ${totalPrivilegios}`);
    console.log(`  👥 Total Roles: ${totalRoles} (${rolesActivos} activos, ${rolesInactivos} inactivos)`);
    console.log(`  🔗 Total Combinaciones: ${totalCombinaciones}`);
    console.log(`  📈 Combinaciones posibles: ${totalPermisos * totalPrivilegios * totalRoles}`);
    console.log('\n🔍 VERIFICACIÓN DE INTEGRIDAD:');
    
    // Verificar que cada rol tenga al menos una combinación
    for (const rol of roles) {
      const count = await RolePermissionPrivilege.count({
        where: { id_rol: rol.id_rol }
     });
      
      if (count === 0) {
        console.log(`  ⚠️  ADVERTENCIA: El rol "${rol.nombre}" no tiene combinaciones asignadas`);
      } else {
        console.log(`  ✅ El rol "${rol.nombre}" tiene ${count} combinaciones`);
      }
    }
    // Verificar que no haya combinaciones huérfanas
    const combinacionesHuerfanas = await RolePermissionPrivilege.findAll({
      include: [
        {
          model: Role,
          as: 'rol',
          required: false,
          where: { id_rol: null }
        }
      ]
    });

    if (combinacionesHuerfanas.length > 0) {
      console.log(`  ⚠️  ADVERTENCIA: Hay ${combinacionesHuerfanas.length} combinaciones huérfanas`);
    } else {
      console.log('  ✅ No hay combinaciones huérfanas');
    }

    console.log('\n🎉 Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await sequelize.close();
  }
};

// Ejecutar la verificación
verificarPermisos();
