const Pedido = require('../../models/salesProducts/Order');
const DetallePedido = require('../../models/salesProducts/OrderDetail');
const Product = require('../../models/Product');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class PedidoService {
  // Obtener todos los pedidos con paginación
  async getAllPedidos(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Pedido.findAndCountAll({
      include: [
        {
          model: DetallePedido,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['id_producto', 'nombre', 'precio_venta', 'url_foto']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha_creacion', 'DESC']]
    });
    
    return {
      pedidos: rows,
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

  // Obtener pedido por ID
  async getPedidoById(id) {
    return await Pedido.findByPk(id, {
      include: [
        {
          model: DetallePedido,
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
  }

  // Crear nuevo pedido
  async createPedido(pedidoData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { fecha, productos } = pedidoData;

      // Validar que hay productos
      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw new Error('El pedido debe tener al menos un producto');
      }

      // Crear el pedido
      const nuevoPedido = await Pedido.create({
        fecha,
        total: 0,
        estado: 'Pendiente'
      }, { transaction });

      let totalGeneral = 0;

      // Crear los detalles del pedido
      for (const item of productos) {
        const { id_producto, cantidad, precio_unitario } = item;

        // Validar que el producto existe
        const producto = await Product.findByPk(id_producto);
        if (!producto) {
          throw new Error(`El producto con ID ${id_producto} no existe`);
        }

        const subtotal = cantidad * precio_unitario;
        totalGeneral += subtotal;

        await DetallePedido.create({
          id_pedido: nuevoPedido.id_pedido,
          id_producto,
          cantidad,
          precio_unitario,
          subtotal
        }, { transaction });
      }

      // Actualizar el total del pedido
      await nuevoPedido.update({ total: totalGeneral }, { transaction });

      await transaction.commit();

      // Retornar el pedido completo
      return await this.getPedidoById(nuevoPedido.id_pedido);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Actualizar pedido
  async updatePedido(id, updateData) {
    const transaction = await sequelize.transaction();
    
    try {
      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }

      const { fecha, estado, productos } = updateData;

      // Actualizar datos básicos del pedido
      const updateFields = {};
      if (fecha) updateFields.fecha = fecha;
      if (estado) updateFields.estado = estado;

      await pedido.update(updateFields, { transaction });

      // Si se proporcionan productos, actualizar detalles
      if (productos && Array.isArray(productos)) {
        // Eliminar detalles existentes
        await DetallePedido.destroy({ 
          where: { id_pedido: id }, 
          transaction 
        });

        let totalGeneral = 0;

        // Crear nuevos detalles
        for (const item of productos) {
          const { id_producto, cantidad, precio_unitario } = item;

          // Validar que el producto existe
          const producto = await Product.findByPk(id_producto);
          if (!producto) {
            throw new Error(`El producto con ID ${id_producto} no existe`);
          }

          const subtotal = cantidad * precio_unitario;
          totalGeneral += subtotal;

          await DetallePedido.create({
            id_pedido: id,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
          }, { transaction });
        }

        // Actualizar el total
        await pedido.update({ total: totalGeneral }, { transaction });
      }

      await transaction.commit();
      return await this.getPedidoById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Eliminar pedido
  async deletePedido(id) {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    await pedido.destroy();
    return { message: 'Pedido eliminado exitosamente' };
  }

  // Búsqueda global en pedidos
  async searchPedidos(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Construir condiciones de búsqueda para múltiples campos
    const whereCondition = {
      [Op.or]: [
        // Buscar por ID del pedido
        sequelize.where(
          sequelize.cast(sequelize.col('Pedido.id_pedido'), 'CHAR'),
          { [Op.like]: `%${searchTerm}%` }
        ),
        // Buscar por estado
        { estado: { [Op.like]: `%${searchTerm}%` } },
        // Buscar por total (convertido a string)
        sequelize.where(
          sequelize.cast(sequelize.col('Pedido.total'), 'CHAR'),
          { [Op.like]: `%${searchTerm}%` }
        ),
        // Buscar por fecha (convertida a string)
        sequelize.where(
          sequelize.cast(sequelize.col('Pedido.fecha'), 'CHAR'),
          { [Op.like]: `%${searchTerm}%` }
        )
      ]
    };

    const { count, rows } = await Pedido.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: DetallePedido,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              where: {
                [Op.or]: [
                  { nombre: { [Op.like]: `%${searchTerm}%` } }
                ]
              },
              required: false // LEFT JOIN para que no excluya pedidos sin productos que coincidan
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
      pedidos: rows,
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

  // Obtener pedidos por estado
  async getPedidosByEstado(estado, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Pedido.findAndCountAll({
      where: { estado },
      include: [
        {
          model: DetallePedido,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['id_producto', 'nombre', 'precio_venta']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha_creacion', 'DESC']]
    });

    return {
      pedidos: rows,
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

  // Cambiar estado del pedido
  async cambiarEstadoPedido(id, nuevoEstado) {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    await pedido.update({ estado: nuevoEstado });
    return await this.getPedidoById(id);
  }

  // Obtener estadísticas de pedidos
  async getEstadisticas() {
    const totalPedidos = await Pedido.count();
    const pedidosPendientes = await Pedido.count({ where: { estado: 'Pendiente' } });
    const pedidosEnProceso = await Pedido.count({ where: { estado: 'En proceso' } });
    const pedidosEntregados = await Pedido.count({ where: { estado: 'Entregado' } });
    const pedidosCancelados = await Pedido.count({ where: { estado: 'Cancelado' } });
    
    // Total en ventas (solo pedidos entregados)
    const totalVentas = await Pedido.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('total')), 'total']],
      where: { estado: 'Entregado' }
    });

    return {
      totalPedidos,
      pedidosPendientes,
      pedidosEnProceso,
      pedidosEntregados,
      pedidosCancelados,
      totalVentas: parseFloat(totalVentas?.dataValues?.total || 0).toFixed(2),
      porcentajeEntregados: totalPedidos > 0 ? ((pedidosEntregados / totalPedidos) * 100).toFixed(2) : 0
    };
  }

  // Obtener pedidos por rango de fechas
  async getPedidosByFechas(fechaInicio, fechaFin, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Pedido.findAndCountAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [
        {
          model: DetallePedido,
          as: 'detalles',
          include: [
            {
              model: Product,
              as: 'producto',
              attributes: ['id_producto', 'nombre', 'precio_venta']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['fecha', 'DESC']]
    });

    return {
      pedidos: rows,
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
}

module.exports = new PedidoService();