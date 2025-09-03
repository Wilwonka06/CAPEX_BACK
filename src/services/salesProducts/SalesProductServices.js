const VentaProducto = require('../../models/salesProducts/SalesProduct');
const DetalleVentaProducto = require('../../models/salesProducts/SalesProductDetail');
const Product = require('../../models/Product');
const Client = require('../../models/clients/Client');
const { Usuario } = require('../../models/User');
const { sequelize } = require('../../config/database');
const { Op } = require('sequelize');

class VentaProductoService {
  // Obtener todas las ventas con paginación
  async getAllVentas(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'documento', 'correo', 'telefono']
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

  // Búsqueda global en todas las ventas
  async searchVentas(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      where: {
        [Op.or]: [
          // Búsqueda por ID de venta
          sequelize.where(
            sequelize.cast(sequelize.col('VentaProducto.id_venta_producto'), 'CHAR'),
            { [Op.like]: `%${searchTerm}%` }
          ),
          // Búsqueda por fecha
          sequelize.where(
            sequelize.cast(sequelize.col('VentaProducto.fecha'), 'CHAR'),
            { [Op.like]: `%${searchTerm}%` }
          ),
          // Búsqueda por total
          sequelize.where(
            sequelize.cast(sequelize.col('VentaProducto.total'), 'CHAR'),
            { [Op.like]: `%${searchTerm}%` }
          ),
          // Búsqueda por estado
          {
            estado: { [Op.like]: `%${searchTerm}%` }
          }
        ]
      },
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'documento', 'correo', 'telefono'],
              where: {
                [Op.or]: [
                  { nombre: { [Op.like]: `%${searchTerm}%` } },
                  { documento: { [Op.like]: `%${searchTerm}%` } },
                  { correo: { [Op.like]: `%${searchTerm}%` } },
                  { telefono: { [Op.like]: `%${searchTerm}%` } }
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
              attributes: ['nombre', 'precio_venta'],
              where: {
                nombre: { [Op.like]: `%${searchTerm}%` }
              },
              required: false
            }
          ],
          required: false
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

