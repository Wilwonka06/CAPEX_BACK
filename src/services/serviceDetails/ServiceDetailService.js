const ServiceDetail = require('../../models/serviceDetails/ServiceDetail');
const Service = require('../../models/Service');
const Product = require('../../models/Product');
const Employee = require('../../models/Employee');
const { Op } = require('sequelize');

class ServiceDetailService {
  // Obtener todos los detalles de servicios
  static async getAllServiceDetails() {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
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
      const serviceDetail = await ServiceDetail.findByPk(id, {
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ]
      });

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

  // Crear nuevo detalle de servicio con datos anidados
  static async createServiceDetail(serviceDetailData) {
    try {
      // Validación: Debe haber al menos un servicio o producto
      if (!serviceDetailData.productId && !serviceDetailData.serviceId) {
        return {
          success: false,
          message: 'Debe especificar al menos un producto o servicio'
        };
      }

      // Validación: Debe haber un cliente asociado (serviceClientId)
      if (!serviceDetailData.serviceClientId) {
        return {
          success: false,
          message: 'Debe especificar un cliente asociado al servicio'
        };
      }

      // Validación: empleadoId es obligatorio solo si hay servicio
      if (serviceDetailData.serviceId && !serviceDetailData.empleadoId) {
        return {
          success: false,
          message: 'El empleado es obligatorio cuando se especifica un servicio'
        };
      }

      // Si solo hay producto (sin servicio), el empleadoId puede ser null
      if (!serviceDetailData.serviceId) {
        serviceDetailData.empleadoId = null;
      }

      // Estado por defecto
      serviceDetailData.status = serviceDetailData.status || 'En ejecución';

      const serviceDetail = await ServiceDetail.create(serviceDetailData);

      // Obtener el detalle creado con datos anidados
      const createdDetail = await ServiceDetail.findByPk(serviceDetail.id, {
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ]
      });

      return {
        success: true,
        data: createdDetail,
        message: 'Orden de servicio creada exitosamente'
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

      // Validación: Si se están actualizando producto o servicio, debe haber al menos uno
      if ((serviceDetailData.hasOwnProperty('productId') || serviceDetailData.hasOwnProperty('serviceId')) &&
          !serviceDetailData.productId && !serviceDetailData.serviceId) {
        return {
          success: false,
          message: 'Debe especificar al menos un producto o servicio'
        };
      }

      // Validación: empleadoId es obligatorio solo si hay servicio
      if (serviceDetailData.hasOwnProperty('serviceId') && serviceDetailData.serviceId && !serviceDetailData.empleadoId) {
        return {
          success: false,
          message: 'El empleado es obligatorio cuando se especifica un servicio'
        };
      }

      // Si solo hay producto (sin servicio), el empleadoId puede ser null
      if (serviceDetailData.hasOwnProperty('serviceId') && !serviceDetailData.serviceId) {
        serviceDetailData.empleadoId = null;
      }

      await serviceDetail.update(serviceDetailData);

      // Obtener el detalle actualizado con datos anidados
      const updatedDetail = await ServiceDetail.findByPk(id, {
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ]
      });

      return {
        success: true,
        data: updatedDetail,
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

      // Validar que el estado sea válido
      const estadosValidos = ['En ejecución', 'Pagada', 'Anulada'];
      if (!estadosValidos.includes(estado)) {
        return {
          success: false,
          message: 'Estado no válido. Estados permitidos: En ejecución, Pagada, Anulada'
        };
      }

      await serviceDetail.update({ status: estado });

      // Obtener el detalle actualizado con datos anidados
      const updatedDetail = await ServiceDetail.findByPk(id, {
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ]
      });

      return {
        success: true,
        data: updatedDetail,
        message: 'Estado del detalle de servicio actualizado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al cambiar estado del detalle de servicio: ${error.message}`);
    }
  }

