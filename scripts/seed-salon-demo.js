'use strict';

require('dotenv').config();

const { connectDB, sequelize } = require('../src/config/database');
const { setupAssociations } = require('../src/config/associations');
const { initializeRoles } = require('../src/config/initRoles');

const ServiceCategory = require('../src/models/ServiceCategory');
const Services = require('../src/models/Services');
const { Usuario } = require('../src/models/User');
const Scheduling = require('../src/models/Scheduling');
const Citas = require('../src/models/Appointment');
const ServiceDetail = require('../src/models/serviceDetails/ServiceDetail');
const AppointmentService = require('../src/services/AppointmentService');

async function findOrCreate(model, where, defaults = {}) {
  const existing = await model.findOne({ where });
  if (existing) return existing;
  return model.create({ ...where, ...defaults });
}

async function seed() {
  console.log('🚀 Iniciando seed de datos de demostración...');

  await connectDB();
  setupAssociations();
  await initializeRoles();

  // ========= 1) Categorías =========
  console.log('\n👉 Creando categorías...');
  const catCorte = await findOrCreate(ServiceCategory, { nombre: 'Corte y Peinado' }, {
    descripcion: 'Servicios de corte, estilizado y peinado',
    estado: 'Activo'
  });
  const catColor = await findOrCreate(ServiceCategory, { nombre: 'Coloración' }, {
    descripcion: 'Tintes, mechas y balayage',
    estado: 'Activo'
  });
  const catTrat = await findOrCreate(ServiceCategory, { nombre: 'Tratamientos' }, {
    descripcion: 'Hidratación, keratina y alisados',
    estado: 'Activo'
  });

  // ========= 2) Usuarios =========
  // Nota: Se asume roleId: 2 = Empleado, 3 = Cliente. Ajusta si tu DB tiene otros IDs
  console.log('\n👉 Creando usuarios (2 empleados, 1 cliente)...');
  const empleado1 = await findOrCreate(Usuario, { correo: 'maria.gomez@demo.com' }, {
    nombre: 'María Gómez',
    tipo_documento: 'Cedula de ciudadania',
    documento: 'EMP001',
    telefono: '+573001112223',
    contrasena: 'ClaveSegura@123',
    roleId: 2,
    foto: 'https://example.com/maria.jpg',
    estado: 'Activo',
    direccion: 'Calle 10 # 5-23, Centro'
  });

  const empleado2 = await findOrCreate(Usuario, { correo: 'luis.herrera@demo.com' }, {
    nombre: 'Luis Herrera',
    tipo_documento: 'Cedula de ciudadania',
    documento: 'EMP002',
    telefono: '+573001112224',
    contrasena: 'ClaveSegura@123',
    roleId: 2,
    foto: 'https://example.com/luis.jpg',
    estado: 'Activo',
    direccion: 'Cra 45 # 120-11, Norte'
  });

  const cliente = await findOrCreate(Usuario, { correo: 'ana.perez@demo.com' }, {
    nombre: 'Ana Pérez',
    tipo_documento: 'Cedula de ciudadania',
    documento: 'CLI001',
    telefono: '+573001112225',
    contrasena: 'ClaveSegura@123',
    roleId: 3,
    foto: 'https://example.com/ana.jpg',
    estado: 'Activo',
    direccion: 'Transv 90 # 20-30, Sur'
  });

  // ========= 3) Programaciones =========
  console.log('\n👉 Creando programaciones para empleados...');
  const fechas = ['2025-09-20', '2025-09-21'];
  for (const fecha of fechas) {
    await findOrCreate(Scheduling, { id_usuario: empleado1.id_usuario, fecha_inicio: fecha }, {
      hora_entrada: '08:00:00',
      hora_salida: '18:00:00'
    });
    await findOrCreate(Scheduling, { id_usuario: empleado2.id_usuario, fecha_inicio: fecha }, {
      hora_entrada: '08:00:00',
      hora_salida: '18:00:00'
    });
  }

  // ========= 4) Servicios =========
  console.log('\n👉 Creando servicios...');
  const corte = await findOrCreate(Services, { nombre: 'Corte de Cabello' }, {
    id_categoria_servicio: catCorte.id_categoria_servicio,
    descripcion: 'Corte básico de cabello para damas y caballeros',
    duracion: 30,
    precio: 25000.00,
    estado: 'Activo',
    foto: 'https://example.com/corte.jpg'
  });
  const tinte = await findOrCreate(Services, { nombre: 'Tinte' }, {
    id_categoria_servicio: catColor.id_categoria_servicio,
    descripcion: 'Aplicación de tinte profesional',
    duracion: 90,
    precio: 120000.00,
    estado: 'Activo',
    foto: 'https://example.com/tinte.jpg'
  });
  const hidratacion = await findOrCreate(Services, { nombre: 'Hidratación Capilar' }, {
    id_categoria_servicio: catTrat.id_categoria_servicio,
    descripcion: 'Tratamiento hidratante para cabello dañado',
    duracion: 60,
    precio: 80000.00,
    estado: 'Activo',
    foto: 'https://example.com/hidratacion.jpg'
  });

  // ========= 5) Citas =========
  console.log('\n👉 Creando citas con servicios asignados...');

  const citasPayloads = [
    {
      cita: {
        id_cliente: cliente.id_usuario,
        fecha_servicio: '2025-09-20',
        hora_entrada: '09:00:00',
        motivo: 'Corte clásico'
      },
      servicios: [
        {
          id_servicio: corte.id_servicio,
          id_empleado: empleado1.id_usuario,
          cantidad: 1,
          hora_inicio: '09:00:00',
          observaciones: 'Corte en capas'
        }
      ]
    },
    {
      cita: {
        id_cliente: cliente.id_usuario,
        fecha_servicio: '2025-09-20',
        hora_entrada: '10:30:00',
        motivo: 'Coloración y brillo'
      },
      servicios: [
        {
          id_servicio: tinte.id_servicio,
          id_empleado: empleado2.id_usuario,
          cantidad: 1,
          hora_inicio: '10:30:00',
          observaciones: 'Tono castaño claro'
        }
      ]
    },
    {
      cita: {
        id_cliente: cliente.id_usuario,
        fecha_servicio: '2025-09-21',
        hora_entrada: '08:30:00',
        motivo: 'Corte + hidratación'
      },
      servicios: [
        {
          id_servicio: corte.id_servicio,
          id_empleado: empleado1.id_usuario,
          cantidad: 1,
          hora_inicio: '08:30:00',
          observaciones: 'Corte bob'
        },
        {
          id_servicio: hidratacion.id_servicio,
          id_empleado: empleado2.id_usuario,
          cantidad: 1,
          hora_inicio: '09:15:00',
          observaciones: 'Hidratación profunda'
        }
      ]
    }
  ];

  for (const payload of citasPayloads) {
    // Enriquecer servicios con precio_unitario, duracion y hora_finalizacion para que
    // el cálculo de totales funcione en createAppointment
    const serviciosEnriquecidos = [];
    for (const s of payload.servicios) {
      const svc = await Services.findByPk(s.id_servicio);
      const [h, m] = s.hora_inicio.split(':').map(Number);
      const totalMin = h * 60 + m + Number(svc.duracion);
      const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
      const endM = String(totalMin % 60).padStart(2, '0');
      serviciosEnriquecidos.push({
        ...s,
        precio_unitario: svc.precio,
        duracion: svc.duracion,
        hora_finalizacion: `${endH}:${endM}:00`
      });
    }

    const result = await AppointmentService.createAppointment({
      cita: payload.cita,
      servicios: serviciosEnriquecidos
    });
    if (!result.success) {
      throw new Error(`Fallo al crear cita: ${result.message}`);
    }
    console.log('✅ Cita creada:', result.data.id_cita, '-', result.data.motivo);
  }

  console.log('\n🎉 Seed completado con éxito.');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('💥 Error durante el seed:', err);
    process.exit(1);
  });


