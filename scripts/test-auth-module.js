require('dotenv').config();
const axios = require('axios');

// Configuración
const BASE_URL = process.env.API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/auth`;

// Colores para console.log
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAuthModule() {
  log('🧪 Iniciando pruebas del módulo de autenticación...', 'blue');
  log('================================================', 'blue');

  let authToken = null;
  let testUserId = null;

  try {
    // 1. Probar registro de usuario
    log('\n1. Probando registro de usuario...', 'yellow');
    
    const registerData = {
      nombre: 'Usuario Prueba',
      tipo_documento: 'Cedula de ciudadania',
      documento: `TEST${Date.now()}`, // Documento único
      telefono: '+573001234567',
      correo: `test${Date.now()}@example.com`, // Email único
      contrasena: 'Test123!'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/register`, registerData);
      
      if (registerResponse.status === 201) {
        log('✅ Registro exitoso', 'green');
        log(`   Usuario ID: ${registerResponse.data.data.id_usuario}`, 'green');
        log(`   Cliente ID: ${registerResponse.data.data.cliente.id_cliente}`, 'green');
        testUserId = registerResponse.data.data.id_usuario;
      } else {
        log('❌ Error en registro', 'red');
        log(`   Status: ${registerResponse.status}`, 'red');
        log(`   Response: ${JSON.stringify(registerResponse.data)}`, 'red');
      }
    } catch (error) {
      if (error.response) {
        log('❌ Error en registro', 'red');
        log(`   Status: ${error.response.status}`, 'red');
        log(`   Message: ${error.response.data.message}`, 'red');
      } else {
        log('❌ Error de conexión', 'red');
        log(`   Error: ${error.message}`, 'red');
      }
    }

    // 2. Probar registro duplicado (debe fallar)
    log('\n2. Probando registro duplicado...', 'yellow');
    
    try {
      const duplicateResponse = await axios.post(`${API_URL}/register`, registerData);
      log('❌ Error: Se permitió registro duplicado', 'red');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        log('✅ Correctamente rechazó registro duplicado', 'green');
        log(`   Message: ${error.response.data.message}`, 'green');
      } else {
        log('❌ Error inesperado en prueba de duplicado', 'red');
        log(`   Status: ${error.response?.status}`, 'red');
        log(`   Message: ${error.response?.data?.message}`, 'red');
      }
    }

    // 3. Probar login exitoso
    log('\n3. Probando login exitoso...', 'yellow');
    
    const loginData = {
      correo: registerData.correo,
      contrasena: registerData.contrasena
    };

    try {
      const loginResponse = await axios.post(`${API_URL}/login`, loginData);
      
      if (loginResponse.status === 200) {
        log('✅ Login exitoso', 'green');
        log(`   Token recibido: ${loginResponse.data.data.token.substring(0, 20)}...`, 'green');
        authToken = loginResponse.data.data.token;
      } else {
        log('❌ Error en login', 'red');
        log(`   Status: ${loginResponse.status}`, 'red');
      }
    } catch (error) {
      if (error.response) {
        log('❌ Error en login', 'red');
        log(`   Status: ${error.response.status}`, 'red');
        log(`   Message: ${error.response.data.message}`, 'red');
      } else {
        log('❌ Error de conexión en login', 'red');
        log(`   Error: ${error.message}`, 'red');
      }
    }

    // 4. Probar login con credenciales incorrectas
    log('\n4. Probando login con credenciales incorrectas...', 'yellow');
    
    const wrongLoginData = {
      correo: registerData.correo,
      contrasena: 'WrongPassword123!'
    };

    try {
      const wrongLoginResponse = await axios.post(`${API_URL}/login`, wrongLoginData);
      log('❌ Error: Se permitió login con credenciales incorrectas', 'red');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log('✅ Correctamente rechazó credenciales incorrectas', 'green');
        log(`   Message: ${error.response.data.message}`, 'green');
      } else {
        log('❌ Error inesperado en prueba de credenciales incorrectas', 'red');
        log(`   Status: ${error.response?.status}`, 'red');
        log(`   Message: ${error.response?.data?.message}`, 'red');
      }
    }

    // 5. Probar verificación de token
    if (authToken) {
      log('\n5. Probando verificación de token...', 'yellow');
      
      try {
        const verifyResponse = await axios.post(`${API_URL}/verify`, { token: authToken });
        
        if (verifyResponse.status === 200) {
          log('✅ Verificación de token exitosa', 'green');
          log(`   Usuario ID: ${verifyResponse.data.data.id_usuario}`, 'green');
          log(`   Role: ${verifyResponse.data.data.roleName}`, 'green');
        } else {
          log('❌ Error en verificación de token', 'red');
          log(`   Status: ${verifyResponse.status}`, 'red');
        }
      } catch (error) {
        if (error.response) {
          log('❌ Error en verificación de token', 'red');
          log(`   Status: ${error.response.status}`, 'red');
          log(`   Message: ${error.response.data.message}`, 'red');
        } else {
          log('❌ Error de conexión en verificación', 'red');
          log(`   Error: ${error.message}`, 'red');
        }
      }
    }

    // 6. Probar obtener usuario actual
    if (authToken) {
      log('\n6. Probando obtener usuario actual...', 'yellow');
      
      try {
        const meResponse = await axios.get(`${API_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (meResponse.status === 200) {
          log('✅ Obtención de usuario actual exitosa', 'green');
          log(`   Usuario: ${meResponse.data.data.nombre}`, 'green');
          log(`   Email: ${meResponse.data.data.correo}`, 'green');
          log(`   Cliente ID: ${meResponse.data.data.cliente?.id_cliente}`, 'green');
        } else {
          log('❌ Error al obtener usuario actual', 'red');
          log(`   Status: ${meResponse.status}`, 'red');
        }
      } catch (error) {
        if (error.response) {
          log('❌ Error al obtener usuario actual', 'red');
          log(`   Status: ${error.response.status}`, 'red');
          log(`   Message: ${error.response.data.message}`, 'red');
        } else {
          log('❌ Error de conexión al obtener usuario', 'red');
          log(`   Error: ${error.message}`, 'red');
        }
      }
    }

    // 7. Probar acceso sin token
    log('\n7. Probando acceso sin token...', 'yellow');
    
    try {
      const noTokenResponse = await axios.get(`${API_URL}/me`);
      log('❌ Error: Se permitió acceso sin token', 'red');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log('✅ Correctamente rechazó acceso sin token', 'green');
        log(`   Message: ${error.response.data.message}`, 'green');
      } else {
        log('❌ Error inesperado en prueba sin token', 'red');
        log(`   Status: ${error.response?.status}`, 'red');
        log(`   Message: ${error.response?.data?.message}`, 'red');
      }
    }

    // 8. Probar logout
    if (authToken) {
      log('\n8. Probando logout...', 'yellow');
      
      try {
        const logoutResponse = await axios.post(`${API_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (logoutResponse.status === 200) {
          log('✅ Logout exitoso', 'green');
        } else {
          log('❌ Error en logout', 'red');
          log(`   Status: ${logoutResponse.status}`, 'red');
        }
      } catch (error) {
        if (error.response) {
          log('❌ Error en logout', 'red');
          log(`   Status: ${error.response.status}`, 'red');
          log(`   Message: ${error.response.data.message}`, 'red');
        } else {
          log('❌ Error de conexión en logout', 'red');
          log(`   Error: ${error.message}`, 'red');
        }
      }
    }

    // 9. Probar validaciones de registro
    log('\n9. Probando validaciones de registro...', 'yellow');
    
    const invalidDataTests = [
      {
        name: 'Nombre vacío',
        data: { ...registerData, nombre: '' },
        expectedError: 'Campos requeridos faltantes'
      },
      {
        name: 'Email inválido',
        data: { ...registerData, correo: 'invalid-email', documento: `TEST${Date.now() + 1}` },
        expectedError: 'Formato de correo electrónico no válido'
      },
      {
        name: 'Contraseña débil',
        data: { ...registerData, contrasena: '123', documento: `TEST${Date.now() + 2}` },
        expectedError: 'La contraseña debe contener al menos una mayúscula'
      },
      {
        name: 'Teléfono inválido',
        data: { ...registerData, telefono: '123456', documento: `TEST${Date.now() + 3}` },
        expectedError: 'Formato de teléfono no válido'
      }
    ];

    for (const test of invalidDataTests) {
      try {
        await axios.post(`${API_URL}/register`, test.data);
        log(`❌ ${test.name}: Se permitió registro inválido`, 'red');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          log(`✅ ${test.name}: Correctamente validado`, 'green');
        } else {
          log(`❌ ${test.name}: Error inesperado`, 'red');
          log(`   Status: ${error.response?.status}`, 'red');
          log(`   Message: ${error.response?.data?.message}`, 'red');
        }
      }
    }

    log('\n================================================', 'blue');
    log('✅ Pruebas del módulo de autenticación completadas', 'green');
    log('================================================', 'blue');

  } catch (error) {
    log('\n❌ Error general en las pruebas', 'red');
    log(`Error: ${error.message}`, 'red');
  }
}

// Ejecutar las pruebas
if (require.main === module) {
  testAuthModule()
    .then(() => {
      log('\n🎉 Todas las pruebas completadas', 'green');
      process.exit(0);
    })
    .catch((error) => {
      log('\n💥 Error fatal en las pruebas', 'red');
      log(`Error: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { testAuthModule };
