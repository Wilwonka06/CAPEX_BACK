const CategoriaProducto = require('../models/CategoriaProducto');
const Producto = require('../models/Producto');
const { Op } = require('sequelize');

class CategoriaProductoService {
  // Obtener todas las categorías con paginación
  async getAllCategorias(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await CategoriaProducto.findAndCountAll({
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });
    
    return {
      categorias: rows,
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

  // Obtener categoría por ID
  async getCategoriaById(id) {
    return await CategoriaProducto.findByPk(id, {
      include: [
        {
          model: Producto,
          as: 'productos'
        }
      ]
    });
  }

  // Crear nueva categoría
  async createCategoria(categoriaData) {
    const { nombre } = categoriaData;

    // Verificar si el nombre ya existe
    const existingCategoria = await CategoriaProducto.findOne({ 
      where: { nombre } 
    });
    
    if (existingCategoria) {
      throw new Error('El nombre de la categoría ya existe');
    }

    return await CategoriaProducto.create(categoriaData);
  }

  // Actualizar categoría
  async updateCategoria(id, updateData) {
    const categoria = await CategoriaProducto.findByPk(id);
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    // Si se está actualizando el nombre, verificar que no exista
    if (updateData.nombre && updateData.nombre !== categoria.nombre) {
      const existingCategoria = await CategoriaProducto.findOne({ 
        where: { nombre: updateData.nombre } 
      });
      
      if (existingCategoria) {
        throw new Error('El nombre de la categoría ya existe');
      }
    }

    await categoria.update(updateData);
    return categoria;
  }

  // Eliminar categoría
  async deleteCategoria(id) {
    const categoria = await CategoriaProducto.findByPk(id, {
      include: [
        {
          model: Producto,
          as: 'productos'
        }
      ]
    });
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    // Verificar si hay productos asociados
    if (categoria.productos && categoria.productos.length > 0) {
      throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
    }

    await categoria.destroy();
    return { message: 'Categoría eliminada exitosamente' };
  }

  // Buscar categorías por nombre
  async searchCategorias(nombre, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await CategoriaProducto.findAndCountAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      categorias: rows,
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

  // Obtener categorías por estado
  async getCategoriasByEstado(estado, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await CategoriaProducto.findAndCountAll({
      where: { estado },
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      categorias: rows,
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

  // Obtener categorías activas
  async getCategoriasActivas(page = 1, limit = 10) {
    return await this.getCategoriasByEstado('Activo', page, limit);
  }

  // Obtener categorías inactivas
  async getCategoriasInactivas(page = 1, limit = 10) {
    return await this.getCategoriasByEstado('Inactivo', page, limit);
  }

  // Obtener estadísticas de categorías
  async getEstadisticas() {
    const totalCategorias = await CategoriaProducto.count();
    const categoriasActivas = await CategoriaProducto.count({ where: { estado: 'Activo' } });
    const categoriasInactivas = await CategoriaProducto.count({ where: { estado: 'Inactivo' } });

    // Obtener categorías con productos
    const categoriasConProductos = await CategoriaProducto.findAll({
      include: [
        {
          model: Producto,
          as: 'productos'
        }
      ]
    });

    const categoriasConProductosCount = categoriasConProductos.filter(
      categoria => categoria.productos && categoria.productos.length > 0
    ).length;

    return {
      totalCategorias,
      categoriasActivas,
      categoriasInactivas,
      categoriasConProductos: categoriasConProductosCount,
      porcentajeActivas: totalCategorias > 0 ? ((categoriasActivas / totalCategorias) * 100).toFixed(2) : 0,
      porcentajeConProductos: totalCategorias > 0 ? ((categoriasConProductosCount / totalCategorias) * 100).toFixed(2) : 0
    };
  }
}

module.exports = new CategoriaProductoService();