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

  // Búsqueda avanzada con filtros
async searchServices(filters) {
  const { nombre, estado, precio, duracion, id_categoria_servicio } = filters;
  let where = {};

  if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
  if (estado) where.estado = estado;

  if (precio) {
    if (precio.includes('-')) {
      const [min, max] = precio.split('-').map(Number);
      where.precio = { [Op.between]: [min, max] };
    } else {
      where.precio = Number(precio);
    }
  }

  if (duracion) {
    if (duracion.includes('-')) {
      const [min, max] = duracion.split('-').map(Number);
      where.duracion = { [Op.between]: [min, max] };
    } else {
      where.duracion = Number(duracion);
    }
  }

  if (id_categoria_servicio) where.id_categoria_servicio = id_categoria_servicio;

  return await Services.findAll({ where, order: [['nombre', 'ASC']] });
}

// Búsqueda rápida por texto libre
// async searchByTerm(searchTerm) {
//   return await Services.findAll({
//     where: {
//       [Op.or]: [
//         { nombre: { [Op.like]: `%${searchTerm}%` } },
//         { descripcion: { [Op.like]: `%${searchTerm}%` } }
//       ]
//     },
//     order: [['nombre', 'ASC']]
//   });
// }


  async deleteService(id_servicio) {
    const service = await Services.findByPk(id_servicio);
    if (!service) {
      throw new Error('Service not found');
    }

    await service.destroy();
    return { message: 'Service deleted successfully' };
  }

  // async searchServices(searchTerm) {
  //   return await Service.findAll({
  //     where: {
  //       [Op.or]: [
  //         { nombre: { [Op.like]: `%${searchTerm}%` } },
  //         { descripcion: { [Op.like]: `%${searchTerm}%` } }
  //       ]
  //     },
  //     order: [['nombre', 'ASC']]
  //   });
  // }

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