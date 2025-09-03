const Scheduling = require('../models/Scheduling');

class SchedulingService {
  async createScheduling(data) {
    // 🔎 Validar usuario antes de crear la programación
    const user = await Usuario.findByPk(data.id_usuario);

    if (!user) {
      throw new Error("El usuario no existe.");
    }

    if (user.rol !== 'empleado') {
      throw new Error("El usuario no es un empleado.");
    }

    // ✅ Si pasa las validaciones, recién se crea
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
