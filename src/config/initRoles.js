const { Role, Permission, Privilege } = require('../models/roles/Associations');

const initializeRoles = async () => {
  try {
    // Check if data already exists
    const existingRoles = await Role.count();
    const existingPermissions = await Permission.count();
    const existingPrivileges = await Privilege.count();
    
    if (existingPermissions === 0) {
      // Create default permissions
      const defaultPermissions = [
        { nombre: 'read' },
        { nombre: 'write' },
        { nombre: 'delete' },
        { nombre: 'create' },
        { nombre: 'update' },
        { nombre: 'admin' }
      ];

      await Permission.bulkCreate(defaultPermissions);
      console.log('Permisos por defecto creados exitosamente');
    }

    if (existingPrivileges === 0) {
      // Create default privileges
      const defaultPrivileges = [
        { nombre: 'users' },
        { nombre: 'roles' },
        { nombre: 'permissions' },
        { nombre: 'privileges' },
        { nombre: 'reports' },
        { nombre: 'settings' }
      ];

      await Privilege.bulkCreate(defaultPrivileges);
      console.log('Privilegios por defecto creados exitosamente');
    }

    if (existingRoles === 0) {
      // Create default roles
      const defaultRoles = [
        { nombre: 'admin' },
        { nombre: 'user' },
        { nombre: 'viewer' }
      ];

      await Role.bulkCreate(defaultRoles);
      console.log('Roles por defecto creados exitosamente');

      // Assign permissions and privileges to roles
      const adminRole = await Role.findOne({ where: { nombre: 'admin' } });
      const userRole = await Role.findOne({ where: { nombre: 'user' } });
      const viewerRole = await Role.findOne({ where: { nombre: 'viewer' } });

      // Get all permissions and privileges
      const allPermissions = await Permission.findAll();
      const allPrivileges = await Privilege.findAll();

      // Admin gets everything
      await adminRole.addPermissions(allPermissions);
      await adminRole.addPrivileges(allPrivileges);

      // User gets basic permissions
      const userPermissions = await Permission.findAll({
        where: { nombre: ['read', 'write', 'create', 'update'] }
      });
      const userPrivileges = await Privilege.findAll({
        where: { nombre: ['users', 'reports'] }
      });
      await userRole.addPermissions(userPermissions);
      await userRole.addPrivileges(userPrivileges);

      // Viewer gets only read permission
      const viewerPermissions = await Permission.findAll({
        where: { nombre: ['read'] }
      });
      const viewerPrivileges = await Privilege.findAll({
        where: { nombre: ['reports'] }
      });
      await viewerRole.addPermissions(viewerPermissions);
      await viewerRole.addPrivileges(viewerPrivileges);

      console.log('Permisos y privilegios asignados a roles por defecto');
    } else {
      console.log('Los datos ya existen en la base de datos');
    }
  } catch (error) {
    console.error('Error inicializando datos:', error);
  }
};

module.exports = initializeRoles;
