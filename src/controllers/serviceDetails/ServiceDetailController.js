const ServiceDetailService = require('../../services/serviceDetails/ServiceDetailService');

class ServiceDetailController {
  // Obtener todos los detalles de servicios
  static async getAllServiceDetails(req, res) {
    try {
      const result = await ServiceDetailService.getAllServiceDetails();
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      const serviceDetailData = req.body;
      const result = await ServiceDetailService.createServiceDetail(serviceDetailData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      res.status(201).json(result);
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
      const serviceDetailData = req.body;
      const result = await ServiceDetailService.updateServiceDetail(id, serviceDetailData);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener detalles por servicio cliente
  static async getByServiceClient(req, res) {
    try {
      const { serviceClientId } = req.params;
      const result = await ServiceDetailService.getByServiceClient(serviceClientId);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      const { employeeId } = req.params;
      const result = await ServiceDetailService.getByEmployee(employeeId);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Calcular precio total
  static async calculateTotalPrice(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.calculateTotalPrice(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
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
