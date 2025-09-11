// src/controllers/SchedulingController.js
const SchedulingService = require('../services/SchedulingService');
const { Usuario } = require('../models/User');

class SchedulingController {
  async create(req, res) {
    try {
      const scheduling = await SchedulingService.createScheduling(req.body);
      res.status(201).json(scheduling);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const schedulings = await SchedulingService.getAll();
      res.json(schedulings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const scheduling = await SchedulingService.getById(req.params.id);
      if (!scheduling) return res.status(404).json({ message: 'Programación no encontrada' });
      res.json(scheduling);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByUser(req, res) {
    try {
      const { id_usuario } = req.params;

      // ✅ Validar si el usuario existe
      const usuario = await Usuario.findByPk(id_usuario);
      if (!usuario) {
        return res.status(404).json({ message: `El usuario con id ${id_usuario} no existe` });
      }

      const schedulings = await SchedulingService.getByUser(id_usuario);

      if (!schedulings || schedulings.length === 0) {
        return res.status(404).json({ message: 'No se encontraron programaciones para este usuario' });
      }

      res.json(schedulings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await SchedulingService.updateScheduling(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Programación no encontrada' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await SchedulingService.deleteScheduling(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Programación no encontrada' });
      res.json({ message: 'Programación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SchedulingController();
