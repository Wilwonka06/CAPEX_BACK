const Citas = require('../models/Appointment');
const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
const { Usuario } = require('../models/User');
const Services = require('../models/Services');
const Scheduling = require('../models/Scheduling');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

class CitasService {
  // Obtener todas las citas con paginación y filtros
  async getAllAppointments(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Aplicar filtros
    if (filters.estado) {
      whereClause.estado = filters.estado;
    }

    if (filters.fecha_desde || filters.fecha_hasta) {
      whereClause.fecha_servicio = {};
      if (filters.fecha_desde) whereClause.fecha_servicio[Op.gte] = filters.fecha_desde;
      if (filters.fecha_hasta) whereClause.fecha_servicio[Op.lte] = filters.fecha_hasta;
    }

    if (filters.id_usuario) {
      whereClause.id_cliente = filters.id_usuario; // Mantener foreignKey id_cliente para compatibilidad BD
    }

    const { count, rows } = await Citas.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'telefono', 'correo']
        },
        {
          model: ServiceDetail,
          as: 'servicios',
          include: [
            {
              model: Usuario,
              as: 'empleado',
              attributes: ['id_usuario', 'nombre']
            },
            {
              model: Services,
              as: 'servicio',
              attributes: ['id_servicio', 'nombre', 'descripcion']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha_servicio', 'ASC'], ['hora_entrada', 'ASC']]
    });

    return {
      success: true,
      message: 'Citas obtenidas exitosamente',
      data: {
        citas: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      }
    };
  }

  // Obtener cita por ID
  async getAppointmentById(id) {
    try {
      const appointment = await Citas.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'telefono', 'correo', 'direccion']
          },
          {
            model: ServiceDetail,
            as: 'servicios',
            include: [
              {
                model: Usuario,
                as: 'empleado',
                attributes: ['id_usuario', 'nombre', 'telefono']
              },
              {
                model: Services,
                as: 'servicio',
                attributes: ['id_servicio', 'nombre', 'descripcion', 'duracion']
              }
            ]
          }
        ]
      });

      if (!appointment) {
        return {
          success: false,
          message: 'Cita no encontrada'
        };
      }

      return {
        success: true,
        message: 'Cita obtenida exitosamente',
        data: appointment
      };
    } catch (error) {
      throw new Error(`Error al obtener cita: ${error.message}`);
    }
  }

  // Crear nueva cita con servicios
  async createAppointment(appointmentData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { cita, servicios } = appointmentData;

      // Validar que el usuario existe y está activo
      const usuario = await Usuario.findByPk(cita.id_cliente);
      if (!usuario || usuario.estado !== 'Activo') {
        throw new Error('Usuario no encontrado o inactivo');
      }

      // Validar servicios
      if (!servicios || servicios.length === 0) {
        throw new Error('Debe incluir al menos un servicio');
      }

      // Validar disponibilidad de empleados y servicios
      await this.validateEmployeeAvailability(servicios, cita.fecha_servicio, transaction);

      // Enriquecer servicios con precio_unitario, duracion y hora_finalizacion
      const serviciosEnriquecidos = [];
      for (const s of servicios) {
        const svc = await Services.findByPk(s.id_servicio, { transaction });
        const hora_finalizacion = this.calculateEndTime(s.hora_inicio, svc.duracion);
        serviciosEnriquecidos.push({
          ...s,
          precio_unitario: svc.precio,
          duracion: svc.duracion,
          hora_finalizacion
        });
      }

      // Calcular hora_salida y valor_total en base a servicios enriquecidos
      const { horaSalida, valorTotal } = await this.calculateAppointmentTotals(serviciosEnriquecidos);

      // Crear la cita
      const newCitas = await Citas.create({
        ...cita,
        hora_salida: horaSalida,
        valor_total: valorTotal
      }, { transaction });

      // Crear los servicios
      const createdServices = [];
      for (const servicio of serviciosEnriquecidos) {
        const serviceData = await this.prepareServiceData(
          servicio,
          newCitas.id_cita,
          cita.id_cliente, // id_usuario del usuario
          cita.fecha_servicio
        );
        const newService = await ServiceDetail.create(serviceData, { transaction });
        createdServices.push(newService);
      }

      await transaction.commit();

      // Obtener la cita completa con servicios
      const completeCitas = await this.getAppointmentById(newCitas.id_cita);

      return {
        success: true,
        message: 'Cita creada exitosamente',
        data: completeCitas.data
      };
    } catch (error) {
      try {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
      } catch(_) {}
      throw new Error(`Error al crear cita: ${error.message}`);
    }
  }

  // Actualizar cita completa
  async updateAppointment(id, appointmentData) {
    const transaction = await sequelize.transaction();
    
    try {
      const appointment = await Citas.findByPk(id);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // Validar que la cita no esté finalizada o cancelada
      if (['Finalizada', 'Pagada', 'Cancelada por el usuario'].includes(appointment.estado)) {
        throw new Error('No se puede modificar una cita finalizada, pagada o cancelada');
      }

      const { cita, servicios } = appointmentData;

      // Si se están actualizando servicios, validar disponibilidad
      if (servicios && servicios.length > 0) {
        await this.validateEmployeeAvailability(servicios, cita.fecha_servicio, transaction);
        
        // Eliminar servicios existentes
        await ServiceDetail.destroy({
          where: { id_cita: id },
          transaction
        });

        // Enriquecer servicios para guardar completos y calcular totales
        const serviciosEnriquecidos = [];
        for (const s of servicios) {
          const svc = await Services.findByPk(s.id_servicio, { transaction });
          const hora_finalizacion = this.calculateEndTime(s.hora_inicio, svc.duracion);
          serviciosEnriquecidos.push({
            ...s,
            precio_unitario: svc.precio,
            duracion: svc.duracion,
            hora_finalizacion
          });
        }

        // Crear nuevos servicios
        for (const servicio of serviciosEnriquecidos) {
          const serviceData = await this.prepareServiceData(
            servicio,
            id,
            cita.id_cliente, // id_usuario del usuario
            cita.fecha_servicio
          );
          await ServiceDetail.create(serviceData, { transaction });
        }

        // Recalcular totales
        const { horaSalida, valorTotal } = await this.calculateAppointmentTotals(serviciosEnriquecidos);
        cita.hora_salida = horaSalida;
        cita.valor_total = valorTotal;
      }

      // Actualizar la cita
      await appointment.update(cita, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Cita actualizada exitosamente',
        data: await this.getAppointmentById(id)
      };
    } catch (error) {
      try {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
      } catch(_) {}
      throw new Error(`Error al actualizar cita: ${error.message}`);
    }
  }

  // Cancelar cita
  async cancelAppointment(id, motivo = 'Cancelada por el usuario') {
    try {
      const appointment = await Citas.findByPk(id);
      if (!appointment) {
        return {
          success: false,
          message: 'Cita no encontrada'
        };
      }

      // Validar que se puede cancelar
      if (['Finalizada', 'Pagada', 'Cancelada por el usuario'].includes(appointment.estado)) {
        return {
          success: false,
          message: 'No se puede cancelar una cita que ya está finalizada, pagada o cancelada'
        };
      }

      await appointment.update({
        estado: 'Cancelada por el usuario',
        motivo: motivo
      });

      // Cancelar todos los servicios asociados
      await ServiceDetail.update(
        { estado: 'Cancelada por el usuario' },
        { where: { id_cita: id } }
      );

      return {
        success: true,
        message: 'Cita cancelada exitosamente',
        data: await this.getCitasById(id)
      };
    } catch (error) {
      throw new Error(`Error al cancelar cita: ${error.message}`);
    }
  }

  // Buscar citas por texto
  async searchAppointments(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Citas.findAndCountAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: `%${query}%` } },
              { correo: { [Op.like]: `%${query}%` } },
              { telefono: { [Op.like]: `%${query}%` } }
            ]
          },
          attributes: ['id_usuario', 'nombre', 'telefono', 'correo']
        },
        {
          model: ServiceDetail,
          as: 'servicios',
          include: [
            {
              model: Usuario,
              as: 'empleado',
              attributes: ['id_usuario', 'nombre']
            },
            {
              model: Services,
              as: 'servicio',
              attributes: ['id_servicio', 'nombre', 'descripcion']
            }
          ]
        }
      ],
      where: {
        [Op.or]: [
          { motivo: { [Op.like]: `%${query}%` } },
          { estado: { [Op.like]: `%${query}%` } }
        ]
      },
      limit,
      offset,
      order: [['fecha_servicio', 'ASC'], ['hora_entrada', 'ASC']]
    });

    return {
      success: true,
      message: 'Búsqueda completada exitosamente',
      data: {
        citas: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      }
    };
  }

  // Agregar servicio a cita existente
  async addServiceToAppointment(id, serviceData) {
    const transaction = await sequelize.transaction();
    
    try {
      const appointment = await Citas.findByPk(id);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // Validar que la cita no esté finalizada o cancelada
      if (['Finalizada', 'Pagada', 'Cancelada por el usuario'].includes(appointment.estado)) {
        throw new Error('No se puede agregar servicios a una cita finalizada, pagada o cancelada');
      }

      // Validar disponibilidad del empleado
      await this.validateEmployeeAvailability([serviceData], appointment.fecha_servicio, transaction);

      // Preparar datos del servicio
      const preparedServiceData = await this.prepareServiceData(
        serviceData,
        id,
        appointment.id_cliente, // id_usuario del usuario
        appointment.fecha_servicio
      );
      const newService = await ServiceDetail.create(preparedServiceData, { transaction });

      // Recalcular totales de la cita
      const allServices = await ServiceDetail.findAll({
        where: { id_cita: id },
        transaction
      });

      const { horaSalida, valorTotal } = await this.calculateAppointmentTotals(allServices);
      await appointment.update({
        hora_salida: horaSalida,
        valor_total: valorTotal
      }, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Servicio agregado exitosamente',
        data: await this.getAppointmentById(id)
      };
    } catch (error) {
      try {
        if (transaction && transaction.finished !== 'commit') {
          await transaction.rollback();
        }
      } catch(_) {}
      throw new Error(`Error al agregar servicio: ${error.message}`);
    }
  }

  // Cancelar servicio específico
  async cancelService(id, detalleId) {
    try {
      const appointment = await Citas.findByPk(id);
      if (!appointment) {
        return {
          success: false,
          message: 'Cita no encontrada'
        };
      }

      const service = await ServiceDetail.findOne({
        where: { 
          id_detalle_servicio: detalleId,
          id_cita: id 
        }
      });

      if (!service) {
        return {
          success: false,
          message: 'Servicio no encontrado en esta cita'
        };
      }

      // Validar que se puede cancelar
      if (['Finalizada', 'Pagada', 'Cancelada por el usuario'].includes(service.estado)) {
        return {
          success: false,
          message: 'No se puede cancelar un servicio que ya está finalizado, pagado o cancelado'
        };
      }

      await service.update({ estado: 'Cancelada por el usuario' });

      // Recalcular totales si hay servicios activos
      const activeServices = await ServiceDetail.findAll({
        where: { 
          id_cita: id,
          estado: { [Op.notIn]: ['Finalizada', 'Pagada', 'Cancelada por el cliente'] }
        }
      });

      if (activeServices.length === 0) {
        // Si no hay servicios activos, cancelar toda la cita
        await appointment.update({ estado: 'Cancelada por el usuario' });
      } else {
        // Recalcular totales
        const { horaSalida, valorTotal } = await this.calculateAppointmentTotals(activeServices);
        await appointment.update({
          hora_salida: horaSalida,
          valor_total: valorTotal
        });
      }

      return {
        success: true,
        message: 'Servicio cancelado exitosamente',
        data: await this.getAppointmentById(id)
      };
    } catch (error) {
      throw new Error(`Error al cancelar servicio: ${error.message}`);
    }
  }

  // Obtener servicio por ID
  async getServiceById(id, detalleId) {
    try {
      const service = await ServiceDetail.findOne({
        where: { 
          id_detalle_servicio: detalleId,
          id_cita: id 
        },
        include: [
          {
            model: Usuario,
            as: 'empleado',
            attributes: ['id_usuario', 'nombre', 'telefono']
          },
          {
            model: Services,
            as: 'servicio',
            attributes: ['id_servicio', 'nombre', 'descripcion', 'duracion']
          }
        ]
      });

      if (!service) {
        return {
          success: false,
          message: 'Servicio no encontrado'
        };
      }

      return {
        success: true,
        message: 'Servicio obtenido exitosamente',
        data: service
      };
    } catch (error) {
      throw new Error(`Error al obtener servicio: ${error.message}`);
    }
  }

  // Métodos auxiliares privados

  // Validar disponibilidad de empleados
  async validateEmployeeAvailability(servicios, fechaServicio, transaction) {
    for (const servicio of servicios) {
      // Validar que el empleado existe y está activo
      const empleado = await Usuario.findByPk(servicio.id_empleado, { transaction });
      if (!empleado || empleado.estado !== 'Activo') {
        throw new Error(`Empleado con ID ${servicio.id_empleado} no encontrado o inactivo`);
      }

      // Validar que el servicio existe y está activo
      const service = await Services.findByPk(servicio.id_servicio, { transaction });
      if (!service || service.estado !== 'Activo') {
        throw new Error(`Servicio con ID ${servicio.id_servicio} no encontrado o inactivo`);
      }

      // Validar disponibilidad en programaciones
      const programacion = await Scheduling.findOne({
        where: {
          id_usuario: servicio.id_empleado,
          fecha_inicio: fechaServicio
        },
        transaction
      });

      if (!programacion) {
        throw new Error(`Empleado ${empleado.nombre} no tiene programación para la fecha ${fechaServicio}`);
      }

      // Validar que el horario del servicio esté dentro de la programación del empleado
      const horaInicio = servicio.hora_inicio;
      const horaFin = this.calculateEndTime(horaInicio, service.duracion);

      if (horaInicio < programacion.hora_entrada || horaFin > programacion.hora_salida) {
        throw new Error(`El horario del servicio no está dentro de la programación del empleado ${empleado.nombre}`);
      }

      // Validar que no hay conflictos con otros servicios
      const conflictingServices = await ServiceDetail.findAll({
        where: {
          id_empleado: servicio.id_empleado,
          fecha_programada: fechaServicio,
          estado: { [Op.notIn]: ['Cancelada por el usuario', 'No asistio'] },
          [Op.or]: [
            {
              hora_inicio: {
                [Op.between]: [horaInicio, horaFin]
              }
            },
            {
              hora_finalizacion: {
                [Op.between]: [horaInicio, horaFin]
              }
            }
          ]
        },
        transaction
      });

      if (conflictingServices.length > 0) {
        throw new Error(`El empleado ${empleado.nombre} ya tiene un servicio programado en ese horario`);
      }
    }
  }

  // Calcular totales de la cita
  async calculateAppointmentTotals(servicios) {
    let valorTotal = 0;
    let horaSalidaMaxima = '00:00:00';

    for (const servicio of servicios) {
      if (servicio.precio_unitario && servicio.cantidad) {
        valorTotal += parseFloat(servicio.precio_unitario) * parseInt(servicio.cantidad);
      }

      if (servicio.hora_finalizacion && servicio.hora_finalizacion > horaSalidaMaxima) {
        horaSalidaMaxima = servicio.hora_finalizacion;
      }
    }

    return {
      horaSalida: horaSalidaMaxima,
      valorTotal: valorTotal
    };
  }

  // Preparar datos del servicio
  async prepareServiceData(servicio, idCita, idUsuario, fechaProgramada) {
    const service = await Services.findByPk(servicio.id_servicio);
    
    return {
      id_empleado: servicio.id_empleado,
      id_servicio: servicio.id_servicio,
      id_cita: idCita,
      id_cliente: idUsuario || null, // Mantener foreignKey id_cliente
      precio_unitario: servicio.precio_unitario ?? service.precio,
      cantidad: servicio.cantidad || 1,
      hora_inicio: servicio.hora_inicio,
      hora_finalizacion: servicio.hora_finalizacion || this.calculateEndTime(servicio.hora_inicio, service.duracion ?? service.duracion),
      duracion: servicio.duracion ?? service.duracion,
      fecha_programada: fechaProgramada || null,
      estado: 'Agendada',
      observaciones: servicio.observaciones || null
    };
  }

  // Calcular hora de finalización
  calculateEndTime(horaInicio, duracion) {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + duracion;
    const nuevasHoras = Math.floor(totalMinutos / 60);
    const nuevosMinutos = totalMinutos % 60;
    
    return `${nuevasHoras.toString().padStart(2, '0')}:${nuevosMinutos.toString().padStart(2, '0')}:00`;
  }
}

module.exports = new CitasService();
