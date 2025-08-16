const Producto = require('../models/Producto');
const FichaTecnica = require('../models/FichaTecnica');
const Caracteristica = require('../models/Caracteristica');
const { Op } = require('sequelize');

class ProductoService {
  // Obtener todos los productos con paginación
  async getAllProductos(page = 1, limit = 10, includeCaracteristicas = true) {
    const offset = (page - 1) * limit;
    
    const options = {
      limit,
      offset,
      order: [['nombre', 'ASC']]
    };

    if (includeCaracteristicas) {
      options.include = [
        {
          model: Caracteristica,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ];
    }

    const { count, rows } = await Producto.findAndCountAll(options);
    
    return {
      productos: rows,
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

  // Obtener producto por ID
  async getProductoById(id, includeCaracteristicas = true) {
    const options = { where: { id_producto: id } };
    
    if (includeCaracteristicas) {
      options.include = [
        {
          model: Caracteristica,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ];
    }

    return await Producto.findOne(options);
  }

  // Crear nuevo producto
  async createProducto(productoData) {
    const { caracteristicas, ...productoInfo } = productoData;

    // Verificar si el nombre ya existe
    const existingProducto = await Producto.findOne({ 
      where: { nombre: productoInfo.nombre } 
    });
    
    if (existingProducto) {
      throw new Error('El nombre del producto ya existe');
    }

    // Crear el producto
    const newProducto = await Producto.create(productoInfo);

    // Agregar características si se proporcionan
    if (caracteristicas && Array.isArray(caracteristicas)) {
      await this.addCaracteristicasToProducto(newProducto.id_producto, caracteristicas);
    }

    // Retornar el producto completo con características
    return await this.getProductoById(newProducto.id_producto);
  }

  // Actualizar producto
  async updateProducto(id, updateData) {
    const { caracteristicas, ...productoInfo } = updateData;
    
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Verificar si el nuevo nombre ya existe (si se está actualizando)
    if (productoInfo.nombre && productoInfo.nombre !== producto.nombre) {
      const existingProducto = await Producto.findOne({ 
        where: { nombre: productoInfo.nombre } 
      });
      
      if (existingProducto) {
        throw new Error('El nombre del producto ya existe');
      }
    }

    // Actualizar el producto
    await producto.update(productoInfo);

    // Actualizar características si se proporcionan
    if (caracteristicas && Array.isArray(caracteristicas)) {
      await this.updateCaracteristicasOfProducto(id, caracteristicas);
    }

    // Retornar el producto actualizado
    return await this.getProductoById(id);
  }

  // Eliminar producto
  async deleteProducto(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await producto.destroy();
    return { message: 'Producto eliminado exitosamente' };
  }

  // Buscar productos por nombre
  async searchProductos(nombre, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Producto.findAndCountAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        {
          model: Caracteristica,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ],
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      productos: rows,
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

  // Filtrar productos
  async filterProductos(filters, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Aplicar filtros
    if (filters.categoria) {
      whereClause.id_categoria_producto = filters.categoria;
    }

    if (filters.precio_min || filters.precio_max) {
      whereClause.precio_venta = {};
      if (filters.precio_min) whereClause.precio_venta[Op.gte] = filters.precio_min;
      if (filters.precio_max) whereClause.precio_venta[Op.lte] = filters.precio_max;
    }

    if (filters.stock_min) {
      whereClause.stock = { [Op.gte]: filters.stock_min };
    }

    const { count, rows } = await Producto.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Caracteristica,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ],
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      productos: rows,
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

  // Agregar características a un producto
  async addCaracteristicasToProducto(productoId, caracteristicas) {
    for (const caracteristica of caracteristicas) {
      if (caracteristica.id_caracteristica && caracteristica.valor) {
        await FichaTecnica.create({
          id_producto: productoId,
          id_caracteristica: caracteristica.id_caracteristica,
          valor: caracteristica.valor
        });
      }
    }
  }

  // Actualizar características de un producto
  async updateCaracteristicasOfProducto(productoId, caracteristicas) {
    // Eliminar características existentes
    await FichaTecnica.destroy({ where: { id_producto: productoId } });
    
    // Agregar nuevas características
    await this.addCaracteristicasToProducto(productoId, caracteristicas);
  }

  // Obtener productos con bajo stock
  async getProductosBajoStock(limite = 10) {
    return await Producto.findAll({
      where: {
        stock: {
          [Op.lte]: limite
        }
      },
      include: [
        {
          model: Caracteristica,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ],
      order: [['stock', 'ASC']]
    });
  }

  // Actualizar stock de un producto
  async updateStock(productoId, cantidad) {
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) {
      throw new Error('No hay suficiente stock disponible');
    }

    await producto.update({ stock: nuevoStock });
    return producto;
  }

  // Obtener estadísticas de productos
  async getEstadisticas() {
    const totalProductos = await Producto.count();
    const productosSinStock = await Producto.count({ where: { stock: 0 } });
    const productosBajoStock = await Producto.count({ where: { stock: { [Op.lte]: 10 } } });
    
    const precioPromedio = await Producto.findOne({
      attributes: [[Producto.sequelize.fn('AVG', Producto.sequelize.col('precio_venta')), 'promedio']]
    });

    return {
      totalProductos,
      productosSinStock,
      productosBajoStock,
      precioPromedio: parseFloat(precioPromedio?.dataValues?.promedio || 0).toFixed(2)
    };
  }
}

module.exports = new ProductoService();
