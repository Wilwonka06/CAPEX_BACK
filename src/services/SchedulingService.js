// src/services/SchedulingService.js
const Scheduling = require('../models/Scheduling');
const { Usuario } = require('../models/User');

class SchedulingService {
  async createScheduling(data) {
    return await Scheduling.create(data);
  }

  async getAll() {
    return await Scheduling.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo']
        }
      ]
    });
  }

  async getById(id) {
    return await Scheduling.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo']
        }
      ]
    });
  }

  async getByUser(id_usuario) {
    return await Scheduling.findAll({
      where: { id_usuario },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id_usuario', 'nombre', 'correo']
        }
      ]
    });
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
