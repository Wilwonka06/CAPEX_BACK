const ServiceDetailService = require('../../services/serviceDetails/ServiceDetailService');

class ServiceDetailController {
  // Get all service details
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

  // Get service detail by ID
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

  // Create new service detail
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

  // Update service detail
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

  // Delete service detail
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

  // Update service detail status
  static async updateServiceDetailStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await ServiceDetailService.updateServiceDetailStatus(id, status);
      
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

  // Get service details by status
  static async getServiceDetailsByStatus(req, res) {
    try {
      const { status } = req.params;
      const result = await ServiceDetailService.getServiceDetailsByStatus(status);
      
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

  // Get order of service
  static async getOrderOfService(req, res) {
    try {
      const result = await ServiceDetailService.getOrderOfService();
      
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

  // Start service
  static async startService(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.startService(id);
      
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

  // Complete service
  static async completeService(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.completeService(id);
      
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

  // Get scheduled services
  static async getScheduledServices(req, res) {
    try {
      const result = await ServiceDetailService.getScheduledServices();
      
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

  // Confirm scheduled service
  static async confirmScheduledService(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.confirmScheduledService(id);
      
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

  // Reschedule service
  static async rescheduleService(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.rescheduleService(id);
      
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

  // Get service details for sales
  static async getServiceDetailsForSales(req, res) {
    try {
      const result = await ServiceDetailService.getServiceDetailsForSales();
      
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

  // Convert to sale
  static async convertToSale(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.convertToSale(id);
      
      if (!result.success) {
        const statusCode = result.error === 'ALREADY_PAID' || result.error === 'INVALID_STATUS' ? 400 : 404;
        return res.status(statusCode).json(result);
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

  // Cancel by user
  static async cancelByUser(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.cancelByUser(id);
      
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

  // Mark as no show
  static async markAsNoShow(req, res) {
    try {
      const { id } = req.params;
      const result = await ServiceDetailService.markAsNoShow(id);
      
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

  // Get service details by employee
  static async getServiceDetailsByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const result = await ServiceDetailService.getServiceDetailsByEmployee(employeeId);
      
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

  // Get service details by date range
  static async getServiceDetailsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.body;
      const result = await ServiceDetailService.getServiceDetailsByDateRange(startDate, endDate);
      
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

  // Get service detail stats
  static async getServiceDetailStats(req, res) {
    try {
      const result = await ServiceDetailService.getServiceDetailStats();
      
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
