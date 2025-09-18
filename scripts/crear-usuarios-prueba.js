const { Usuario } = require('../src/models/User');
const { sequelize } = require('../src/config/database');

async function crearUsuariosPrueba() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Crear cliente de prueba
    console.log('\n👤 Creando cliente de prueba...');
    const cliente = await Usuario.create({
      nombre: 'Cliente Prueba',
      tipo_documento: 'Cedula de ciudadania',
      documento: '1234567890',
      telefono: '+573001234567',
      correo: 'cliente.prueba@test.com',
      contrasena: 'Test123!@#',
      roleId: 3, // Rol de cliente
      estado: 'Activo'
    });
    console.log(`   ✅ Cliente creado con ID: ${cliente.id_usuario}`);

    // Crear empleado de prueba
    console.log('\n👷 Creando empleado de prueba...');
    const empleado = await Usuario.create({
      nombre: 'Empleado Prueba',
      tipo_documento: 'Cedula de ciudadania',
      documento: '0987654321',
      telefono: '+573009876543',
      correo: 'empleado.prueba@test.com',
      contrasena: 'Test123!@#',
      roleId: 2, // Rol de empleado
      estado: 'Activo'
    });
    console.log(`   ✅ Empleado creado con ID: ${empleado.id_usuario}`);

    console.log('\n📋 Resumen de usuarios creados:');
    console.log(`   - Cliente ID: ${cliente.id_usuario} (${cliente.nombre})`);
    console.log(`   - Empleado ID: ${empleado.id_usuario} (${empleado.nombre})`);
    
    console.log('\n💡 Ahora puedes usar estos IDs para crear citas:');
    console.log(`   - id_usuario: ${cliente.id_usuario}`);
    console.log(`   - id_empleado: ${empleado.id_usuario}`);
    console.log(`   - fecha_servicio: "2025-09-15" (o cualquier fecha futura)`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('\n💡 Algunos usuarios ya existen. Verificando usuarios disponibles...');
      
      const usuariosDisponibles = await Usuario.findAll({
        where: { estado: 'Activo' },
        attributes: ['id_usuario', 'nombre', 'estado', 'roleId', 'correo']
      });
      
      console.log('\n👥 Usuarios activos disponibles:');
      usuariosDisponibles.forEach(user => {
        const tipo = user.roleId === 2 ? '👷 Empleado' : user.roleId === 3 ? '👤 Cliente' : '👤 Usuario';
        console.log(`   ${tipo} - ID: ${user.id_usuario}, Nombre: ${user.nombre}, Rol: ${user.roleId}`);
      });
    }
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

crearUsuariosPrueba();
