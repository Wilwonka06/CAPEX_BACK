const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class ServiceDetailController {
  // Obtener todos los detalles de servicio
  static async getAllServiceDetails(req, res) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        order: [['createdAt', 'DESC']]
      });
      return ResponseMiddleware.success(res, 'Detalles de servicio obtenidos exitosamente', serviceDetails);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener detalles de servicio', error);
    }
  }

  // Obtener detalle de servicio por ID
  static async getServiceDetailById(req, res) {
    try {
      const { id } = req.params;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Detalle de servicio obtenido exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener detalle de servicio', error);
    }
  }

  // Crear nuevo detalle de servicio
  static async createServiceDetail(req, res) {
    try {
      const serviceDetailData = req.body;
      const newServiceDetail = await ServiceDetail.create(serviceDetailData);
      return ResponseMiddleware.success(res, 'Detalle de servicio creado exitosamente', newServiceDetail, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear detalle de servicio', error);
    }
  }

  // Actualizar detalle de servicio
  static async updateServiceDetail(req, res) {
    try {
      const { id } = req.params;
      const serviceDetailData = req.body;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.update(serviceDetailData);
      return ResponseMiddleware.success(res, 'Detalle de servicio actualizado exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar detalle de servicio', error);
    }
  }

  // Eliminar detalle de servicio
  static async deleteServiceDetail(req, res) {
    try {
      const { id } = req.params;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.destroy();
      return ResponseMiddleware.success(res, 'Detalle de servicio eliminado exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar detalle de servicio', error);
    }
  }

  // Cambiar estado del detalle de servicio
  static async changeServiceDetailStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.update({ status });
      return ResponseMiddleware.success(res, 'Estado del detalle de servicio actualizado exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al cambiar estado del detalle de servicio', error);
    }
  }

  // Obtener detalles de servicio por cliente
  static async getServiceDetailsByClient(req, res) {
    try {
      const { clientId } = req.params;
      const serviceDetails = await ServiceDetail.findAll({
        where: { clientId },
        order: [['createdAt', 'DESC']]
      });
      return ResponseMiddleware.success(res, 'Detalles de servicio del cliente obtenidos exitosamente', serviceDetails);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener detalles de servicio del cliente', error);
    }
  }

  // Obtener detalles de servicio por empleado
  static async getServiceDetailsByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const serviceDetails = await ServiceDetail.findAll({
        where: { employeeId },
        order: [['createdAt', 'DESC']]
      });
      return ResponseMiddleware.success(res, 'Detalles de servicio del empleado obtenidos exitosamente', serviceDetails);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener detalles de servicio del empleado', error);
    }
  }

  // Iniciar servicio
  static async startService(req, res) {
    try {
      const { id } = req.params;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.update({ 
        status: 'en_progreso',
        startTime: new Date()
      });
      return ResponseMiddleware.success(res, 'Servicio iniciado exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al iniciar servicio', error);
    }
  }

  // Completar servicio
  static async completeService(req, res) {
    try {
      const { id } = req.params;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.update({ 
        status: 'completado',
        endTime: new Date()
      });
      return ResponseMiddleware.success(res, 'Servicio completado exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al completar servicio', error);
    }
  }

  // Obtener servicios programados
  static async getScheduledServices(req, res) {
    try {
      const scheduledServices = await ServiceDetail.findAll({
        where: { status: 'programado' },
        order: [['scheduledDate', 'ASC']]
      });
      return ResponseMiddleware.success(res, 'Servicios programados obtenidos exitosamente', scheduledServices);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener servicios programados', error);
    }
  }

  // Confirmar servicio programado
  static async confirmScheduledService(req, res) {
    try {
      const { id } = req.params;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.update({ status: 'confirmado' });
      return ResponseMiddleware.success(res, 'Servicio programado confirmado exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al confirmar servicio programado', error);
    }
  }

  // Reprogramar servicio
  static async rescheduleService(req, res) {
    try {
      const { id } = req.params;
      const { scheduledDate } = req.body;
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return ResponseMiddleware.error(res, 'Detalle de servicio no encontrado', null, 404);
      }
      
      await serviceDetail.update({ 
        scheduledDate,
        status: 'programado'
      });
      return ResponseMiddleware.success(res, 'Servicio reprogramado exitosamente', serviceDetail);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al reprogramar servicio', error);
    }
  }

  // Obtener detalles de servicio para ventas
  static async getServiceDetailsForSales(req, res) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { 
          status: ['completado', 'pagado']
        },
        order: [['createdAt', 'DESC']]
      });
      return ResponseMiddleware.success(res, 'Detalles de servicio para ventas obtenidos exitosamente', serviceDetails);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener detalles de servicio para ventas', error);
    }
  }
}

module.exports = ServiceDetailController;
