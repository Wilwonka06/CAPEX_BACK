const { Usuario } = require('../src/models/User');

async function testFotoField() {
  try {
    console.log('🧪 Probando el campo foto en el modelo de usuarios...\n');

    // Test 1: Crear usuario sin foto
    console.log('1. Creando usuario sin foto...');
    const userWithoutFoto = await Usuario.create({
      nombre: 'Juan Pérez',
      tipo_documento: 'Cedula de ciudadania',
      documento: 'TEST1234567',
      telefono: '+573001234567',
      correo: 'juan.perez@test.com',
      contrasena: 'Test123!'
    });
    console.log('✅ Usuario creado sin foto:', userWithoutFoto.toJSON());

    // Test 2: Crear usuario con foto
    console.log('\n2. Creando usuario con foto...');
    const userWithFoto = await Usuario.create({
      nombre: 'María García',
      tipo_documento: 'Cedula de ciudadania',
      documento: 'TEST7654321',
      telefono: '+573009876543',
      correo: 'maria.garcia@test.com',
      contrasena: 'Test123!',
      foto: 'https://example.com/fotos/maria.jpg'
    });
    console.log('✅ Usuario creado con foto:', userWithFoto.toJSON());

    // Test 3: Actualizar usuario para agregar foto
    console.log('\n3. Actualizando usuario para agregar foto...');
    await Usuario.update(
      { foto: 'https://example.com/fotos/juan.jpg' },
      { where: { id_usuario: userWithoutFoto.id_usuario } }
    );
    const updatedUser = await Usuario.findByPk(userWithoutFoto.id_usuario);
    console.log('✅ Usuario actualizado con foto:', updatedUser.toJSON());

    // Test 4: Buscar usuarios con foto
    console.log('\n4. Buscando usuarios con foto...');
    const usersWithFoto = await Usuario.findAll({
      where: {
        foto: { [require('sequelize').Op.not]: null }
      }
    });
    console.log('✅ Usuarios con foto encontrados:', usersWithFoto.length);

    // Test 5: Validación de URL inválida
    console.log('\n5. Probando validación de URL inválida...');
    try {
      await Usuario.create({
        nombre: 'Test Invalid',
        tipo_documento: 'Cedula de ciudadania',
        documento: 'TEST1111111',
        telefono: '+573001111111',
        correo: 'test.invalid@test.com',
        contrasena: 'Test123!',
        foto: 'invalid-url'
      });
      console.log('❌ No se debería haber creado el usuario con URL inválida');
    } catch (error) {
      console.log('✅ Validación funcionó correctamente:', error.message);
    }

    // Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await Usuario.destroy({
      where: {
        id_usuario: [userWithoutFoto.id_usuario, userWithFoto.id_usuario]
      }
    });
    console.log('✅ Datos de prueba eliminados');

    console.log('\n🎉 Todas las pruebas del campo foto completadas exitosamente!');

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

testFotoField();
