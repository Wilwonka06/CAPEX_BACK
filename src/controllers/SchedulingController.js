// src/controllers/SchedulingController.js
const schedulingService = require('../services/SchedulingService');

class SchedulingController {
  // Crear programación individual
  async create(req, res) {
    try {
      const scheduling = await schedulingService.createScheduling(req.body);
      res.status(201).json({
        success: true,
        data: scheduling,
        message: 'Programación creada correctamente'
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Crear múltiples programaciones
  async createMultiple(req, res) {
    try {
      const schedulings = await schedulingService.createMultipleSchedulings(req.body);
      res.status(201).json({
        success: true,
        data: schedulings,
        message: `${schedulings.length} programaciones creadas correctamente`
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async getAll(req, res) {
    try {
      const schedulings = await schedulingService.getAll();
      res.json({
        success: true,
        data: schedulings,
        count: schedulings.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async getById(req, res) {
    try {
      const scheduling = await schedulingService.getById(req.params.id);
      if (!scheduling) {
        return res.status(404).json({ 
          success: false,
          error: 'Programación no encontrada' 
        });
      }
      res.json({
        success: true,
        data: scheduling
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async getByEmployee(req, res) {
    try {
      const schedulings = await schedulingService.getByEmployee(req.params.employeeId);
      res.json({
        success: true,
        data: schedulings,
        count: schedulings.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async update(req, res) {
    try {
      const updated = await schedulingService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: updated,
        message: 'Programación actualizada correctamente'
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await schedulingService.delete(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Verificar conflictos de horarios
  async checkConflicts(req, res) {
    try {
      const { employeeId, fecha_inicio, hora_entrada, hora_salida, excludeId } = req.body;
      const hasConflicts = await schedulingService.checkConflicts(
        employeeId, 
        fecha_inicio, 
        hora_entrada, 
        hora_salida, 
        excludeId
      );
      
      res.json({
        success: true,
        hasConflicts,
        message: hasConflicts ? 'Existen conflictos de horarios' : 'No hay conflictos de horarios'
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  }
}

module.exports = new SchedulingController();
