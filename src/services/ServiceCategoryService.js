// src/services/ServiceCategoryService.js
const ServiceCategory = require('../models/ServiceCategory');
const Services = require('../models/Services'); // 👈 Importamos Services
const { Op } = require('sequelize');

class ServiceCategoryService {
  async createCategory(categoryData) {
    try {
      return await ServiceCategory.create(categoryData);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una categoría con ese nombre');
      }
      throw error;
    }
  }

  async getAllCategories() {
    return await ServiceCategory.findAll({
      order: [['nombre', 'ASC']]
    });
  }

  async getCategoryById(id_categoria_servicio) {
    return await ServiceCategory.findByPk(id_categoria_servicio);
  }

  async getActiveCategories() {
    return await ServiceCategory.findAll({
      where: { estado: 'Activo' },
      order: [['nombre', 'ASC']]
    });
  }

  async getCategoriesByStatus(estado) {
    return await ServiceCategory.findAll({
      where: { estado },
      order: [['nombre', 'ASC']]
    });
  }

  async updateCategory(id_categoria_servicio, categoryData) {
    const category = await ServiceCategory.findByPk(id_categoria_servicio);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    try {
      return await category.update(categoryData);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Ya existe una categoría con ese nombre');
      }
      throw error;
    }
  }

  async deleteCategory(id_categoria_servicio) {
    // 1. Buscar categoría
    const category = await ServiceCategory.findByPk(id_categoria_servicio);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    // 2. Verificar si tiene servicios asociados
    const serviciosAsociados = await Services.findOne({
      where: { id_categoria_servicio }
    });

    if (serviciosAsociados) {
      throw new Error('No se puede eliminar la categoría porque tiene servicios asociados');
    }

    // 3. Eliminar
    await category.destroy();
    return { message: 'Categoría eliminada correctamente' };
  }

  // async searchCategories(searchTerm) {
  //   return await ServiceCategory.findAll({
  //     where: {
  //       [Op.or]: [
  //         { nombre: { [Op.like]: `%${searchTerm}%` } },
  //         { descripcion: { [Op.like]: `%${searchTerm}%` } }
  //       ]
  //     },
  //     order: [['nombre', 'ASC']]
  //   });
  // }

  async changeCategoryStatus(id_categoria_servicio, nuevoEstado) {
    const category = await ServiceCategory.findByPk(id_categoria_servicio);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    await category.update({ estado: nuevoEstado });
    return category;
  }

  async getCategoryByName(nombre) {
    return await ServiceCategory.findOne({
      where: { nombre }
    });
  }

  async searchCategories(filters) {
    const { nombre, estado } = filters;
    let where = {};

    if (nombre) {
      where.nombre = { [Op.like]: `%${nombre}%` };
    }

    if (estado) {
      where.estado = estado;
    }

    return await ServiceCategory.findAll({
      where,
      order: [['nombre', 'ASC']]
    });
  }

  async checkCategoryExists(id_categoria_servicio) {
    const category = await ServiceCategory.findByPk(id_categoria_servicio);
    return category !== null;
  }
}

module.exports = new ServiceCategoryService();