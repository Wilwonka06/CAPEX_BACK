const ServiceDetail = require('../../models/serviceDetails/ServiceDetail');
const { sequelize } = require('../../config/database');

class ServiceDetailService {
  // Get all service details
  static async getAllServiceDetails() {
    try {
      const serviceDetails = await ServiceDetail.findAll();
      return {
        success: true,
        message: 'Service details obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details: ${error.message}`);
    }
  }

  // Get service detail by ID
  static async getServiceDetailById(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      return {
        success: true,
        message: 'Service detail obtained successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error getting service detail: ${error.message}`);
    }
  }

  // Create service detail
  static async createServiceDetail(serviceDetailData) {
    try {
      const newServiceDetail = await ServiceDetail.create(serviceDetailData);
      return {
        success: true,
        message: 'Service detail created successfully',
        data: newServiceDetail
      };
    } catch (error) {
      throw new Error(`Error creating service detail: ${error.message}`);
    }
  }

  // Update service detail
  static async updateServiceDetail(id, serviceDetailData) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      await serviceDetail.update(serviceDetailData);
      
      return {
        success: true,
        message: 'Service detail updated successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error updating service detail: ${error.message}`);
    }
  }

  // Delete service detail
  static async deleteServiceDetail(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      await serviceDetail.destroy();
      
      return {
        success: true,
        message: 'Service detail deleted successfully'
      };
    } catch (error) {
      throw new Error(`Error deleting service detail: ${error.message}`);
    }
  }

  // Update service detail status
  static async updateServiceDetailStatus(id, status) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = status;
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Service detail status updated successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error updating service detail status: ${error.message}`);
    }
  }

  // Get service details by status
  static async getServiceDetailsByStatus(status) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status }
      });
      
      return {
        success: true,
        message: 'Service details obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details by status: ${error.message}`);
    }
  }

  // Get order of service (services in "En proceso" status)
  static async getOrderOfService() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status: 'En proceso' }
      });
      
      return {
        success: true,
        message: 'Order of service obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting order of service: ${error.message}`);
    }
  }

  // Start service (change status to "En proceso")
  static async startService(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = 'En proceso';
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Service started successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error starting service: ${error.message}`);
    }
  }

  // Complete service (change status to "Finalizada")
  static async completeService(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = 'Finalizada';
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Service completed successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error completing service: ${error.message}`);
    }
  }

  // Get scheduled services
  static async getScheduledServices() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status: 'Agendada' }
      });
      
      return {
        success: true,
        message: 'Scheduled services obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting scheduled services: ${error.message}`);
    }
  }

  // Confirm scheduled service
  static async confirmScheduledService(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = 'Confirmada';
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Scheduled service confirmed successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error confirming scheduled service: ${error.message}`);
    }
  }

  // Reschedule service
  static async rescheduleService(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = 'Reprogramada';
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Service rescheduled successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error rescheduling service: ${error.message}`);
    }
  }

  // Get service details for sales
  static async getServiceDetailsForSales() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status: 'Finalizada' }
      });
      
      return {
        success: true,
        message: 'Service details for sales obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details for sales: ${error.message}`);
    }
  }

  // Convert service detail to sale (change status to "Pagada")
  static async convertToSale(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      // Check if already paid
      if (serviceDetail.status === 'Pagada') {
        return {
          success: false,
          message: 'Service detail is already paid and cannot be converted again',
          error: 'ALREADY_PAID'
        };
      }

      // Only allow conversion from "En proceso" status
      if (serviceDetail.status !== 'En proceso') {
        return {
          success: false,
          message: `Service detail must be in "En proceso" status to convert to sale. Current status: ${serviceDetail.status}`,
          error: 'INVALID_STATUS'
        };
      }

      serviceDetail.status = 'Pagada';
      await serviceDetail.save();
      
      const updatedServiceDetail = await this.getServiceDetailById(id);
      
      return {
        success: true,
        message: 'Service detail converted to sale successfully. This service is now locked and cannot be modified.',
        data: updatedServiceDetail.data
      };
    } catch (error) {
      throw new Error(`Error converting service detail to sale: ${error.message}`);
    }
  }

  // Cancel by user
  static async cancelByUser(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = 'Cancelada por el usuario';
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Service cancelled by user successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error cancelling service by user: ${error.message}`);
    }
  }

  // Mark as no show
  static async markAsNoShow(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      
      if (!serviceDetail) {
        return {
          success: false,
          message: 'Service detail not found'
        };
      }

      serviceDetail.status = 'No asistio';
      await serviceDetail.save();
      
      return {
        success: true,
        message: 'Service marked as no show successfully',
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error marking service as no show: ${error.message}`);
    }
  }

  // Get service details by employee
  static async getServiceDetailsByEmployee(employeeId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { id_employee: employeeId }
      });
      
      return {
        success: true,
        message: 'Service details by employee obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details by employee: ${error.message}`);
    }
  }

  // Get service details by date range
  static async getServiceDetailsByDateRange(startDate, endDate) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: {
          created_at: {
            [sequelize.Op.between]: [startDate, endDate]
          }
        }
      });
      
      return {
        success: true,
        message: 'Service details by date range obtained successfully',
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details by date range: ${error.message}`);
    }
  }

  // Get service detail stats
  static async getServiceDetailStats() {
    try {
      const stats = await ServiceDetail.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      });
      
      return {
        success: true,
        message: 'Service detail stats obtained successfully',
        data: stats
      };
    } catch (error) {
      throw new Error(`Error getting service detail stats: ${error.message}`);
    }
  }
}

module.exports = ServiceDetailService;
