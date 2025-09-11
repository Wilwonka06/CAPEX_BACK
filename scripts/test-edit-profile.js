const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

/**
 * Script de prueba para la funcionalidad de editar perfil
 */
async function testEditProfile() {
  console.log('🧪 Iniciando pruebas de editar perfil...\n');

  try {
    // Test 1: Actualizar solo el nombre
    console.log('📝 Test 1: Actualizar solo el nombre');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        nombre: 'María González'
      });
      console.log('✅ Éxito:', response.data.message);
      console.log('📊 Datos actualizados:', response.data.data.nombre);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 2: Actualizar múltiples campos
    console.log('📝 Test 2: Actualizar múltiples campos');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        nombre: 'Carlos Rodríguez',
        telefono: '+573001234568',
        correo: 'carlos.rodriguez@ejemplo.com'
      });
      console.log('✅ Éxito:', response.data.message);
      console.log('📊 Datos actualizados:', {
        nombre: response.data.data.nombre,
        telefono: response.data.data.telefono,
        correo: response.data.data.correo
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 3: Actualizar contraseña
    console.log('📝 Test 3: Actualizar contraseña');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        contrasena: 'NuevaContraseña123!'
      });
      console.log('✅ Éxito:', response.data.message);
      console.log('🔒 Contraseña actualizada correctamente');
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 4: Actualizar foto y dirección
    console.log('📝 Test 4: Actualizar foto y dirección');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        foto: 'https://ejemplo.com/nueva-foto.jpg',
        direccion: 'Calle 456 #78-90, Medellín, Colombia'
      });
      console.log('✅ Éxito:', response.data.message);
      console.log('📊 Datos actualizados:', {
        foto: response.data.data.foto,
        direccion: response.data.data.direccion
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 5: Actualizar todo el perfil
    console.log('📝 Test 5: Actualizar todo el perfil');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        nombre: 'Ana Martínez',
        tipo_documento: 'Cedula de ciudadania',
        documento: '87654321',
        telefono: '+573001234569',
        correo: 'ana.martinez@ejemplo.com',
        foto: 'https://ejemplo.com/foto-perfil.jpg',
        direccion: 'Carrera 789 #12-34, Cali, Valle del Cauca',
        contrasena: 'NuevaContraseña456!'
      });
      console.log('✅ Éxito:', response.data.message);
      console.log('📊 Datos actualizados:', {
        nombre: response.data.data.nombre,
        tipo_documento: response.data.data.tipo_documento,
        documento: response.data.data.documento,
        telefono: response.data.data.telefono,
        correo: response.data.data.correo,
        foto: response.data.data.foto,
        direccion: response.data.data.direccion
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 6: Validación - Sin campos
    console.log('📝 Test 6: Validación - Sin campos proporcionados');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {});
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 7: Validación - Nombre inválido
    console.log('📝 Test 7: Validación - Nombre con números');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        nombre: 'Juan123'
      });
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 8: Validación - Teléfono inválido
    console.log('📝 Test 8: Validación - Teléfono sin formato internacional');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        telefono: '3001234567'
      });
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 9: Validación - Contraseña débil
    console.log('📝 Test 9: Validación - Contraseña sin complejidad requerida');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        contrasena: '123456'
      });
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 10: Validación - Foto inválida
    console.log('📝 Test 10: Validación - Foto con URL inválida');
    try {
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        foto: 'foto-invalida.jpg'
      });
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 11: Validación - Dirección muy larga
    console.log('📝 Test 11: Validación - Dirección muy larga');
    try {
      const direccionLarga = 'A'.repeat(1001); // Más de 1000 caracteres
      const response = await axios.put(`${BASE_URL}/users/1/profile`, {
        direccion: direccionLarga
      });
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 12: Usuario inexistente
    console.log('📝 Test 12: Usuario inexistente');
    try {
      const response = await axios.put(`${BASE_URL}/users/99999/profile`, {
        nombre: 'Usuario Inexistente'
      });
      console.log('✅ Éxito:', response.data.message);
    } catch (error) {
      console.log('❌ Error esperado:', error.response?.data?.message || error.message);
    }
    console.log('');

    console.log('🎉 Pruebas completadas!');

  } catch (error) {
    console.error('💥 Error general en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testEditProfile();
