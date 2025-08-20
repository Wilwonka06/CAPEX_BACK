const Services = require('../models/Services');
const { Op } = require('sequelize');

class ServicesService {
  async createService(serviceData) {
    try {
      return await Services.create(serviceData);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('A service with that name already exists');
      }
      throw error;
    }
  }

  async getAllServices() {
    return await Services.findAll({
      order: [['nombre', 'ASC']]
    });
  }

  async getServiceById(id_servicio) {
    return await Services.findByPk(id_servicio);
  }

  async getActiveServices() {
    return await Services.findAll({
      where: { estado: 'Activo' },
      order: [['nombre', 'ASC']]
    });
  }

  async getServicesByStatus(status) {
    return await Services.findAll({
      where: { estado: status },
      order: [['nombre', 'ASC']]
    });
  }

  async updateService(id_servicio, serviceData) {
    const service = await Services.findByPk(id_servicio);
    if (!service) {
      throw new Error('Service not found');
    }

    try {
      return await service.update(serviceData);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('A service with that name already exists');
      }
      throw error;
    }
  }

  async deleteService(id_servicio) {
    const service = await Services.findByPk(id_servicio);
    if (!service) {
      throw new Error('Service not found');
    }

    await service.destroy();
    return { message: 'Service deleted successfully' };
  }

  async searchServices(searchTerm) {
    return await Service.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${searchTerm}%` } },
          { descripcion: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      order: [['nombre', 'ASC']]
    });
  }

  async changeServiceStatus(id_servicio, newStatus) {
    const service = await Services.findByPk(id_servicio);
    if (!service) {
      throw new Error('Service not found');
    }

    await service.update({ estado: newStatus });
    return service;
  }

  async getServiceByName(nombre) {
    return await Services.findOne({
      where: { nombre }
    });
  }

  async checkServiceExists(id_servicio) {
    const service = await Services.findByPk(id_servicio);
    return service !== null;
  }
}

module.exports = new ServicesService();
