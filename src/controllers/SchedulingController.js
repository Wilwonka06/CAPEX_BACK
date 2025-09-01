const SchedulingService = require('../services/SchedulingService');

class SchedulingController {
  async create(req, res) {
    try {
      const scheduling = await SchedulingService.createScheduling(req.body);
      res.status(201).json(scheduling);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
      if (!scheduling) return res.status(404).json({ message: 'No encontrado' });
      res.json(scheduling);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const scheduling = await SchedulingService.updateScheduling(req.params.id, req.body);
      if (!scheduling) return res.status(404).json({ message: 'No encontrado' });
      res.json(scheduling);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const scheduling = await SchedulingService.deleteScheduling(req.params.id);
      if (!scheduling) return res.status(404).json({ message: 'No encontrado' });
      res.json({ message: 'Programación eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SchedulingController();
