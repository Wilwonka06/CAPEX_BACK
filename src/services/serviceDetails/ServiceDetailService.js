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

  // Actualizar detalle de servicio (con verificación de estado)
  static async updateServiceDetail(id, serviceDetailData) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      // REGLA DE NEGOCIO: Solo se puede editar si está "En ejecución"
      if (serviceDetail.status === 'Pagada') {
        return {
          success: false,
          message: 'No se puede editar un detalle de servicio que ya está pagado. Solo se permite anular.'
        };
      }

      if (serviceDetail.status === 'Anulada') {
        return {
          success: false,
          message: 'No se puede editar un detalle de servicio anulado.'
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

  // Eliminar detalle de servicio (con verificación de estado)
  static async deleteServiceDetail(id) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(id);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      // REGLA DE NEGOCIO: Solo se puede eliminar si está "En ejecución"
      if (serviceDetail.status === 'Pagada') {
        return {
          success: false,
          message: 'No se puede eliminar un detalle de servicio que ya está pagado. Solo se permite anular.'
        };
      }

      if (serviceDetail.status === 'Anulada') {
        return {
          success: false,
          message: 'No se puede eliminar un detalle de servicio anulado.'
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

  // Cambiar estado del detalle de servicio (con verificación de estado actual)
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

      // REGLAS DE NEGOCIO para cambios de estado
      const estadoActual = serviceDetail.status;
      
      // No se puede cambiar a "En ejecución" si ya está pagado o anulado
      if (estado === 'En ejecución' && (estadoActual === 'Pagada' || estadoActual === 'Anulada')) {
        return {
          success: false,
          message: `No se puede cambiar el estado a "En ejecución" desde "${estadoActual}"`
        };
      }

      // No se puede cambiar a "Pagada" si ya está anulado
      if (estado === 'Pagada' && estadoActual === 'Anulada') {
        return {
          success: false,
          message: 'No se puede cambiar el estado a "Pagada" desde "Anulada"'
        };
      }

      // No se puede cambiar a "Anulada" si ya está anulado
      if (estado === 'Anulada' && estadoActual === 'Anulada') {
        return {
          success: false,
          message: 'El detalle de servicio ya está anulado'
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
        message: `Estado del detalle de servicio cambiado exitosamente a "${estado}"`
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

  // Anular servicio o producto específico del detalle (NO ELIMINAR)
  static async removeServiceOrProduct(detailId, serviceId = null, productId = null) {
    try {
      const serviceDetail = await ServiceDetail.findByPk(detailId);

      if (!serviceDetail) {
        return {
          success: false,
          message: 'Detalle de servicio no encontrado'
        };
      }

      // REGLA DE NEGOCIO: Solo se puede anular si está "En ejecución" o "Pagada"
      if (serviceDetail.status === 'Anulada') {
        return {
          success: false,
          message: 'El detalle de servicio ya está anulado'
        };
      }

      // Validar que se especifique qué anular
      if (!serviceId && !productId) {
        return {
          success: false,
          message: 'Debe especificar un serviceId o productId para anular'
        };
      }

      // Validar que el detalle tenga el servicio/producto que se quiere anular
      if (serviceId && serviceDetail.serviceId !== serviceId) {
        return {
          success: false,
          message: 'El detalle no contiene el servicio especificado'
        };
      }

      if (productId && serviceDetail.productId !== productId) {
        return {
          success: false,
          message: 'El detalle no contiene el producto especificado'
        };
      }

      // REGLA DE NEGOCIO: No se puede anular el último servicio/producto
      // Verificar si hay otros detalles activos con el mismo serviceClientId
      const otrosDetallesActivos = await ServiceDetail.findAll({
        where: {
          serviceClientId: serviceDetail.serviceClientId,
          id: { [Op.ne]: detailId },
          status: { [Op.ne]: 'Anulada' } // Solo detalles no anulados
        }
      });

      if (otrosDetallesActivos.length === 0) {
        return {
          success: false,
          message: 'No se puede anular el último servicio/producto del cliente. Debe mantener al menos un detalle activo.'
        };
      }

      // ANULAR en lugar de eliminar - mantener la integridad de las ventas
      await serviceDetail.update({ status: 'Anulada' });

      return {
        success: true,
        message: 'Servicio/Producto anulado exitosamente del detalle (mantenido para integridad de ventas)'
      };
    } catch (error) {
      throw new Error(`Error al anular servicio/producto del detalle: ${error.message}`);
    }
  }

  // Agregar nuevo servicio o producto al detalle existente
  static async addServiceOrProduct(serviceClientId, serviceData) {
    try {
      // Validación: Debe haber al menos un servicio o producto
      if (!serviceData.productId && !serviceData.serviceId) {
        return {
          success: false,
          message: 'Debe especificar al menos un producto o servicio'
        };
      }

      // Validación: Debe haber un cliente asociado (serviceClientId)
      if (!serviceClientId) {
        return {
          success: false,
          message: 'Debe especificar un cliente asociado al servicio'
        };
      }

      // Validación: empleadoId es obligatorio solo si hay servicio
      if (serviceData.serviceId && !serviceData.empleadoId) {
        return {
          success: false,
          message: 'El empleado es obligatorio cuando se especifica un servicio'
        };
      }

      // Si solo hay producto (sin servicio), el empleadoId puede ser null
      if (!serviceData.serviceId) {
        serviceData.empleadoId = null;
      }

      // Asignar el serviceClientId
      serviceData.serviceClientId = serviceClientId;

      // Estado por defecto
      serviceData.status = serviceData.status || 'En ejecución';

      const serviceDetail = await ServiceDetail.create(serviceData);

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
        message: 'Nuevo servicio/producto agregado al detalle exitosamente'
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
      throw new Error(`Error al agregar servicio/producto al detalle: ${error.message}`);
    }
  }

  // Obtener todos los detalles de un servicio cliente con conteo
  static async getServiceClientDetailsWithCount(serviceClientId) {
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

      // Contar servicios y productos
      const totalServicios = serviceDetails.filter(detail => detail.serviceId).length;
      const totalProductos = serviceDetails.filter(detail => detail.productId).length;

      // Calcular totales
      const subtotalServicios = serviceDetails
        .filter(detail => detail.serviceId)
        .reduce((sum, detail) => sum + parseFloat(detail.subtotal), 0);

      const subtotalProductos = serviceDetails
        .filter(detail => detail.productId)
        .reduce((sum, detail) => sum + parseFloat(detail.subtotal), 0);

      const totalGeneral = subtotalServicios + subtotalProductos;

      return {
        success: true,
        data: {
          serviceClientId,
          resumen: {
            totalDetalles: serviceDetails.length,
            totalServicios,
            totalProductos,
            subtotalServicios: subtotalServicios.toFixed(2),
            subtotalProductos: subtotalProductos.toFixed(2),
            totalGeneral: totalGeneral.toFixed(2)
          },
          detalles: serviceDetails
        },
        message: 'Detalles del servicio cliente obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al obtener detalles del servicio cliente: ${error.message}`);
    }
  }
}

module.exports = ServiceDetailService;