  // Obtener venta por ID
  async getVentaById(id) {
    return await VentaProducto.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'documento', 'correo', 'telefono']
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
              attributes: ['nombre', 'precio_venta', 'stock']
            }
          ]
        }
      ]
    });
  }

  // Crear nueva venta con transacción
  async createVenta(ventaData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { detalles, ...ventaInfo } = ventaData;

      // Verificar que el cliente existe si se proporciona
      if (ventaInfo.id_cliente) {
        const cliente = await Client.findByPk(ventaInfo.id_cliente);
        if (!cliente) {
          throw new Error('Cliente no encontrado');
        }
      }

      // Verificar stock de productos antes de crear la venta
      if (detalles && Array.isArray(detalles)) {
        for (const detalle of detalles) {
          const producto = await Product.findByPk(detalle.id_producto, { transaction });
          if (!producto) {
            throw new Error(`Producto con ID ${detalle.id_producto} no encontrado`);
          }
          if (producto.stock < detalle.cantidad) {
            throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Stock disponible: ${producto.stock}`);
          }
        }
      }

      // Crear la venta
      const nuevaVenta = await VentaProducto.create(ventaInfo, { transaction });

      let totalVenta = 0;

      // Crear detalles y actualizar stock
      if (detalles && Array.isArray(detalles)) {
        for (const detalle of detalles) {
          const producto = await Product.findByPk(detalle.id_producto, { transaction });
          
          const subtotal = detalle.cantidad * detalle.precio_unitario;
          totalVenta += subtotal;

          // Crear detalle de venta
          await DetalleVentaProducto.create({
            id_venta_producto: nuevaVenta.id_venta_producto,
            id_producto: detalle.id_producto,
            id_servicios_cliente: detalle.id_servicios_cliente || null,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: subtotal
          }, { transaction });

          // Actualizar stock del producto
          await producto.update({
            stock: producto.stock - detalle.cantidad
          }, { transaction });
        }
      }

      // Actualizar total de la venta
      await nuevaVenta.update({ total: totalVenta }, { transaction });

      await transaction.commit();

      // Retornar la venta completa
      return await this.getVentaById(nuevaVenta.id_venta_producto);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Actualizar venta
  async updateVenta(id, updateData) {
    const transaction = await sequelize.transaction();

    try {
      const venta = await VentaProducto.findByPk(id, {
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
        transaction
      });

      if (!venta) {
        throw new Error('Venta no encontrada');
      }

      const { detalles, ...ventaInfo } = updateData;

      // Si la venta ya está completada, no permitir cambios en detalles
      if (venta.estado === 'Completado' && detalles) {
        throw new Error('No se pueden modificar los detalles de una venta completada');
      }

      // Si se están actualizando los detalles, restaurar stock anterior y aplicar nuevo
      if (detalles && Array.isArray(detalles)) {
        // Restaurar stock de productos de los detalles anteriores
        for (const detalleAnterior of venta.detalles) {
          const producto = await Product.findByPk(detalleAnterior.id_producto, { transaction });
          if (producto) {
            await producto.update({
              stock: producto.stock + detalleAnterior.cantidad
            }, { transaction });
          }
        }

        // Eliminar detalles anteriores
        await DetalleVentaProducto.destroy({
          where: { id_venta_producto: id },
          transaction
        });

        // Verificar stock para nuevos detalles
        for (const detalle of detalles) {
          const producto = await Product.findByPk(detalle.id_producto, { transaction });
          if (!producto) {
            throw new Error(`Producto con ID ${detalle.id_producto} no encontrado`);
          }
          if (producto.stock < detalle.cantidad) {
            throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Stock disponible: ${producto.stock}`);
          }
        }

        let totalVenta = 0;

        // Crear nuevos detalles y actualizar stock
        for (const detalle of detalles) {
          const producto = await Product.findByPk(detalle.id_producto, { transaction });
          
          const subtotal = detalle.cantidad * detalle.precio_unitario;
          totalVenta += subtotal;

          await DetalleVentaProducto.create({
            id_venta_producto: id,
            id_producto: detalle.id_producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: subtotal
          }, { transaction });

          await producto.update({
            stock: producto.stock - detalle.cantidad
          }, { transaction });
        }

        ventaInfo.total = totalVenta;
      }

      // Actualizar la venta
      await venta.update(ventaInfo, { transaction });

      await transaction.commit();

      return await this.getVentaById(id);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Cancelar venta
  async cancelarVenta(id) {
    const transaction = await sequelize.transaction();

    try {
      const venta = await VentaProducto.findByPk(id, {
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
        transaction
      });

      if (!venta) {
        throw new Error('Venta no encontrada');
      }

      if (venta.estado === 'Cancelado') {
        throw new Error('La venta ya está cancelada');
      }

      // Restaurar stock de los productos
      for (const detalle of venta.detalles) {
        const producto = await Product.findByPk(detalle.id_producto, { transaction });
        if (producto) {
          await producto.update({
            stock: producto.stock + detalle.cantidad
          }, { transaction });
        }
      }

      // Cambiar estado a cancelado
      await venta.update({ estado: 'Cancelado' }, { transaction });

      await transaction.commit();

      return await this.getVentaById(id);

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Obtener ventas por cliente
  async getVentasByCliente(clienteId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await VentaProducto.findAndCountAll({
      where: { id_cliente: clienteId },
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'documento', 'correo', 'telefono']
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

  // Obtener ventas por rango de fechas
  async getVentasByFechas(fechaInicio, fechaFin, page = 1, limit = 10) {
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
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'documento', 'correo', 'telefono']
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
  async getEstadisticas() {
    const totalVentas = await VentaProducto.count();
    const ventasCompletadas = await VentaProducto.count({ where: { estado: 'Completado' } });
    const ventasPendientes = await VentaProducto.count({ where: { estado: 'Pendiente' } });
    const ventasCanceladas = await VentaProducto.count({ where: { estado: 'Cancelado' } });

    // Obtener total de ventas completadas
    const totalIngresos = await VentaProducto.findOne({
      attributes: [[VentaProducto.sequelize.fn('SUM', VentaProducto.sequelize.col('total')), 'total']],
      where: { estado: 'Completado' }
    });

    // Obtener venta promedio
    const ventaPromedio = await VentaProducto.findOne({
      attributes: [[VentaProducto.sequelize.fn('AVG', VentaProducto.sequelize.col('total')), 'promedio']],
      where: { estado: 'Completado' }
    });

    return {
      totalVentas,
      ventasCompletadas,
      ventasPendientes,
      ventasCanceladas,
      totalIngresos: parseFloat(totalIngresos?.dataValues?.total || 0).toFixed(2),
      ventaPromedio: parseFloat(ventaPromedio?.dataValues?.promedio || 0).toFixed(2),
      porcentajeCompletadas: totalVentas > 0 ? ((ventasCompletadas / totalVentas) * 100).toFixed(2) : 0
    };
  }

  // Obtener productos más vendidos
  async getProductosMasVendidos(limit = 10) {
    const productosVendidos = await DetalleVentaProducto.findAll({
      attributes: [
        'id_producto',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_vendido'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_ingresos']
      ],
      include: [
        {
          model: Product,
          as: 'producto',
          attributes: ['nombre', 'precio_venta']
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
      limit
    });

    return productosVendidos;
  }
}

module.exports = new VentaProductoService();