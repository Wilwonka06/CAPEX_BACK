const { sequelize } = require('../src/config/database');
const { Usuario } = require('../src/models/User');
const { Role } = require('../src/models/roles/Role');
const Appointment = require('../src/models/Appointment');
const Services = require('../src/models/Services');
const Scheduling = require('../src/models/Scheduling');
const AppointmentService = require('../src/services/AppointmentService');

async function testAppointmentSearch() {
  try {
    console.log('🔍 Iniciando pruebas del buscador de citas...');

    // 1. Verificar que existen citas en el sistema
    console.log('\n1. Verificando citas existentes...');
    const citasExistentes = await Appointment.count();
    console.log(`✅ Citas existentes en el sistema: ${citasExistentes}`);

    if (citasExistentes === 0) {
      console.log('⚠️  No hay citas en el sistema. Creando datos de prueba...');
      await createTestData();
    }

    // 2. Probar búsqueda por cliente
    console.log('\n2. Probando búsqueda por cliente...');
    const empleados = await Usuario.findOne({ where: { roleId: 2, estado: 'Activo' } });
    if (empleados) {
      const resultadoCliente = await AppointmentService.searchAppointments({
        cliente: empleados.nombre.split(' ')[0] // Buscar por primer nombre
      }, 1, 5);
      
      console.log(`✅ Búsqueda por cliente "${empleados.nombre.split(' ')[0]}": ${resultadoCliente.appointments.length} resultados`);
    }

    // 3. Probar búsqueda por empleado
    console.log('\n3. Probando búsqueda por empleado...');
    const clientes = await Usuario.findOne({ where: { roleId: 3, estado: 'Activo' } });
    if (clientes) {
      const resultadoEmpleado = await AppointmentService.searchAppointments({
        empleado: clientes.nombre.split(' ')[0] // Buscar por primer nombre
      }, 1, 5);
      
      console.log(`✅ Búsqueda por empleado "${clientes.nombre.split(' ')[0]}": ${resultadoEmpleado.appointments.length} resultados`);
    }

    // 4. Probar búsqueda por estado
    console.log('\n4. Probando búsqueda por estado...');
    const resultadoEstado = await AppointmentService.searchAppointments({
      estado: 'Agendada'
    }, 1, 5);
    
    console.log(`✅ Búsqueda por estado "Agendada": ${resultadoEstado.appointments.length} resultados`);

    // 5. Probar búsqueda por rango de fechas
    console.log('\n5. Probando búsqueda por rango de fechas...');
    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaManana = new Date();
    fechaManana.setDate(fechaManana.getDate() + 1);
    const fechaMananaStr = fechaManana.toISOString().split('T')[0];
    
    const resultadoFechas = await AppointmentService.searchAppointments({
      fecha_inicio: fechaHoy,
      fecha_fin: fechaMananaStr
    }, 1, 5);
    
    console.log(`✅ Búsqueda por fechas ${fechaHoy} a ${fechaMananaStr}: ${resultadoFechas.appointments.length} resultados`);

    // 6. Probar búsqueda por rango de valores
    console.log('\n6. Probando búsqueda por rango de valores...');
    const resultadoValores = await AppointmentService.searchAppointments({
      valor_min: 50,
      valor_max: 200
    }, 1, 5);
    
    console.log(`✅ Búsqueda por valores $50-$200: ${resultadoValores.appointments.length} resultados`);

    // 7. Probar búsqueda por servicio
    console.log('\n7. Probando búsqueda por servicio...');
    const servicios = await Services.findOne({ where: { estado: 'Activo' } });
    if (servicios) {
      const resultadoServicio = await AppointmentService.searchAppointments({
        servicio: servicios.nombre.split(' ')[0] // Buscar por primera palabra del nombre
      }, 1, 5);
      
      console.log(`✅ Búsqueda por servicio "${servicios.nombre.split(' ')[0]}": ${resultadoServicio.appointments.length} resultados`);
    }

    // 8. Probar búsqueda combinada
    console.log('\n8. Probando búsqueda combinada...');
    const resultadoCombinado = await AppointmentService.searchAppointments({
      estado: 'Agendada',
      valor_min: 50,
      ordenar_por: 'valor',
      orden_direccion: 'ASC'
    }, 1, 5);
    
    console.log(`✅ Búsqueda combinada: ${resultadoCombinado.appointments.length} resultados`);
    console.log(`   - Ordenado por valor (ASC)`);
    console.log(`   - Solo estado "Agendada"`);
    console.log(`   - Valor mínimo $50`);

    // 9. Probar búsqueda por rol de cliente
    console.log('\n9. Probando búsqueda por rol de cliente...');
    const resultadoRolCliente = await AppointmentService.searchAppointments({
      rol_cliente: 3
    }, 1, 5);
    
    console.log(`✅ Búsqueda por rol de cliente (3): ${resultadoRolCliente.appointments.length} resultados`);

    // 10. Probar búsqueda por rol de empleado
    console.log('\n10. Probando búsqueda por rol de empleado...');
    const resultadoRolEmpleado = await AppointmentService.searchAppointments({
      rol_empleado: 2
    }, 1, 5);
    
    console.log(`✅ Búsqueda por rol de empleado (2): ${resultadoRolEmpleado.appointments.length} resultados`);

    console.log('\n🎉 Pruebas de búsqueda completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas de búsqueda:', error);
  } finally {
    await sequelize.close();
  }
}

