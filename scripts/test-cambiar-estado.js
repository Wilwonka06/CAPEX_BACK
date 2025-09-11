const { Usuario } = require('../src/models/User');

async function testCambiarEstado() {
  try {
    console.log('🧪 Probando la funcionalidad de cambiar estado de usuarios...\n');

    // Test 1: Crear usuario de prueba
    console.log('1. Creando usuario de prueba...');
    const testUser = await Usuario.create({
      nombre: 'Usuario Test Estado',
      tipo_documento: 'Cedula de ciudadania',
      documento: 'TESTESTADO123',
      telefono: '+573001234567',
      correo: 'test.estado@test.com',
      contrasena: 'Test123!',
      estado: 'Activo'
    });
    console.log('✅ Usuario creado con estado inicial:', testUser.estado);

    // Test 2: Cambiar estado a Inactivo
    console.log('\n2. Cambiando estado a Inactivo...');
    await Usuario.update(
      { estado: 'Inactivo' },
      { where: { id_usuario: testUser.id_usuario } }
    );
    const userInactivo = await Usuario.findByPk(testUser.id_usuario);
    console.log('✅ Estado cambiado a:', userInactivo.estado);

    // Test 3: Cambiar estado a Suspendido
    console.log('\n3. Cambiando estado a Suspendido...');
    await Usuario.update(
      { estado: 'Suspendido' },
      { where: { id_usuario: testUser.id_usuario } }
    );
    const userSuspendido = await Usuario.findByPk(testUser.id_usuario);
    console.log('✅ Estado cambiado a:', userSuspendido.estado);

    // Test 4: Cambiar estado de vuelta a Activo
    console.log('\n4. Cambiando estado de vuelta a Activo...');
    await Usuario.update(
      { estado: 'Activo' },
      { where: { id_usuario: testUser.id_usuario } }
    );
    const userActivo = await Usuario.findByPk(testUser.id_usuario);
    console.log('✅ Estado cambiado a:', userActivo.estado);

    // Test 5: Buscar usuarios por estado
    console.log('\n5. Buscando usuarios por estado...');
    const usuariosActivos = await Usuario.findAll({
      where: { estado: 'Activo' }
    });
    console.log('✅ Usuarios activos encontrados:', usuariosActivos.length);

    const usuariosInactivos = await Usuario.findAll({
      where: { estado: 'Inactivo' }
    });
    console.log('✅ Usuarios inactivos encontrados:', usuariosInactivos.length);

    const usuariosSuspendidos = await Usuario.findAll({
      where: { estado: 'Suspendido' }
    });
    console.log('✅ Usuarios suspendidos encontrados:', usuariosSuspendidos.length);

    // Test 6: Validación de estado inválido
    console.log('\n6. Probando validación de estado inválido...');
    try {
      await Usuario.update(
        { estado: 'EstadoInvalido' },
        { where: { id_usuario: testUser.id_usuario } }
      );
      console.log('❌ No se debería haber actualizado con estado inválido');
    } catch (error) {
      console.log('✅ Validación funcionó correctamente:', error.message);
    }

    // Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await Usuario.destroy({
      where: { id_usuario: testUser.id_usuario }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 Todas las pruebas de cambiar estado completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path}: ${err.message}`);
      });
    }
  } finally {
    process.exit(0);
  }
}

testCambiarEstado();
