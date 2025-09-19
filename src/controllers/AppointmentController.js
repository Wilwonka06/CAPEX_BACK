const CitasService = require('../services/AppointmentService');

class AppointmentController {
  // Obtener todas las citas con paginación y filtros
  static async getAllAppointments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const filters = {};
      if (req.query.estado) filters.estado = req.query.estado;
      if (req.query.fecha_desde) filters.fecha_desde = req.query.fecha_desde;
      if (req.query.fecha_hasta) filters.fecha_hasta = req.query.fecha_hasta;
      if (req.query.id_usuario) filters.id_cliente = req.query.id_usuario; // Mantener foreignKey id_cliente para compatibilidad BD

      const result = await CitasService.getAllAppointments(page, limit, filters);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener cita por ID
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const result = await CitasService.getAppointmentById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener cita:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Crear nueva cita con servicios
  static async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      const result = await CitasService.createAppointment(appointmentData);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear cita:', error);
      
      if (error.message.includes('no encontrado') || error.message.includes('inactivo')) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          error: error.message
        });
      }

      if (error.message.includes('disponibilidad') || error.message.includes('conflicto')) {
        return res.status(409).json({
          success: false,
          message: 'Conflicto de disponibilidad',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar cita completa
  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointmentData = req.body;
      const result = await CitasService.updateAppointment(id, appointmentData);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      
      if (error.message.includes('no encontrada') || error.message.includes('finalizada')) {
        return res.status(400).json({
          success: false,
          message: 'No se puede modificar la cita',
          error: error.message
        });
      }

      if (error.message.includes('disponibilidad') || error.message.includes('conflicto')) {
        return res.status(409).json({
          success: false,
          message: 'Conflicto de disponibilidad',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Cancelar cita
  static async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const result = await CitasService.cancelAppointment(id, motivo);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Buscar citas por texto
  static async searchAppointments(req, res) {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro "query" es requerido'
        });
      }

      const result = await CitasService.searchAppointments(query, page, limit);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al buscar citas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Agregar servicio a cita existente
  static async addServiceToAppointment(req, res) {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const result = await CitasService.addServiceToAppointment(id, serviceData);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al agregar servicio:', error);
      
      if (error.message.includes('no encontrada') || error.message.includes('finalizada')) {
        return res.status(400).json({
          success: false,
          message: 'No se puede agregar servicios a esta cita',
          error: error.message
        });
      }

      if (error.message.includes('disponibilidad') || error.message.includes('conflicto')) {
        return res.status(409).json({
          success: false,
          message: 'Conflicto de disponibilidad',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Cancelar servicio específico
  static async cancelService(req, res) {
    try {
      const { id, detalle_id } = req.params;
      const result = await CitasService.cancelService(id, detalle_id);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al cancelar servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener servicio por ID
  static async getServiceById(req, res) {
    try {
      const { id, detalle_id } = req.params;
      const result = await CitasService.getServiceById(id, detalle_id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas de citas
  static async getAppointmentStats(req, res) {
    try {
      const { fecha_desde, fecha_hasta } = req.query;
      
      // Implementar lógica de estadísticas si es necesario
      const stats = {
        total_citas: 0,
        citas_agendadas: 0,
        citas_confirmadas: 0,
        citas_en_proceso: 0,
        citas_finalizadas: 0,
        citas_canceladas: 0,
        ingresos_totales: 0
      };

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener citas por empleado
  static async getAppointmentsByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Implementar lógica para obtener citas por empleado
      const result = {
        success: true,
        message: 'Citas del empleado obtenidas exitosamente',
        data: {
          citas: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        }
      };

      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener citas del empleado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener citas por usuario
  static async getAppointmentsByUser(req, res) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const filters = { id_cliente: userId }; // Mantener foreignKey id_cliente para compatibilidad BD
      const result = await CitasService.getAllAppointments(page, limit, filters);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener citas del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = AppointmentController;
