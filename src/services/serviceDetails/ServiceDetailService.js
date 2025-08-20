const { ServiceDetail, Employee, Service, ServiceClient, Client } = require('../../models/serviceDetails/Associations');
const { Op } = require('sequelize');

class ServiceDetailService {
  // Get all service details with related information
  static async getAllServiceDetails() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id_employee', 'name', 'email', 'phone', 'position', 'status']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id_service', 'name', 'description', 'base_price', 'duration_minutes', 'category']
          },
          {
            model: ServiceClient,
            as: 'serviceClient',
            include: [{
              model: Client,
              as: 'client',
              include: [{
                model: require('../../models/clients/Associations').User,
                as: 'user',
                attributes: ['id_user', 'name', 'email', 'phone']
              }]
            }]
          }
        ],
        order: [['id_service_detail', 'DESC']]
      });

      return {
        success: true,
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details: ${error.message}`);
    }
  }

  // Get service detail by ID with related information
  static async getServiceDetailById(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id_employee', 'name', 'email', 'phone', 'position', 'status']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id_service', 'name', 'description', 'base_price', 'duration_minutes', 'category']
          },
          {
            model: ServiceClient,
            as: 'serviceClient',
            include: [{
              model: Client,
              as: 'client',
              include: [{
                model: require('../../models/clients/Associations').User,
                as: 'user',
                attributes: ['id_user', 'name', 'email', 'phone']
              }]
            }]
          }
        ]
      });

      if (!serviceDetail) {
        throw new Error('Service detail not found');
      }

      return {
        success: true,
        data: serviceDetail
      };
    } catch (error) {
      throw new Error(`Error getting service detail: ${error.message}`);
    }
  }

  // Create new service detail
  static async createServiceDetail(serviceDetailData) {
    try {
      const {
        id_employee,
        id_service,
        id_service_client,
        unit_price,
        quantity,
        start_time,
        end_time,
        duration,
        status
      } = serviceDetailData;

      // Validate related entities exist
      const employee = await Employee.findByPk(id_employee);
      if (!employee) {
        throw new Error('Employee not found');
      }

      const service = await Service.findByPk(id_service);
      if (!service) {
        throw new Error('Service not found');
      }

      const serviceClient = await ServiceClient.findByPk(id_service_client);
      if (!serviceClient) {
        throw new Error('Service client not found');
      }

      // Create service detail
      const newServiceDetail = await ServiceDetail.create({
        id_employee,
        id_service,
        id_service_client,
        unit_price,
        quantity,
        start_time,
        end_time,
        duration,
        status: status || 'Agendada'
      });

      // Get created service detail with related information
      const serviceDetailWithRelations = await this.getServiceDetailById(newServiceDetail.id_service_detail);

      return {
        success: true,
        message: 'Service detail created successfully',
        data: serviceDetailWithRelations.data
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
        throw new Error('Service detail not found');
      }

      // Update fields if provided
      const fieldsToUpdate = [
        'id_employee', 'id_service', 'id_service_client', 'unit_price',
        'quantity', 'start_time', 'end_time', 'duration', 'status'
      ];

      for (const field of fieldsToUpdate) {
        if (serviceDetailData[field] !== undefined) {
          serviceDetail[field] = serviceDetailData[field];
        }
      }

      await serviceDetail.save();

      // Get updated service detail with related information
      const updatedServiceDetail = await this.getServiceDetailById(id);

      return {
        success: true,
        message: 'Service detail updated successfully',
        data: updatedServiceDetail.data
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
        throw new Error('Service detail not found');
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
  static async updateServiceDetailStatus(id, newStatus) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      if (!serviceDetail) {
        throw new Error('Service detail not found');
      }

      const validStatuses = [
        'Agendada', 'Confirmada', 'Reprogramada', 'En proceso',
        'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio'
      ];

      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status');
      }

      serviceDetail.status = newStatus;
      await serviceDetail.save();

      // Get updated service detail with related information
      const updatedServiceDetail = await this.getServiceDetailById(id);

      return {
        success: true,
        message: 'Service detail status updated successfully',
        data: updatedServiceDetail.data
      };
    } catch (error) {
      throw new Error(`Error updating service detail status: ${error.message}`);
    }
  }

  // Get service details by status
  static async getServiceDetailsByStatus(status) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status },
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id_employee', 'name', 'email', 'phone', 'position']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id_service', 'name', 'base_price', 'duration_minutes']
          },
          {
            model: ServiceClient,
            as: 'serviceClient',
            include: [{
              model: Client,
              as: 'client',
              include: [{
                model: require('../../models/clients/Associations').User,
                as: 'user',
                attributes: ['id_user', 'name', 'email']
              }]
            }]
          }
        ],
        order: [['start_time', 'ASC']]
      });

      return {
        success: true,
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details by status: ${error.message}`);
    }
  }

  // Get service details by employee
  static async getServiceDetailsByEmployee(employeeId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { id_employee: employeeId },
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id_employee', 'name', 'email', 'phone', 'position']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id_service', 'name', 'base_price', 'duration_minutes']
          },
          {
            model: ServiceClient,
            as: 'serviceClient',
            include: [{
              model: Client,
              as: 'client',
              include: [{
                model: require('../../models/clients/Associations').User,
                as: 'user',
                attributes: ['id_user', 'name', 'email']
              }]
            }]
          }
        ],
        order: [['start_time', 'ASC']]
      });

      return {
        success: true,
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
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id_employee', 'name', 'email', 'phone', 'position']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id_service', 'name', 'base_price', 'duration_minutes']
          },
          {
            model: ServiceClient,
            as: 'serviceClient',
            where: {
              service_date: {
                [Op.between]: [startDate, endDate]
              }
            },
            include: [{
              model: Client,
              as: 'client',
              include: [{
                model: require('../../models/clients/Associations').User,
                as: 'user',
                attributes: ['id_user', 'name', 'email']
              }]
            }]
          }
        ],
        order: [['start_time', 'ASC']]
      });

      return {
        success: true,
        data: serviceDetails
      };
    } catch (error) {
      throw new Error(`Error getting service details by date range: ${error.message}`);
    }
  }

  // Get service details statistics
  static async getServiceDetailStats() {
    try {
      const totalServiceDetails = await ServiceDetail.count();
      const statusCounts = await ServiceDetail.findAll({
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('id_service_detail')), 'count']
        ],
        group: ['status']
      });

      const totalRevenue = await ServiceDetail.sum('unit_price', {
        where: { status: 'Pagada' }
      });

      const pendingRevenue = await ServiceDetail.sum('unit_price', {
        where: { 
          status: {
            [Op.in]: ['Agendada', 'Confirmada', 'En proceso', 'Finalizada']
          }
        }
      });

      return {
        success: true,
        data: {
          total_service_details: totalServiceDetails,
          status_distribution: statusCounts,
          total_revenue: totalRevenue || 0,
          pending_revenue: pendingRevenue || 0
        }
      };
    } catch (error) {
      throw new Error(`Error getting service detail statistics: ${error.message}`);
    }
  }

  // Check if service detail exists
  static async serviceDetailExists(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);
      return !!serviceDetail;
    } catch (error) {
      throw new Error(`Error checking service detail existence: ${error.message}`);
    }
  }

  // Get service details that need to be converted to sales (status: "En proceso")
  static async getServiceDetailsForSales() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status: 'En proceso' },
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['id_employee', 'name', 'email', 'phone', 'position']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id_service', 'name', 'base_price', 'duration_minutes']
          },
          {
            model: ServiceClient,
            as: 'serviceClient',
            include: [{
              model: Client,
              as: 'client',
              include: [{
                model: require('../../models/clients/Associations').User,
                as: 'user',
                attributes: ['id_user', 'name', 'email']
              }]
            }]
          }
        ],
        order: [['start_time', 'ASC']]
      });

      return {
        success: true,
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
        throw new Error('Service detail not found');
      }

      // Check if already paid
      if (serviceDetail.status === 'Pagada') {
        throw new Error('Service detail is already paid and cannot be converted again');
      }

      // Only allow conversion from "En proceso" status
      if (serviceDetail.status !== 'En proceso') {
        throw new Error('Service detail must be in "En proceso" status to convert to sale. Current status: ' + serviceDetail.status);
      }

      serviceDetail.status = 'Pagada';
      await serviceDetail.save();

      // Get updated service detail with related information
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
}

module.exports = ServiceDetailService;
