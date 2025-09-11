const AppointmentService = require('../services/AppointmentService');

class AppointmentController {
  /**
   * Crear una nueva cita
   */
  static async createAppointment(req, res) {
    try {
      const appointmentData = {
        id_usuario: req.body.id_usuario,
        id_servicio: req.body.id_servicio,
        fecha_servicio: req.body.fecha_servicio,
        hora_entrada: req.body.hora_entrada,
        hora_salida: req.body.hora_salida,
        valor_total: req.body.valor_total,
        motivo: req.body.motivo
      };

      const appointment = await AppointmentService.createAppointment(appointmentData);

      res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente',
        data: appointment
      });
    } catch (error) {
      console.error('Error al crear cita:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear la cita'
      });
    }
  }

  /**
   * Obtener todas las citas con filtros opcionales
   */
  static async getAppointments(req, res) {
    try {
      const {
        usuario,
        servicio,
        estado,
        fecha_inicio,
        fecha_fin,
        page = 1,
        limit = 10
      } = req.query;

      const filters = {};
      if (usuario) filters.usuario = parseInt(usuario);
      if (servicio) filters.servicio = parseInt(servicio);
      if (estado) filters.estado = estado;
      if (fecha_inicio) filters.fecha_inicio = fecha_inicio;
      if (fecha_fin) filters.fecha_fin = fecha_fin;

      const result = await AppointmentService.getAppointments(filters, page, limit);

      res.status(200).json({
        success: true,
        message: 'Citas obtenidas exitosamente',
        data: result.appointments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error al obtener citas:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las citas'
      });
    }
  }

  /**
   * Obtener una cita por ID
   */
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentService.getAppointmentById(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Cita obtenida exitosamente',
        data: appointment
      });
    } catch (error) {
      console.error('Error al obtener cita:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Cita no encontrada'
      });
    }
  }

  /**
   * Actualizar una cita
   */
  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const appointment = await AppointmentService.updateAppointment(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Cita actualizada exitosamente',
        data: appointment
      });
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la cita'
      });
    }
  }

  /**
   * Eliminar una cita
   */
  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const result = await AppointmentService.deleteAppointment(parseInt(id));

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al eliminar la cita'
      });
    }
  }

  /**
   * Cambiar el estado de una cita
   */
  static async changeAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado, motivo } = req.body;

      const appointment = await AppointmentService.changeAppointmentStatus(
        parseInt(id),
        estado,
        motivo
      );

      res.status(200).json({
        success: true,
        message: 'Estado de cita actualizado exitosamente',
        data: appointment
      });
    } catch (error) {
      console.error('Error al cambiar estado de cita:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al cambiar el estado de la cita'
      });
    }
  }



  /**
   * Obtener citas por usuario
   */
  static async getAppointmentsByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await AppointmentService.getAppointmentsByUser(
        parseInt(userId),
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: 'Citas del usuario obtenidas exitosamente',
        data: result.appointments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error al obtener citas del usuario:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las citas del usuario'
      });
    }
  }

  /**
   * Obtener citas por servicio
   */
  static async getAppointmentsByService(req, res) {
    try {
      const { serviceId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await AppointmentService.getAppointmentsByService(
        parseInt(serviceId),
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: 'Citas del servicio obtenidas exitosamente',
        data: result.appointments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error al obtener citas del servicio:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener las citas del servicio'
      });
    }
  }

  /**
   * Verificar conflictos de horario
   */
  static async checkScheduleConflicts(req, res) {
    try {
      const { fecha, hora_entrada, hora_salida, id_servicio } = req.query;

      if (!fecha || !hora_entrada || !hora_salida || !id_servicio) {
        return res.status(400).json({
          success: false,
          message: 'Todos los parámetros son requeridos: fecha, hora_entrada, hora_salida, id_servicio'
        });
      }

      const conflictos = await AppointmentService.checkScheduleConflicts(
        fecha,
        hora_entrada,
        hora_salida,
        parseInt(id_servicio)
      );

      res.status(200).json({
        success: true,
        message: 'Verificación de conflictos completada',
        data: {
          tieneConflictos: conflictos.length > 0,
          conflictos: conflictos
        }
      });
    } catch (error) {
      console.error('Error al verificar conflictos:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al verificar conflictos de horario'
      });
    }
  }
}

module.exports = AppointmentController;
