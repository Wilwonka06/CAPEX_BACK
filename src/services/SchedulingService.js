const Scheduling = require('../models/Scheduling');

class SchedulingService {
  async createScheduling(data) {
    return await Scheduling.create(data);
  }

  async getAll() {
    return await Scheduling.findAll();
  }

  async getById(id) {
    return await Scheduling.findByPk(id);
  }

  async updateScheduling(id, data) {
    const scheduling = await Scheduling.findByPk(id);
    if (!scheduling) return null;
    return await scheduling.update(data);
  }

  async deleteScheduling(id) {
    const scheduling = await Scheduling.findByPk(id);
    if (!scheduling) return null;
    await scheduling.destroy();
    return scheduling;
  }
}

module.exports = new SchedulingService();
