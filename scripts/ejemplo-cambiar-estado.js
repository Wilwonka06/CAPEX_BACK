const axios = require('axios');

// Configuración base
const BASE_URL = 'http://localhost:3000/api/users';

// Ejemplo de uso del endpoint de cambiar estado
async function ejemploCambiarEstado() {
  try {
    console.log('📝 Ejemplo de uso del endpoint cambiar estado\n');

    // Ejemplo 1: Cambiar estado a Inactivo
    console.log('1. Cambiando estado de usuario a Inactivo...');
    const response1 = await axios.patch(`${BASE_URL}/1/cambiar-estado`, {
      nuevoEstado: 'Inactivo'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta:', response1.data);

    // Ejemplo 2: Cambiar estado a Suspendido
    console.log('\n2. Cambiando estado de usuario a Suspendido...');
    const response2 = await axios.patch(`${BASE_URL}/1/cambiar-estado`, {
      nuevoEstado: 'Suspendido'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta:', response2.data);

    // Ejemplo 3: Cambiar estado de vuelta a Activo
    console.log('\n3. Cambiando estado de usuario de vuelta a Activo...');
    const response3 = await axios.patch(`${BASE_URL}/1/cambiar-estado`, {
      nuevoEstado: 'Activo'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta:', response3.data);

    // Ejemplo 4: Error - Estado inválido
    console.log('\n4. Probando con estado inválido...');
    try {
      await axios.patch(`${BASE_URL}/1/cambiar-estado`, {
        nuevoEstado: 'EstadoInvalido'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('✅ Error capturado correctamente:', error.response.data);
    }

    // Ejemplo 5: Error - Usuario no encontrado
    console.log('\n5. Probando con usuario inexistente...');
    try {
      await axios.patch(`${BASE_URL}/99999/cambiar-estado`, {
        nuevoEstado: 'Activo'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('✅ Error capturado correctamente:', error.response.data);
    }

    console.log('\n🎉 Ejemplos completados exitosamente!');

  } catch (error) {
    console.error('❌ Error en los ejemplos:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
  }
}

// Ejecutar ejemplos
ejemploCambiarEstado();
