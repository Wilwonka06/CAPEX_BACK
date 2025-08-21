const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../models/roles');

const initializeRoles = async () => {
  try {
    // Check if data already exists
    const existingRoles = await Role.count();
    const existingPermissions = await Permission.count();
    const existingPrivileges = await Privilege.count();
    
    if (existingPermissions === 0) {
      // Create default permissions (MÓDULOS DEL SISTEMA)
      const defaultPermissions = [
        { nombre: 'Compras' },
        { nombre: 'Servicios' },
        { nombre: 'Venta' },
        { nombre: 'Configuración' },
        { nombre: 'Usuarios' }
      ];

      await Permission.bulkCreate(defaultPermissions);
      console.log('✅ Permisos por defecto creados exitosamente: Compras, Servicios, Venta, Configuración, Usuarios');
    }

    if (existingPrivileges === 0) {
      // Create default privileges (ACCIONES)
      const defaultPrivileges = [
        { nombre: 'Create' },
        { nombre: 'Read' },
        { nombre: 'Edit' },
        { nombre: 'Delete' }
      ];

      await Privilege.bulkCreate(defaultPrivileges);
      console.log('✅ Privilegios por defecto creados exitosamente: Create, Read, Edit, Delete');
    }

    if (existingRoles === 0) {
      // Create default roles
      const defaultRoles = [
        { 
          nombre_rol: 'Administrador',
          descripcion: 'Rol con acceso completo al sistema',
          estado_rol: true
        },
        { 
          nombre_rol: 'Empleado',
          descripcion: 'Rol con acceso limitado para operaciones diarias',
          estado_rol: true
        },
        { 
          nombre_rol: 'Cliente',
          descripcion: 'Rol para clientes del sistema',
          estado_rol: true
        }
      ];

      await Role.bulkCreate(defaultRoles);
      console.log('✅ Roles por defecto creados exitosamente: Administrador, Empleado, Cliente');

      // Get created roles
      const adminRole = await Role.findOne({ where: { nombre_rol: 'Administrador' } });
      const employeeRole = await Role.findOne({ where: { nombre_rol: 'Empleado' } });
      const clientRole = await Role.findOne({ where: { nombre_rol: 'Cliente' } });

      // Get all permissions and privileges
      const allPermissions = await Permission.findAll();
      const allPrivileges = await Privilege.findAll();

      // ADMINISTRADOR: Acceso completo
      // Asignar todos los permisos y privilegios al administrador
      for (const permission of allPermissions) {
        for (const privilege of allPrivileges) {
          await RolePermissionPrivilege.create({
            id_rol: adminRole.id_rol,
            id_permiso: permission.id_permiso,
            id_privilegio: privilege.id_privilegio
          });
        }
      }
      console.log('✅ Permisos y privilegios asignados al Administrador');

      // EMPLEADO: Acceso limitado
      // Empleado puede: Read, Create, Edit en Compras, Servicios, Venta
      const employeePermissions = await Permission.findAll({
        where: { nombre: ['Compras', 'Servicios', 'Venta'] }
      });
      const employeePrivileges = await Privilege.findAll({
        where: { nombre: ['Read', 'Create', 'Edit'] }
      });

      for (const permission of employeePermissions) {
        for (const privilege of employeePrivileges) {
          await RolePermissionPrivilege.create({
            id_rol: employeeRole.id_rol,
            id_permiso: permission.id_permiso,
            id_privilegio: privilege.id_privilegio
          });
        }
      }
      console.log('✅ Permisos y privilegios asignados al Empleado');

      // CLIENTE: Acceso muy limitado
      // Cliente puede: Read en Servicios y Venta
      const clientPermissions = await Permission.findAll({
        where: { nombre: ['Servicios', 'Venta'] }
      });
      const clientPrivileges = await Privilege.findAll({
        where: { nombre: ['Read'] }
      });

      for (const permission of clientPermissions) {
        for (const privilege of clientPrivileges) {
          await RolePermissionPrivilege.create({
            id_rol: clientRole.id_rol,
            id_permiso: permission.id_permiso,
            id_privilegio: privilege.id_privilegio
          });
        }
      }
      console.log('✅ Permisos y privilegios asignados al Cliente');

      console.log('🎉 Inicialización de roles, permisos y privilegios completada exitosamente');
    } else {
      console.log('ℹ️ Los datos ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
  }
};

module.exports = { initializeRoles };
