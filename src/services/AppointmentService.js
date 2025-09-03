const { Op } = require('sequelize');
const Appointment = require('../models/Appointment');
const Services = require('../models/Services');
const { Usuario } = require('../models/User');

class AppointmentService {
  /**
   * Crear una nueva cita
   */
  static async createAppointment(appointmentData) {
    try {
      // Verificar que el usuario existe, está activo y tiene rol de cliente
      const user = await Usuario.findByPk(appointmentData.id_usuario);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (user.estado !== 'Activo') {
        throw new Error('El usuario está inactivo');
      }

      // Verificar que el usuario tenga rol de cliente (roleId = 2)
      if (user.roleId !== 2) {
        throw new Error('El usuario debe tener rol de cliente');
      }

      // Verificar que el servicio existe y está activo
      const service = await Services.findByPk(appointmentData.id_servicio);
      if (!service) {
        throw new Error('Servicio no encontrado');
      }

      if (service.estado !== 'Activo') {
        throw new Error('El servicio no está activo');
      }

      // Verificar conflictos de horario
      const conflictos = await this.checkScheduleConflicts(
        appointmentData.fecha_servicio,
        appointmentData.hora_entrada,
        appointmentData.hora_salida,
        appointmentData.id_servicio
      );

      if (conflictos.length > 0) {
        throw new Error('Existe un conflicto de horario para este servicio en la fecha y hora especificadas');
      }

      // Crear la cita
      const appointment = await Appointment.create(appointmentData);

      // Retornar la cita con información del cliente y servicio
      return await this.getAppointmentById(appointment.id_servicio_cliente);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las citas con filtros opcionales
   */
  static async getAppointments(filters = {}, page = 1, limit = 10) {
    try {
      const whereClause = {};
      const includeClause = [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo', 'telefono', 'estado', 'roleId']
        },
        {
          model: Services,
          as: 'servicio',
          attributes: ['id_servicio', 'nombre', 'descripcion', 'duracion', 'precio']
        }
      ];

      // Aplicar filtros
      if (filters.usuario) {
        whereClause.id_usuario = filters.usuario;
      }

      if (filters.servicio) {
        whereClause.id_servicio = filters.servicio;
      }

      if (filters.estado) {
        whereClause.estado = filters.estado;
      }

      if (filters.fecha_inicio && filters.fecha_fin) {
        whereClause.fecha_servicio = {
          [Op.between]: [filters.fecha_inicio, filters.fecha_fin]
        };
      } else if (filters.fecha_inicio) {
        whereClause.fecha_servicio = {
          [Op.gte]: filters.fecha_inicio
        };
      } else if (filters.fecha_fin) {
        whereClause.fecha_servicio = {
          [Op.lte]: filters.fecha_fin
        };
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Appointment.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: [['fecha_servicio', 'ASC'], ['hora_entrada', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        appointments: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener una cita por ID
   */
  static async getAppointmentById(id) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'correo', 'telefono', 'estado', 'roleId']
          },
          {
            model: Services,
            as: 'servicio',
            attributes: ['id_servicio', 'nombre', 'descripcion', 'duracion', 'precio']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      return appointment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar una cita
   */
  static async updateAppointment(id, updateData) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // Si se está actualizando fecha, hora o servicio, verificar conflictos
      if (updateData.fecha_servicio || updateData.hora_entrada || updateData.hora_salida || updateData.id_servicio) {
        const fecha = updateData.fecha_servicio || appointment.fecha_servicio;
        const horaEntrada = updateData.hora_entrada || appointment.hora_entrada;
        const horaSalida = updateData.hora_salida || appointment.hora_salida;
        const idServicio = updateData.id_servicio || appointment.id_servicio;

        const conflictos = await this.checkScheduleConflicts(
          fecha,
          horaEntrada,
          horaSalida,
          idServicio,
          id // Excluir la cita actual
        );

        if (conflictos.length > 0) {
          throw new Error('Existe un conflicto de horario para este servicio en la fecha y hora especificadas');
        }
      }

      await appointment.update(updateData);

      return await this.getAppointmentById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar una cita
   */
  static async deleteAppointment(id) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // Solo permitir eliminar citas en estado 'Agendada' o 'Cancelada por el cliente'
      if (!['Agendada', 'Cancelada por el cliente'].includes(appointment.estado)) {
        throw new Error('No se puede eliminar una cita que no esté en estado Agendada o Cancelada por el cliente');
      }

      await appointment.destroy();
      return { message: 'Cita eliminada correctamente' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar el estado de una cita
   */
  static async changeAppointmentStatus(id, newStatus, motivo = null) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Cita no encontrada');
      }

      // Validar transiciones de estado permitidas
      const validTransitions = {
        'Agendada': ['Confirmada', 'Reprogramada', 'Cancelada por el cliente'],
        'Confirmada': ['En proceso', 'Reprogramada', 'Cancelada por el cliente'],
        'Reprogramada': ['Confirmada', 'Cancelada por el cliente'],
        'En proceso': ['Finalizada', 'Cancelada por el cliente'],
        'Finalizada': ['Pagada'],
        'Pagada': [],
        'Cancelada por el cliente': [],
        'No asistio': []
      };

      const allowedTransitions = validTransitions[appointment.estado] || [];
      if (!allowedTransitions.includes(newStatus)) {
        throw new Error(`No se puede cambiar el estado de '${appointment.estado}' a '${newStatus}'`);
      }

      const updateData = { estado: newStatus };
      if (motivo) {
        updateData.motivo = motivo;
      }

      await appointment.update(updateData);

      return await this.getAppointmentById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar conflictos de horario
   */
  static async checkScheduleConflicts(fecha, horaEntrada, horaSalida, idServicio, excludeId = null) {
    try {
      const whereClause = {
        fecha_servicio: fecha,
        id_servicio: idServicio,
        estado: {
          [Op.notIn]: ['Cancelada por el cliente', 'No asistio']
        },
        [Op.or]: [
          {
            hora_entrada: {
              [Op.lt]: horaSalida
            },
            hora_salida: {
              [Op.gt]: horaEntrada
            }
          }
        ]
      };

      if (excludeId) {
        whereClause.id_servicio_cliente = {
          [Op.ne]: excludeId
        };
      }

      return await Appointment.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'correo', 'telefono']
          }
        ]
      });
    } catch (error) {
      throw error;
    }
  }



  /**
   * Obtener citas por usuario
   */
  static async getAppointmentsByUser(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Appointment.findAndCountAll({
        where: { id_usuario: userId },
        include: [
          {
            model: Services,
            as: 'servicio',
            attributes: ['id_servicio', 'nombre', 'descripcion', 'duracion', 'precio']
          }
        ],
        order: [['fecha_servicio', 'DESC'], ['hora_entrada', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        appointments: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener citas por servicio
   */
  static async getAppointmentsByService(serviceId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await Appointment.findAndCountAll({
        where: { id_servicio: serviceId },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'correo', 'telefono', 'estado', 'roleId']
          }
        ],
        order: [['fecha_servicio', 'ASC'], ['hora_entrada', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        appointments: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AppointmentService;
