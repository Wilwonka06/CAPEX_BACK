// src/services/SchedulingService.js
const Scheduling = require('../models/Scheduling');
const { Op } = require('sequelize');

class SchedulingService {
  // Crear una programación individual
  async createScheduling(data) {
    try {
      return await Scheduling.create(data);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una programación para este empleado en la fecha y hora especificada');
      }
      throw error;
    }
  }

  // Crear múltiples programaciones (para rangos de fechas)
  async createMultipleSchedulings({ startDate, endDate, selectedDays, startTime, endTime, employeeId }) {
    const records = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // getDay() para días de semana (0=Dom, 6=Sáb)
      if (selectedDays.includes(d.getDay())) {
        records.push({
          fecha_inicio: d.toISOString().split('T')[0],
          hora_entrada: startTime,
          hora_salida: endTime,
          id_empleado: employeeId
        });
      }
    }

    try {
      return await Scheduling.bulkCreate(records, {
        ignoreDuplicates: true,
        validate: true
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Algunas programaciones ya existen para las fechas especificadas');
      }
      throw error;
    }
  }

  async getAll() {
    return await Scheduling.findAll({
      order: [['fecha_inicio', 'ASC'], ['hora_entrada', 'ASC']]
    });
  }

  async getById(id_programacion) {
    return await Scheduling.findByPk(id_programacion);
  }

  async getByEmployee(employeeId) {
    return await Scheduling.findAll({
      where: { id_empleado: employeeId },
      order: [['fecha_inicio', 'ASC'], ['hora_entrada', 'ASC']]
    });
  }

  async update(id_programacion, data) {
    const scheduling = await Scheduling.findByPk(id_programacion);
    if (!scheduling) throw new Error('Programación no encontrada');
    
    try {
      return await scheduling.update(data);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una programación para este empleado en la fecha y hora especificada');
      }
      throw error;
    }
  }

  async delete(id_programacion) {
    const scheduling = await Scheduling.findByPk(id_programacion);
    if (!scheduling) throw new Error('Programación no encontrada');
    await scheduling.destroy();
    return { message: 'Programación eliminada correctamente' };
  }

  // Verificar conflictos de horarios
  async checkConflicts(employeeId, fecha_inicio, hora_entrada, hora_salida, excludeId = null) {
    const whereClause = {
      id_empleado: employeeId,
      fecha_inicio: fecha_inicio,
      [Op.or]: [
        {
          hora_entrada: {
            [Op.between]: [hora_entrada, hora_salida]
          }
        },
        {
          hora_salida: {
            [Op.between]: [hora_entrada, hora_salida]
          }
        },
        {
          [Op.and]: [
            { hora_entrada: { [Op.lte]: hora_entrada } },
            { hora_salida: { [Op.gte]: hora_salida } }
          ]
        }
      ]
    };

    if (excludeId) {
      whereClause.id_programacion = { [Op.ne]: excludeId };
    }

    const conflicts = await Scheduling.findAll({ where: whereClause });
    return conflicts.length > 0;
  }
}

module.exports = new SchedulingService();
