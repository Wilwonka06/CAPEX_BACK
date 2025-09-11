const VentaProducto = require('../../models/salesProduct/Sales');
const DetalleVentaProducto = require('../../models/salesProduct/SalesDetail');
const Pedido = require('../../models/salesProduct/Order');
const Product = require('../../models/Product');
const Client = require('../../models/clients/Client');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class SalesService {
  // Obtener todas las ventas con paginación
  async getAllSales(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      include: [
        {
          model: Client,
          as: 'cliente',
          attributes: ['id_cliente', 'id_usuario', 'direccion'],
          include: [
            {
              model: require('../../models/User').Usuario,
              as: 'usuario',
              attributes: ['nombre', 'correo', 'telefono']
            }
          ]
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['id_producto', 'nombre', 'precio_venta', 'url_foto']
            }
          ]
        },
        {
          model: Pedido,
          as: 'pedido',
          attributes: ['id_pedido', 'fecha', 'estado'],
          required: false // LEFT JOIN para ventas que no provienen de pedidos
        }
      ],
      limit,
      offset,
      order: [['fecha_creacion', 'DESC']]
    });
    
    return {
      ventas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener venta por ID
  async getSaleById(id) {
    return await VentaProducto.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'cliente',
          attributes: ['id_cliente', 'id_usuario', 'direccion'],
          include: [
            {
              model: require('../../models/User').Usuario,
              as: 'usuario',
              attributes: ['nombre', 'correo', 'telefono', 'documento']
            }
          ]
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto'
            }
          ]
        },
        {
          model: Pedido,
          as: 'pedido',
          required: false
        }
      ]
    });
  }

  // Crear nueva venta
  async createSale(ventaData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id_cliente, productos, metodo_pago, observaciones, descuento = 0 } = ventaData;

      // Validar que hay productos
      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw new Error('La venta debe tener al menos un producto');
      }

      // Validar cliente si se proporciona
      if (id_cliente) {
        const cliente = await Client.findByPk(id_cliente);
        if (!cliente) {
          throw new Error('Cliente no encontrado');
        }
      }

      let subtotalGeneral = 0;
      let ivaGeneral = 0;
      const detallesValidados = [];

      // Procesar cada producto
      for (const item of productos) {
        const { id_producto, cantidad, precio_unitario, descuento_unitario = 0 } = item;

        // Validar que el producto existe
        const producto = await Product.findByPk(id_producto);
        if (!producto) {
          throw new Error(`El producto con ID ${id_producto} no existe`);
        }

        // Validar stock disponible
        if (producto.stock < cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Stock disponible: ${producto.stock}`);
        }

        // Calcular subtotales
        const subtotalDetalle = (cantidad * precio_unitario) - descuento_unitario;
        const ivaProducto = producto.iva || 0;
        const ivaDetalle = subtotalDetalle * (ivaProducto / 100);

        subtotalGeneral += subtotalDetalle;
        ivaGeneral += ivaDetalle;

        detallesValidados.push({
          id_producto,
          cantidad,
          precio_unitario,
          subtotal: subtotalDetalle,
          descuento_unitario,
          producto // Para usar después
        });
      }

      // Aplicar descuento general
      const totalConDescuento = subtotalGeneral - descuento;
      const totalFinal = totalConDescuento + ivaGeneral;

      // Crear la venta
      const nuevaVenta = await VentaProducto.create({
        fecha: new Date(),
        id_cliente: id_cliente || null,
        subtotal: subtotalGeneral,
        iva: ivaGeneral,
        total: totalFinal,
        descuento,
        metodo_pago: metodo_pago || 'Efectivo',
        estado: 'Completado',
        observaciones
      }, { transaction });

      // Crear los detalles de la venta y actualizar stock
      for (const detalle of detallesValidados) {
        await DetalleVentaProducto.create({
          id_venta_producto: nuevaVenta.id_venta_producto,
          id_producto: detalle.id_producto,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
          descuento_unitario: detalle.descuento_unitario
        }, { transaction });

        // Reducir stock
        await Product.decrement('stock', {
          by: detalle.cantidad,
          where: { id_producto: detalle.id_producto },
          transaction
        });
      }

      await transaction.commit();
      return await this.getSaleById(nuevaVenta.id_venta_producto);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Crear venta desde pedido (cuando un pedido pasa a "Enviado")
  async createSaleFromOrder(pedidoId) {
    const transaction = await sequelize.transaction();
    
    try {
      // Obtener el pedido con sus detalles
      const pedido = await Pedido.findByPk(pedidoId, {
        include: [
          {
            model: require('../../models/salesProduct/OrderDetail'),
            as: 'detalles',
            include: [
              {
                model: Product,
                as: 'producto'
              }
            ]
          }
        ]
      });

      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }

      if (pedido.estado !== 'Enviado') {
        throw new Error('Solo se pueden convertir pedidos con estado "Enviado"');
      }

      // Verificar si ya existe una venta para este pedido
      const ventaExistente = await VentaProducto.findOne({
        where: { id_pedido: pedidoId }
      });

      if (ventaExistente) {
        throw new Error('Ya existe una venta para este pedido');
      }

      let subtotalGeneral = 0;
      let ivaGeneral = 0;

      // Calcular totales y validar stock
      for (const detalle of pedido.detalles) {
        const producto = detalle.producto;
        
        // Validar stock
        if (producto.stock < detalle.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Stock disponible: ${producto.stock}`);
        }

        const ivaProducto = producto.iva || 0;
        const ivaDetalle = detalle.subtotal * (ivaProducto / 100);

        subtotalGeneral += parseFloat(detalle.subtotal);
        ivaGeneral += ivaDetalle;
      }

      // Crear la venta
      const nuevaVenta = await VentaProducto.create({
        fecha: new Date(),
        id_pedido: pedidoId,
        subtotal: subtotalGeneral,
        iva: ivaGeneral,
        total: subtotalGeneral + ivaGeneral,
        descuento: 0,
        metodo_pago: 'Pendiente',
        estado: 'Completado',
        observaciones: `Venta generada automáticamente desde pedido #${pedidoId}`
      }, { transaction });

      // Crear detalles y actualizar stock
      for (const detallePedido of pedido.detalles) {
        await DetalleVentaProducto.create({
          id_venta_producto: nuevaVenta.id_venta_producto,
          id_producto: detallePedido.id_producto,
          cantidad: detallePedido.cantidad,
          precio_unitario: detallePedido.precio_unitario,
          subtotal: detallePedido.subtotal,
          descuento_unitario: 0
        }, { transaction });

        // Reducir stock
        await Product.decrement('stock', {
          by: detallePedido.cantidad,
          where: { id_producto: detallePedido.id_producto },
          transaction
        });
      }

      await transaction.commit();
      return await this.getSaleById(nuevaVenta.id_venta_producto);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Cancelar venta (restaurar stock)
  async cancelSale(id) {
    const transaction = await sequelize.transaction();

    try {
      const venta = await VentaProducto.findByPk(id, {
        include: [
          {
            model: DetalleVentaProducto,
            as: 'detalles'
          }
        ]
      });

      if (!venta) {
        throw new Error('Venta no encontrada');
      }

      if (venta.estado === 'Cancelado') {
        throw new Error('La venta ya está cancelada');
      }

      // Restaurar stock de los productos
      for (const detalle of venta.detalles) {
        await Product.increment('stock', {
          by: detalle.cantidad,
          where: { id_producto: detalle.id_producto },
          transaction
        });
      }

      // Cambiar estado a cancelado
      await venta.update({ estado: 'Cancelado' }, { transaction });

      await transaction.commit();
      return await this.getSaleById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Búsqueda global en ventas
  async searchSales(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const whereCondition = {
      [Op.or]: [
        // Buscar por ID de venta
        sequelize.where(
          sequelize.cast(sequelize.col('VentaProducto.id_venta_producto'), 'CHAR'),
          { [Op.like]: `%${searchTerm}%` }
        ),
        // Buscar por estado
        { estado: { [Op.like]: `%${searchTerm}%` } },
        // Buscar por método de pago
        { metodo_pago: { [Op.like]: `%${searchTerm}%` } },
        // Buscar por total
        sequelize.where(
          sequelize.cast(sequelize.col('VentaProducto.total'), 'CHAR'),
          { [Op.like]: `%${searchTerm}%` }
        )
      ]
    };

    const { count, rows } = await VentaProducto.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: require('../../models/User').Usuario,
              as: 'usuario',
              where: {
                [Op.or]: [
                  { nombre: { [Op.like]: `%${searchTerm}%` } },
                  { documento: { [Op.like]: `%${searchTerm}%` } },
                  { correo: { [Op.like]: `%${searchTerm}%` } }
                ]
              },
              required: false
            }
          ],
          required: false
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              where: {
                nombre: { [Op.like]: `%${searchTerm}%` }
              },
              required: false
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha_creacion', 'DESC']],
      distinct: true
    });

    return {
      ventas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener ventas por estado
  async getSalesByStatus(estado, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      where: { estado },
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: require('../../models/User').Usuario,
              as: 'usuario',
              attributes: ['nombre', 'correo']
            }
          ]
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['nombre', 'precio_venta']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha_creacion', 'DESC']]
    });

    return {
      ventas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener ventas por cliente
  async getSalesByClient(clienteId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      where: { id_cliente: clienteId },
      include: [
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto'
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha_creacion', 'DESC']]
    });

    return {
      ventas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener ventas por rango de fechas
  async getSalesByDateRange(fechaInicio, fechaFin, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: require('../../models/User').Usuario,
              as: 'usuario',
              attributes: ['nombre']
            }
          ]
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['nombre', 'precio_venta']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha', 'DESC']]
    });

    return {
      ventas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener estadísticas de ventas
  async getSalesStatistics() {
    const totalVentas = await VentaProducto.count();
    const ventasCompletadas = await VentaProducto.count({ where: { estado: 'Completado' } });
    const ventasCanceladas = await VentaProducto.count({ where: { estado: 'Cancelado' } });
    
    // Total en dinero (solo ventas completadas)
    const totalIngresos = await VentaProducto.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
      where: { estado: 'Completado' }
    });

    // Ventas del mes actual
    const ventasMesActual = await VentaProducto.count({
      where: {
        estado: 'Completado',
        fecha: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Ingresos del mes actual
    const ingresosMesActual = await VentaProducto.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
      where: {
        estado: 'Completado',
        fecha: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Producto más vendido
    const productoMasVendido = await DetalleVentaProducto.findOne({
      attributes: [
        'id_producto',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido']
      ],
      include: [
        {
          model: Product,
          as: 'producto',
          attributes: ['nombre']
        },
        {
          model: VentaProducto,
          as: 'venta',
          where: { estado: 'Completado' },
          attributes: []
        }
      ],
      group: ['id_producto'],
      order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']],
      limit: 1
    });

    return {
      totalVentas,
      ventasCompletadas,
      ventasCanceladas,
      totalIngresos: parseFloat(totalIngresos?.dataValues?.total || 0).toFixed(2),
      ventasMesActual,
      ingresosMesActual: parseFloat(ingresosMesActual?.dataValues?.total || 0).toFixed(2),
      productoMasVendido: productoMasVendido ? {
        nombre: productoMasVendido.producto.nombre,
        cantidadVendida: productoMasVendido.dataValues.total_vendido
      } : null,
      porcentajeCompletadas: totalVentas > 0 ? ((ventasCompletadas / totalVentas) * 100).toFixed(2) : 0
    };
  }

  // Actualizar método de pago
  async updatePaymentMethod(id, metodoPago) {
    const venta = await VentaProducto.findByPk(id);
    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    await venta.update({ metodo_pago: metodoPago });
    return await this.getSaleById(id);
  }
}

module.exports = new SalesService();