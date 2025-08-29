const Scheduling = require('../models/Scheduling');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class SchedulingController {
  // Obtener todas las programaciones
  static async getAllSchedules(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Scheduling.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['scheduledDate', 'ASC']]
      });

      return ResponseMiddleware.success(res, 'Programaciones obtenidas exitosamente', {
        schedules: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener programaciones', error);
    }
  }

  // Obtener programación por ID
  static async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await Scheduling.findByPk(id);
      
      if (!schedule) {
        return ResponseMiddleware.error(res, 'Programación no encontrada', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Programación obtenida exitosamente', schedule);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener programación', error);
    }
  }

  // Crear nueva programación
  static async createSchedule(req, res) {
    try {
      const scheduleData = req.body;
      const newSchedule = await Scheduling.create(scheduleData);
      return ResponseMiddleware.success(res, 'Programación creada exitosamente', newSchedule, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear programación', error);
    }
  }

  // Crear múltiples programaciones
  static async createMultipleSchedules(req, res) {
    try {
      const { schedules } = req.body;
      
      if (!Array.isArray(schedules) || schedules.length === 0) {
        return ResponseMiddleware.error(res, 'Se requiere un array de programaciones', null, 400);
      }
      
      const newSchedules = await Scheduling.bulkCreate(schedules);
      return ResponseMiddleware.success(res, 'Programaciones creadas exitosamente', newSchedules, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear programaciones', error);
    }
  }

  // Actualizar programación
  static async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const scheduleData = req.body;
      const schedule = await Scheduling.findByPk(id);
      
      if (!schedule) {
        return ResponseMiddleware.error(res, 'Programación no encontrada', null, 404);
      }
      
      await schedule.update(scheduleData);
      return ResponseMiddleware.success(res, 'Programación actualizada exitosamente', schedule);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar programación', error);
    }
  }

  // Eliminar programación
  static async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      const schedule = await Scheduling.findByPk(id);
      
      if (!schedule) {
        return ResponseMiddleware.error(res, 'Programación no encontrada', null, 404);
      }
      
      await schedule.destroy();
      return ResponseMiddleware.success(res, 'Programación eliminada exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar programación', error);
    }
  }

  // Obtener programaciones por empleado
  static async getSchedulesByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Scheduling.findAndCountAll({
        where: { employeeId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['scheduledDate', 'ASC']]
      });

      return ResponseMiddleware.success(res, 'Programaciones del empleado obtenidas exitosamente', {
        schedules: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener programaciones del empleado', error);
    }
  }

  // Verificar conflicto de programación
  static async checkScheduleConflict(req, res) {
    try {
      const { employeeId, scheduledDate, startTime, endTime } = req.body;
      
      if (!employeeId || !scheduledDate) {
        return ResponseMiddleware.error(res, 'Se requiere employeeId y scheduledDate', null, 400);
      }
      
      const whereClause = {
        employeeId,
        scheduledDate: new Date(scheduledDate)
      };
      
      // Si se proporcionan horarios específicos, verificar conflictos de tiempo
      if (startTime && endTime) {
        whereClause.startTime = { [require('sequelize').Op.lt]: endTime };
        whereClause.endTime = { [require('sequelize').Op.gt]: startTime };
      }
      
      const conflictingSchedules = await Scheduling.findAll({ where: whereClause });
      
      return ResponseMiddleware.success(res, 'Verificación de conflicto completada', {
        hasConflict: conflictingSchedules.length > 0,
        conflictingSchedules: conflictingSchedules
      });
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar conflicto de programación', error);
    }
  }
}

module.exports = SchedulingController;
