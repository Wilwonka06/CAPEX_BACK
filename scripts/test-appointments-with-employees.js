const { sequelize } = require('../src/config/database');
const { Usuario } = require('../src/models/User');
const { Role } = require('../src/models/roles/Role');
const Appointment = require('../src/models/Appointment');
const Services = require('../src/models/Services');
const Scheduling = require('../src/models/Scheduling');
const AppointmentService = require('../src/services/AppointmentService');

async function testAppointmentsWithEmployees() {
  try {
    console.log('🧪 Iniciando pruebas del sistema de citas con empleados...');

    // 1. Verificar que existen usuarios con rol de empleado (roleId = 2)
    console.log('\n1. Verificando empleados existentes...');
    const empleados = await Usuario.findAll({
      where: { roleId: 2, estado: 'Activo' },
      include: [{ model: Role, as: 'rol' }]
    });
    
    console.log(`✅ Empleados activos encontrados: ${empleados.length}`);
    empleados.forEach(emp => {
      console.log(`   - ${emp.nombre} (ID: ${emp.id_usuario}) - ${emp.rol?.nombre}`);
    });

    if (empleados.length === 0) {
      console.log('⚠️  No hay empleados activos. Creando empleado de prueba...');
      
      const empleadoPrueba = await Usuario.create({
        nombre: 'Juan Empleado',
        tipo_documento: 'Cedula de ciudadania',
        documento: 'EMP123456',
        telefono: '+573001234567',
        correo: 'empleado.prueba@empresa.com',
        contrasena: 'Empleado123!',
        roleId: 2,
        estado: 'Activo'
      });
      
      console.log(`✅ Empleado de prueba creado: ${empleadoPrueba.nombre} (ID: ${empleadoPrueba.id_usuario})`);
    }

    // 2. Verificar que existen usuarios con rol de cliente (roleId = 3)
    console.log('\n2. Verificando clientes existentes...');
    const clientes = await Usuario.findAll({
      where: { roleId: 3, estado: 'Activo' },
      include: [{ model: Role, as: 'rol' }]
    });
    
    console.log(`✅ Clientes activos encontrados: ${clientes.length}`);
    clientes.forEach(cli => {
      console.log(`   - ${cli.nombre} (ID: ${cli.id_usuario}) - ${cli.rol?.nombre}`);
    });

    if (clientes.length === 0) {
      console.log('⚠️  No hay clientes activos. Creando cliente de prueba...');
      
      const clientePrueba = await Usuario.create({
        nombre: 'María Cliente',
        tipo_documento: 'Cedula de ciudadania',
        documento: 'CLI123456',
        telefono: '+573001234568',
        correo: 'cliente.prueba@empresa.com',
        contrasena: 'Cliente123!',
        roleId: 3,
        estado: 'Activo'
      });
      
      console.log(`✅ Cliente de prueba creado: ${clientePrueba.nombre} (ID: ${clientePrueba.id_usuario})`);
    }

    // 3. Verificar servicios activos
    console.log('\n3. Verificando servicios activos...');
    const servicios = await Services.findAll({
      where: { estado: 'Activo' }
    });
    
    console.log(`✅ Servicios activos encontrados: ${servicios.length}`);
    servicios.slice(0, 3).forEach(serv => {
      console.log(`   - ${serv.nombre} (ID: ${serv.id_servicio}) - $${serv.precio}`);
    });

    // 4. Crear programación para empleado
    const empleadoActual = await Usuario.findOne({ where: { roleId: 2, estado: 'Activo' } });
    if (empleadoActual) {
      console.log('\n4. Creando programación para empleado...');
      
      const fechaPrueba = new Date();
      fechaPrueba.setDate(fechaPrueba.getDate() + 1); // Mañana
      const fechaStr = fechaPrueba.toISOString().split('T')[0];
      
      try {
        const programacion = await Scheduling.create({
          fecha_inicio: fechaStr,
          hora_entrada: '08:00:00',
          hora_salida: '17:00:00',
          id_usuario: empleadoActual.id_usuario
        });
        
        console.log(`✅ Programación creada para ${empleadoActual.nombre} el ${fechaStr} de 8:00 a 17:00`);
      } catch (error) {
        if (error.message.includes('Ya existe una programación')) {
          console.log(`ℹ️  Ya existe programación para ${empleadoActual.nombre} el ${fechaStr}`);
        } else {
          console.log(`❌ Error creando programación: ${error.message}`);
        }
      }

      // 5. Probar obtener empleados disponibles
      console.log('\n5. Probando obtener empleados disponibles...');
      const empleadosDisponibles = await AppointmentService.getAvailableEmployees(
        fechaStr,
        '09:00:00',
        '10:00:00'
      );
      
      console.log(`✅ Empleados disponibles para ${fechaStr} 9:00-10:00: ${empleadosDisponibles.length}`);
      empleadosDisponibles.forEach(emp => {
        console.log(`   - ${emp.nombre} (ID: ${emp.id_usuario})`);
      });

      // 6. Crear cita de prueba
      const clienteActual = await Usuario.findOne({ where: { roleId: 3, estado: 'Activo' } });
      const servicioActual = await Services.findOne({ where: { estado: 'Activo' } });
      
      if (clienteActual && servicioActual && empleadosDisponibles.length > 0) {
        console.log('\n6. Creando cita de prueba...');
        
        try {
          const citaPrueba = await AppointmentService.createAppointment({
            id_usuario: clienteActual.id_usuario,
            id_empleado: empleadosDisponibles[0].id_usuario,
            id_servicio: servicioActual.id_servicio,
            fecha_servicio: fechaStr,
            hora_entrada: '09:00:00',
            hora_salida: '10:00:00',
            valor_total: servicioActual.precio,
            motivo: 'Prueba de cita con empleado asignado'
          });
          
          console.log(`✅ Cita creada exitosamente:`);
          console.log(`   - Cliente: ${citaPrueba.usuario.nombre}`);
          console.log(`   - Empleado: ${citaPrueba.empleado.nombre}`);
          console.log(`   - Servicio: ${citaPrueba.servicio.nombre}`);
          console.log(`   - Fecha: ${citaPrueba.fecha_servicio}`);
          console.log(`   - Horario: ${citaPrueba.hora_entrada} - ${citaPrueba.hora_salida}`);
          console.log(`   - Estado: ${citaPrueba.estado}`);
          
        } catch (error) {
          console.log(`❌ Error creando cita: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar las pruebas
testAppointmentsWithEmployees();
