const Service = require('../models/Service');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class ServiceController {
  // Obtener todos los servicios
  static async getAllServices(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Service.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Servicios obtenidos exitosamente', {
        services: rows,
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
      return ResponseMiddleware.error(res, 'Error al obtener servicios', error);
    }
  }

  // Obtener servicio por ID
  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findByPk(id);
      
      if (!service) {
        return ResponseMiddleware.error(res, 'Servicio no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Servicio obtenido exitosamente', service);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener servicio', error);
    }
  }

  // Crear nuevo servicio
  static async createService(req, res) {
    try {
      const serviceData = req.body;
      const newService = await Service.create(serviceData);
      return ResponseMiddleware.success(res, 'Servicio creado exitosamente', newService, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear servicio', error);
    }
  }

  // Actualizar servicio
  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const service = await Service.findByPk(id);
      
      if (!service) {
        return ResponseMiddleware.error(res, 'Servicio no encontrado', null, 404);
      }
      
      await service.update(serviceData);
      return ResponseMiddleware.success(res, 'Servicio actualizado exitosamente', service);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar servicio', error);
    }
  }

  // Eliminar servicio
  static async deleteService(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findByPk(id);
      
      if (!service) {
        return ResponseMiddleware.error(res, 'Servicio no encontrado', null, 404);
      }
      
      await service.destroy();
      return ResponseMiddleware.success(res, 'Servicio eliminado exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar servicio', error);
    }
  }

  // Obtener servicios por categoría
  static async getServicesByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Service.findAndCountAll({
        where: { categoryId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Servicios de la categoría obtenidos exitosamente', {
        services: rows,
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
      return ResponseMiddleware.error(res, 'Error al obtener servicios de la categoría', error);
    }
  }
}

module.exports = ServiceController;