async function createTestData() {
  try {
    console.log('📝 Creando datos de prueba...');

    // Crear empleado de prueba
    const empleado = await Usuario.create({
      nombre: 'Ana Empleada',
      tipo_documento: 'Cedula de ciudadania',
      documento: 'EMP789012',
      telefono: '+573001234789',
      correo: 'ana.empleada@empresa.com',
      contrasena: 'Empleada123!',
      roleId: 2,
      estado: 'Activo'
    });

    // Crear cliente de prueba
    const cliente = await Usuario.create({
      nombre: 'Pedro Cliente',
      tipo_documento: 'Cedula de ciudadania',
      documento: 'CLI789012',
      telefono: '+573001234790',
      correo: 'pedro.cliente@empresa.com',
      contrasena: 'Cliente123!',
      roleId: 3,
      estado: 'Activo'
    });

    // Crear servicio de prueba
    const servicio = await Services.create({
      nombre: 'Corte de Cabello Premium',
      descripcion: 'Corte y peinado profesional con productos premium',
      duracion: 90,
      precio: 120.00,
      estado: 'Activo'
    });

    // Crear programación para empleado
    const fechaPrueba = new Date();
    fechaPrueba.setDate(fechaPrueba.getDate() + 1);
    const fechaStr = fechaPrueba.toISOString().split('T')[0];

    await Scheduling.create({
      fecha_inicio: fechaStr,
      hora_entrada: '08:00:00',
      hora_salida: '17:00:00',
      id_usuario: empleado.id_usuario
    });

    // Crear citas de prueba
    const citasPrueba = [
      {
        id_usuario: cliente.id_usuario,
        id_empleado: empleado.id_usuario,
        id_servicio: servicio.id_servicio,
        fecha_servicio: fechaStr,
        hora_entrada: '09:00:00',
        hora_salida: '10:30:00',
        estado: 'Agendada',
        valor_total: 120.00,
        motivo: 'Corte de cabello premium'
      },
      {
        id_usuario: cliente.id_usuario,
        id_empleado: empleado.id_usuario,
        id_servicio: servicio.id_servicio,
        fecha_servicio: fechaStr,
        hora_entrada: '11:00:00',
        hora_salida: '12:30:00',
        estado: 'Confirmada',
        valor_total: 120.00,
        motivo: 'Corte de cabello premium confirmado'
      },
      {
        id_usuario: cliente.id_usuario,
        id_empleado: empleado.id_usuario,
        id_servicio: servicio.id_servicio,
        fecha_servicio: fechaStr,
        hora_entrada: '14:00:00',
        hora_salida: '15:30:00',
        estado: 'En proceso',
        valor_total: 120.00,
        motivo: 'Corte de cabello premium en proceso'
      }
    ];

    for (const cita of citasPrueba) {
      await Appointment.create(cita);
    }

    console.log('✅ Datos de prueba creados exitosamente');
    console.log(`   - Empleado: ${empleado.nombre}`);
    console.log(`   - Cliente: ${cliente.nombre}`);
    console.log(`   - Servicio: ${servicio.nombre}`);
    console.log(`   - Citas creadas: ${citasPrueba.length}`);

  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
  }
}

// Ejecutar las pruebas
testAppointmentSearch();
