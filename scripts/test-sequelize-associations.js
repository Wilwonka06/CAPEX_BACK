require('dotenv').config();
const { sequelize } = require('../src/config/database');

// Importar modelos individualmente
const { Usuario } = require('../src/models/User');
const { Role } = require('../src/models/roles');
const UserRole = require('../src/models/UserRole');

async function testSequelizeAssociations() {
  try {
    console.log('🔗 Probando asociaciones de Sequelize...\n');

    // 1. Configurar asociaciones manualmente
    console.log('1. Configurando asociaciones...');
    
    // Relación muchos a muchos entre Usuario y Role a través de UserRole
    Usuario.belongsToMany(Role, {
      through: UserRole,
      foreignKey: 'id_usuario',
      otherKey: 'id_rol',
      as: 'roles'
    });

    Role.belongsToMany(Usuario, {
      through: UserRole,
      foreignKey: 'id_rol',
      otherKey: 'id_usuario',
      as: 'usuarios'
    });

    // Relaciones directas con UserRole
    UserRole.belongsTo(Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    UserRole.belongsTo(Role, {
      foreignKey: 'id_rol',
      as: 'rol'
    });

    Usuario.hasMany(UserRole, {
      foreignKey: 'id_usuario',
      as: 'userRoles'
    });

    Role.hasMany(UserRole, {
      foreignKey: 'id_rol',
      as: 'userRoles'
    });

    console.log('✅ Asociaciones configuradas\n');

    // 2. Crear un usuario de prueba
    console.log('2. Creando usuario de prueba...');
    
    // Verificar si ya existe un usuario de prueba
    const usuarioExistente = await Usuario.findOne({
      where: { correo: 'test@example.com' }
    });
    
    if (usuarioExistente) {
      console.log('  Usuario de prueba ya existe, eliminando...');
      await usuarioExistente.destroy();
    }
    
    // Crear usuario de prueba
    const nuevoUsuario = await Usuario.create({
      nombre: 'Usuario Prueba',
      tipo_documento: 'Cedula de ciudadania',
      documento: '123456789',
      telefono: '+573001234567',
      correo: 'test@example.com',
      contrasena: 'Test123!',
      roleId: 1 // Asignar rol por defecto
    });
    
    console.log(`  ✅ Usuario creado: ${nuevoUsuario.nombre} (ID: ${nuevoUsuario.id_usuario})\n`);

    // 3. Asignar rol a través de la tabla intermedia
    console.log('3. Asignando rol al usuario...');
    
    const adminRole = await Role.findOne({ where: { nombre: 'Administrador' } });
    if (adminRole) {
      await UserRole.create({
        id_usuario: nuevoUsuario.id_usuario,
        id_rol: adminRole.id_rol,
        fecha_asignacion: new Date(),
        estado: 'Activo'
      });
      console.log(`  ✅ Rol 'Administrador' asignado al usuario\n`);
    }

    // 4. Probar consulta con include
    console.log('4. Probando consulta con include...');
    
    const usuarioConRoles = await Usuario.findByPk(nuevoUsuario.id_usuario, {
      include: [{
        model: Role,
        through: UserRole,
        as: 'roles'
      }]
    });
    
    if (usuarioConRoles && usuarioConRoles.roles) {
      console.log(`  Usuario: ${usuarioConRoles.nombre}`);
      console.log(`  Roles: ${usuarioConRoles.roles.map(r => r.nombre).join(', ')}\n`);
    } else {
      console.log('  ❌ No se pudieron obtener los roles del usuario\n');
    }

    // 5. Probar consulta inversa
    console.log('5. Probando consulta inversa...');
    
    const rolConUsuarios = await Role.findOne({
      where: { nombre: 'Administrador' },
      include: [{
        model: Usuario,
        through: UserRole,
        as: 'usuarios'
      }]
    });
    
    if (rolConUsuarios && rolConUsuarios.usuarios) {
      console.log(`  Rol: ${rolConUsuarios.nombre}`);
      console.log(`  Usuarios: ${rolConUsuarios.usuarios.map(u => u.nombre).join(', ')}\n`);
    } else {
      console.log('  ❌ No se pudieron obtener los usuarios del rol\n');
    }

    // 6. Probar consulta de UserRole con includes
    console.log('6. Probando consulta de UserRole con includes...');
    
    const userRolesConDetalles = await UserRole.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['nombre', 'correo']
        },
        {
          model: Role,
          as: 'rol',
          attributes: ['nombre']
        }
      ]
    });
    
    console.log(`  Encontradas ${userRolesConDetalles.length} asignaciones:`);
    userRolesConDetalles.forEach(ur => {
      console.log(`    - ${ur.usuario?.nombre} -> ${ur.rol?.nombre} (${ur.estado})`);
    });
    console.log('');

    // 7. Limpiar datos de prueba
    console.log('7. Limpiando datos de prueba...');
    await nuevoUsuario.destroy();
    console.log('  ✅ Usuario de prueba eliminado\n');

    console.log('🎉 Pruebas de asociaciones completadas exitosamente');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar las pruebas
testSequelizeAssociations();
