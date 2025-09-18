const { Usuario } = require('../src/models/User');
const { sequelize } = require('../src/config/database');

async function verificarUsuarios() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar usuario con ID 1
    console.log('\n🔍 Verificando usuario con ID 1:');
    const usuario1 = await Usuario.findByPk(1);
    if (usuario1) {
      console.log(`   - Nombre: ${usuario1.nombre}`);
      console.log(`   - Estado: ${usuario1.estado}`);
      console.log(`   - Rol ID: ${usuario1.roleId}`);
      console.log(`   - Correo: ${usuario1.correo}`);
    } else {
      console.log('   ❌ Usuario con ID 1 no existe');
    }

    // Verificar empleado con ID 2
    console.log('\n🔍 Verificando empleado con ID 2:');
    const empleado2 = await Usuario.findByPk(2);
    if (empleado2) {
      console.log(`   - Nombre: ${empleado2.nombre}`);
      console.log(`   - Estado: ${empleado2.estado}`);
      console.log(`   - Rol ID: ${empleado2.roleId}`);
      console.log(`   - Correo: ${empleado2.correo}`);
    } else {
      console.log('   ❌ Empleado con ID 2 no existe');
    }

    // Mostrar todos los usuarios activos
    console.log('\n👥 Usuarios activos en el sistema:');
    const usuariosActivos = await Usuario.findAll({
      where: { estado: 'Activo' },
      attributes: ['id_usuario', 'nombre', 'estado', 'roleId', 'correo']
    });
    
    usuariosActivos.forEach(user => {
      console.log(`   - ID: ${user.id_usuario}, Nombre: ${user.nombre}, Rol: ${user.roleId}`);
    });

    // Mostrar usuarios con rol de empleado (roleId = 2)
    console.log('\n👷 Usuarios con rol de empleado:');
    const empleados = await Usuario.findAll({
      where: { roleId: 2 },
      attributes: ['id_usuario', 'nombre', 'estado', 'roleId', 'correo']
    });
    
    empleados.forEach(emp => {
      console.log(`   - ID: ${emp.id_usuario}, Nombre: ${emp.nombre}, Estado: ${emp.estado}`);
    });

    // Mostrar usuarios con rol de cliente (roleId = 3)
    console.log('\n👤 Usuarios con rol de cliente:');
    const clientes = await Usuario.findAll({
      where: { roleId: 3 },
      attributes: ['id_usuario', 'nombre', 'estado', 'roleId', 'correo']
    });
    
    clientes.forEach(cli => {
      console.log(`   - ID: ${cli.id_usuario}, Nombre: ${cli.nombre}, Estado: ${cli.estado}`);
    });

    // Verificar fecha actual
    const hoy = new Date();
    console.log(`\n📅 Fecha actual: ${hoy.toISOString().split('T')[0]}`);
    console.log(`   Para crear una cita válida, usa una fecha posterior a hoy`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

verificarUsuarios();
