const ServiceDetailService = require('../../services/serviceDetails/ServiceDetailService');

class ServiceDetailController {
  // Obtener todos los detalles de servicios
  static async getAllServiceDetails(req, res) {
    try {
      const result = await ServiceDetailService.getAllServiceDetails();
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalle de servicio por ID
  static async getServiceDetailById(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.getServiceDetailById(id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Crear nuevo detalle de servicio
  static async createServiceDetail(req, res) {
    try {
      const result = await ServiceDetailService.createServiceDetail(req.body);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar detalle de servicio
  static async updateServiceDetail(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.updateServiceDetail(id, req.body);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar detalle de servicio
  static async deleteServiceDetail(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.deleteServiceDetail(id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Cambiar estado del detalle de servicio
  static async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const result = await ServiceDetailService.changeStatus(id, estado);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles por servicio cliente (organizados)
  static async getByServiceClient(req, res) {
    try {
      const { serviceClientId } = req.params;
      const result = await ServiceDetailService.getByServiceClient(serviceClientId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles organizados por servicios y productos
  static async getDetailsOrganized(req, res) {
    try {
      const { serviceClientId } = req.params;
      const result = await ServiceDetailService.getDetailsOrganized(serviceClientId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Anular servicio o producto específico del detalle (NO ELIMINAR)
  static async removeServiceOrProduct(req, res) {
    try {
      const { id } = req.params;
      const { serviceId, productId } = req.body;
      
      const result = await ServiceDetailService.removeServiceOrProduct(id, serviceId, productId);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Agregar nuevo servicio o producto al detalle existente
  static async addServiceOrProduct(req, res) {
    try {
      const { serviceClientId } = req.params;
      const serviceData = req.body;
      
      const result = await ServiceDetailService.addServiceOrProduct(serviceClientId, serviceData);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles del servicio cliente con conteo
  static async getServiceClientDetailsWithCount(req, res) {
    try {
      const { serviceClientId } = req.params;
      const result = await ServiceDetailService.getServiceClientDetailsWithCount(serviceClientId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles por producto
  static async getByProduct(req, res) {
    try {
      const { productId } = req.params;
      const result = await ServiceDetailService.getByProduct(productId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles por servicio
  static async getByService(req, res) {
    try {
      const { serviceId } = req.params;
      const result = await ServiceDetailService.getByService(serviceId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles por empleado
  static async getByEmployee(req, res) {
    try {
      const { empleadoId } = req.params;
      const result = await ServiceDetailService.getByEmployee(empleadoId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles por estado
  static async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const result = await ServiceDetailService.getByStatus(status);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Calcular subtotal
  static async calculateSubtotal(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.calculateSubtotal(id);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas
  static async getStatistics(req, res) {
    try {
      const result = await ServiceDetailService.getStatistics();
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = ServiceDetailController;