  // Obtener detalles por servicio cliente (organizados por servicios y productos)
  static async getByServiceClient(serviceClientId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { serviceClientId },
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para el servicio cliente especificado'
        };
      }

      // Organizar datos por servicios y productos
      const servicios = [];
      const productos = [];
      let totalServicios = 0;
      let totalProductos = 0;

      serviceDetails.forEach(detail => {
        if (detail.serviceId && detail.servicio) {
          // Es un servicio
          servicios.push({
            id: detail.id,
            serviceId: detail.serviceId,
            nombre: detail.servicio.nombre,
            descripcion: detail.servicio.descripcion,
            precioOriginal: detail.servicio.precio,
            empleadoId: detail.empleadoId,
            empleado: detail.empleado ? {
              id: detail.empleado.id,
              nombre: detail.empleado.nombre,
              especialidad: detail.empleado.especialidad,
              telefono: detail.empleado.telefono,
              email: detail.empleado.email
            } : null,
            cantidad: detail.quantity,
            precioUnitario: detail.unitPrice,
            subtotal: detail.subtotal,
            estado: detail.status,
            fechaCreacion: detail.createdAt,
            fechaActualizacion: detail.updatedAt
          });
          totalServicios += parseFloat(detail.subtotal);
        } else if (detail.productId && detail.producto) {
          // Es un producto
          productos.push({
            id: detail.id,
            productId: detail.productId,
            nombre: detail.producto.nombre,
            descripcion: detail.producto.descripcion,
            precioOriginal: detail.producto.precio,
            cantidad: detail.quantity,
            precioUnitario: detail.unitPrice,
            subtotal: detail.subtotal,
            estado: detail.status,
            fechaCreacion: detail.createdAt,
            fechaActualizacion: detail.updatedAt
          });
          totalProductos += parseFloat(detail.subtotal);
        }
      });

      const respuesta = {
        serviceClientId: serviceClientId,
        resumen: {
          totalDetalles: serviceDetails.length,
          totalServicios: servicios.length,
          totalProductos: productos.length,
          subtotalServicios: totalServicios.toFixed(2),
          subtotalProductos: totalProductos.toFixed(2),
          totalGeneral: (totalServicios + totalProductos).toFixed(2)
        },
        servicios: servicios,
        productos: productos
      };

      return {
        success: true,
        data: respuesta,
        message: 'Detalles de servicio cliente obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por servicio cliente: ${error.message}`);
    }
  }

  // Obtener detalles organizados por servicios y productos (método general)
  static async getDetailsOrganized(serviceClientId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { serviceClientId },
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para el servicio cliente especificado'
        };
      }

      // Organizar datos por servicios y productos
      const servicios = [];
      const productos = [];
      let totalServicios = 0;
      let totalProductos = 0;

      serviceDetails.forEach(detail => {
        if (detail.serviceId && detail.servicio) {
          // Es un servicio
          servicios.push({
            id: detail.id,
            serviceId: detail.serviceId,
            nombre: detail.servicio.nombre,
            descripcion: detail.servicio.descripcion,
            precioOriginal: detail.servicio.precio,
            empleadoId: detail.empleadoId,
            empleado: detail.empleado ? {
              id: detail.empleado.id,
              nombre: detail.empleado.nombre,
              especialidad: detail.empleado.especialidad,
              telefono: detail.empleado.telefono,
              email: detail.empleado.email
            } : null,
            cantidad: detail.quantity,
            precioUnitario: detail.unitPrice,
            subtotal: detail.subtotal,
            estado: detail.status,
            fechaCreacion: detail.createdAt,
            fechaActualizacion: detail.updatedAt
          });
          totalServicios += parseFloat(detail.subtotal);
        } else if (detail.productId && detail.producto) {
          // Es un producto
          productos.push({
            id: detail.id,
            productId: detail.productId,
            nombre: detail.producto.nombre,
            descripcion: detail.producto.descripcion,
            precioOriginal: detail.producto.precio,
            cantidad: detail.quantity,
            precioUnitario: detail.unitPrice,
            subtotal: detail.subtotal,
            estado: detail.status,
            fechaCreacion: detail.createdAt,
            fechaActualizacion: detail.updatedAt
          });
          totalProductos += parseFloat(detail.subtotal);
        }
      });

      const respuesta = {
        serviceClientId: serviceClientId,
        resumen: {
          totalDetalles: serviceDetails.length,
          totalServicios: servicios.length,
          totalProductos: productos.length,
          subtotalServicios: totalServicios.toFixed(2),
          subtotalProductos: totalProductos.toFixed(2),
          totalGeneral: (totalServicios + totalProductos).toFixed(2)
        },
        servicios: servicios,
        productos: productos
      };

      return {
        success: true,
        data: respuesta,
        message: 'Detalles organizados obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles organizados: ${error.message}`);
    }
  }

  // Obtener detalles por producto
  static async getByProduct(productId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { productId },
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para el producto especificado'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles por producto obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por producto: ${error.message}`);
    }
  }

  // Obtener detalles por servicio
  static async getByService(serviceId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { serviceId },
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para el servicio especificado'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles por servicio obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por servicio: ${error.message}`);
    }
  }

  // Obtener detalles por empleado
  static async getByEmployee(empleadoId) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { empleadoId },
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles para el empleado especificado'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles por empleado obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por empleado: ${error.message}`);
    }
  }

  // Obtener detalles por estado
  static async getByStatus(status) {
    try {
      const serviceDetails = await ServiceDetail.findAll({
        where: { status },
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ],
        order: [['id', 'ASC']]
      });

      if (!serviceDetails || serviceDetails.length === 0) {
        return {
          success: false,
          message: 'No se encontraron detalles con el estado especificado'
        };
      }

      return {
        success: true,
        data: serviceDetails,
        message: 'Detalles por estado obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles por estado: ${error.message}`);
    }
  }

  // Calcular subtotal
  static async calculateSubtotal(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id, {
        include: [
          {
            model: Service,
            as: 'servicio',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Product,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio', 'descripcion']
          },
          {
            model: Employee,
            as: 'empleado',
            attributes: ['id', 'nombre', 'especialidad', 'telefono', 'email']
          }
        ]
      });

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      const subtotal = serviceDetail.unitPrice * serviceDetail.quantity;

      return {
        success: true,
        data: {
          id: serviceDetail.id,
          unitPrice: serviceDetail.unitPrice,
          quantity: serviceDetail.quantity,
          subtotal: subtotal,
          servicio: serviceDetail.servicio,
          producto: serviceDetail.producto,
          empleado: serviceDetail.empleado
        },
        message: 'Subtotal calculado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al calcular subtotal: ${error.message}`);
    }
  }

  // Obtener estadísticas
  static async getStatistics() {
    try {
      const totalDetails = await ServiceDetail.count();
      const enEjecucion = await ServiceDetail.count({ where: { status: 'En ejecución' } });
      const pagadas = await ServiceDetail.count({ where: { status: 'Pagada' } });
      const anuladas = await ServiceDetail.count({ where: { status: 'Anulada' } });

      // Calcular total de ventas
      const allDetails = await ServiceDetail.findAll();
      const totalVentas = allDetails.reduce((sum, detail) => sum + parseFloat(detail.subtotal), 0);

      return {
        success: true,
        data: {
          totalDetails,
          enEjecucion,
          pagadas,
          anuladas,
          totalVentas: totalVentas.toFixed(2)
        },
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = ServiceDetailService;

