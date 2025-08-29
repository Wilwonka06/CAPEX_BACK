const ServiceDetail = require('../../models/serviceDetails/ServiceDetail');
const { Op } = require('sequelize');

class ServiceDetailService {
  // Obtener todos los detalles de servicios
  static async getAllServiceDetails() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        order: [['id_detalle_servicio_cliente', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles de servicios'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles de servicios obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles de servicios: ${error.message}`);
    }
  }

  // Obtener detalle de servicio por ID
  static async getServiceDetailById(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      return {
        success: true,
        data: serviceDetail,
        message: 'Detalle de servicio obtenido exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalle de servicio: ${error.message}`);
    }
  }

  // Crear nuevo detalle de servicio
  static async createServiceDetail(serviceDetailData) {
    try {
      // Validar que hora_finalizacion sea mayor que hora_inicio
      if (serviceDetailData.hora_inicio && serviceDetailData.hora_finalizacion) {
        const inicio = new Date(`2000-01-01 ${serviceDetailData.hora_inicio}`);
        const fin = new Date(`2000-01-01 ${serviceDetailData.hora_finalizacion}`);
        
        if (fin <= inicio) {
          return {
            success: false,
            message: 'La hora de finalización debe ser mayor que la hora de inicio'
          };
        }
      }

      const serviceDetail = await ServiceDetail.create(serviceDetailData);

      return {
        success: true,
        data: serviceDetail,
        message: 'Detalle de servicio creado exitosamente'
      };
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return {
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        };
      }
      throw new Error(`Error al crear detalle de servicio: ${error.message}`);
    }
  }

  // Actualizar detalle de servicio
  static async updateServiceDetail(id, serviceDetailData) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      // Validar que hora_finalizacion sea mayor que hora_inicio si se están actualizando
      if (serviceDetailData.hora_inicio && serviceDetailData.hora_finalizacion) {
        const inicio = new Date(`2000-01-01 ${serviceDetailData.hora_inicio}`);
        const fin = new Date(`2000-01-01 ${serviceDetailData.hora_finalizacion}`);
        
        if (fin <= inicio) {
          return {
            success: false,
            message: 'La hora de finalización debe ser mayor que la hora de inicio'
          };
        }
      }

      await serviceDetail.update(serviceDetailData);

      return {
        success: true,
        data: serviceDetail,
        message: 'Detalle de servicio actualizado exitosamente'
      };
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return {
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        };
      }
      throw new Error(`Error al actualizar detalle de servicio: ${error.message}`);
    }
  }

  // Eliminar detalle de servicio
  static async deleteServiceDetail(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      await serviceDetail.destroy();

      return {
        success: true,
        message: 'Detalle de servicio eliminado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al eliminar detalle de servicio: ${error.message}`);
    }
  }

  // Cambiar estado del detalle de servicio
  static async changeStatus(id, estado) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      if (!['En ejecución', 'Pagado'].includes(estado)) {
        return {
          success: false,
          message: 'Estado no válido. Debe ser "En ejecución" o "Pagado"'
        };
      }

      await serviceDetail.update({ estado });

      return {
        success: true,
        data: serviceDetail,
        message: 'Estado del detalle de servicio actualizado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al cambiar estado: ${error.message}`);
    }
  }

  // Obtener detalles por servicio cliente
  static async getByServiceClient(serviceClientId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { id_servicio_cliente: serviceClientId },
        order: [['hora_inicio', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para este servicio cliente'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles de servicio cliente obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por servicio cliente: ${error.message}`);
    }
  }

  // Obtener detalles por empleado
  static async getByEmployee(employeeId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { id_empleado: employeeId },
        order: [['hora_inicio', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para este empleado'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles de empleado obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por empleado: ${error.message}`);
    }
  }

  // Obtener detalles por estado
  static async getByStatus(status) {
    try {
      if (!['En ejecución', 'Pagado'].includes(status)) {
        return {
          success: false,
          message: 'Estado no válido. Debe ser "En ejecución" o "Pagado"'
        };
      }

      const serviceDetails = await ServiceDetail.findAll({
        where: { estado: status },
        order: [['hora_inicio', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: `No se encontraron detalles con estado "${status}"`
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: `Detalles con estado "${status}" obtenidos exitosamente`
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por estado: ${error.message}`);
    }
  }

  // Calcular precio total
  static async calculateTotalPrice(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      const totalPrice = serviceDetail.precio_unitario * serviceDetail.cantidad;

      return {
        success: true,
        data: {
          id_detalle_servicio_cliente: serviceDetail.id_detalle_servicio_cliente,
          precio_unitario: serviceDetail.precio_unitario,
          cantidad: serviceDetail.cantidad,
          precio_total: totalPrice
        },
        message: 'Precio total calculado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al calcular precio total: ${error.message}`);
    }
  }

  // Obtener estadísticas
  static async getStatistics() {
    try {
      const totalDetails = await ServiceDetail.count();
      const enEjecucion = await ServiceDetail.count({ where: { estado: 'En ejecución' } });
      const pagados = await ServiceDetail.count({ where: { estado: 'Pagado' } });

      // Calcular precio total de todos los detalles
      const allDetails = await ServiceDetail.findAll();
      const precioTotal = allDetails.reduce((total, detail) => {
        return total + (detail.precio_unitario * detail.cantidad);
      }, 0);

      return {
        success: true,
        data: {
          total_detalles: totalDetails,
          en_ejecucion: enEjecucion,
          pagados: pagados,
          precio_total_general: precioTotal
        },
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = ServiceDetailService;
