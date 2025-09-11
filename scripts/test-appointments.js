const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:3000/api';

  // Función para crear una cita de prueba
  async function createTestAppointment() {
    try {
      const appointmentData = {
        id_usuario: 1,
        id_servicio: 1,
        fecha_servicio: '2024-02-15',
        hora_entrada: '09:00:00',
        hora_salida: '10:00:00',
        valor_total: 150.00,
        motivo: 'Corte de cabello y peinado de prueba'
      };

    const response = await axios.post(`${BASE_URL}/appointments`, appointmentData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Cita creada exitosamente:', response.data.data.id_servicio_cliente);
    return response.data.data.id_servicio_cliente;
  } catch (error) {
    console.error('❌ Error al crear cita:', error.response?.data || error.message);
    throw error;
  }
}

// Función para obtener todas las citas
async function getAppointments() {
  try {
    const response = await axios.get(`${BASE_URL}/appointments`);

    console.log('✅ Citas obtenidas:', response.data.data.length, 'citas encontradas');
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener citas:', error.response?.data || error.message);
    throw error;
  }
}

// Función para obtener una cita específica
async function getAppointmentById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/${id}`);

    console.log('✅ Cita obtenida por ID:', response.data.data.id_servicio_cliente);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener cita por ID:', error.response?.data || error.message);
    throw error;
  }
}

// Función para actualizar una cita
async function updateAppointment(id) {
  try {
    const updateData = {
      estado: 'Confirmada',
      motivo: 'Cita confirmada por el cliente'
    };

    const response = await axios.put(`${BASE_URL}/appointments/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Cita actualizada:', response.data.data.estado);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al actualizar cita:', error.response?.data || error.message);
    throw error;
  }
}

// Función para cambiar estado de cita
async function changeAppointmentStatus(id) {
  try {
    const statusData = {
      estado: 'En proceso',
      motivo: 'Servicio iniciado'
    };

    const response = await axios.patch(`${BASE_URL}/appointments/${id}/status`, statusData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Estado de cita cambiado:', response.data.data.estado);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al cambiar estado:', error.response?.data || error.message);
    throw error;
  }
}



// Función para verificar conflictos de horario
async function checkScheduleConflicts() {
  try {
    const params = {
      fecha: '2024-02-15',
      hora_entrada: '09:30:00',
      hora_salida: '10:30:00',
      id_servicio: 1
    };

    const response = await axios.get(`${BASE_URL}/appointments/conflicts`, {
      params
    });

    console.log('✅ Verificación de conflictos:', response.data.data.tieneConflictos);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al verificar conflictos:', error.response?.data || error.message);
    throw error;
  }
}

  // Función para obtener citas por usuario
  async function getAppointmentsByUser(userId = 1) {
    try {
          const response = await axios.get(`${BASE_URL}/appointments/user/${userId}`);

      console.log('✅ Citas por usuario obtenidas:', response.data.data.length, 'citas');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error al obtener citas por usuario:', error.response?.data || error.message);
      throw error;
    }
  }

// Función para obtener citas por servicio
async function getAppointmentsByService(serviceId = 1) {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/service/${serviceId}`);

    console.log('✅ Citas por servicio obtenidas:', response.data.data.length, 'citas');
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener citas por servicio:', error.response?.data || error.message);
    throw error;
  }
}

// Función para eliminar una cita
async function deleteAppointment(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/appointments/${id}`);

    console.log('✅ Cita eliminada:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar cita:', error.response?.data || error.message);
    throw error;
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas del módulo de citas...\n');

  try {
    // 1. Obtener citas existentes
    console.log('\n📋 Obteniendo citas existentes...');
    await getAppointments();

    // 3. Crear una cita de prueba
    console.log('\n➕ Creando cita de prueba...');
    const appointmentId = await createTestAppointment();

    // 4. Obtener la cita creada
    console.log('\n🔍 Obteniendo cita por ID...');
    await getAppointmentById(appointmentId);

    // 5. Actualizar la cita
    console.log('\n✏️ Actualizando cita...');
    await updateAppointment(appointmentId);

    // 6. Cambiar estado de la cita
    console.log('\n🔄 Cambiando estado de cita...');
    await changeAppointmentStatus(appointmentId);

    

    // 8. Verificar conflictos de horario
    console.log('\n⚠️ Verificando conflictos de horario...');
    await checkScheduleConflicts();

    // 9. Obtener citas por usuario
    console.log('\n👤 Obteniendo citas por usuario...');
    await getAppointmentsByUser();

    // 10. Obtener citas por servicio
    console.log('\n🛠️ Obteniendo citas por servicio...');
    await getAppointmentsByService();

    // 11. Eliminar la cita de prueba
    console.log('\n🗑️ Eliminando cita de prueba...');
    await deleteAppointment(appointmentId);

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('\n💥 Error en las pruebas:', error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
  runTests();
}

module.exports = {
  createTestAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  changeAppointmentStatus,
  checkScheduleConflicts,
  getAppointmentsByUser,
  getAppointmentsByService,
  deleteAppointment
};
