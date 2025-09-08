// src/controllers/ServiceCategoryController.js
const serviceCategoryService = require('../services/ServiceCategoryService');

class ServiceCategoryController {
  async create(req, res) {
    try {
      const category = await serviceCategoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        data: category,
        message: 'Categoría creada correctamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await serviceCategoryService.getAllCategories();
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const category = await serviceCategoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoría no encontrada'
        });
      }
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getActive(req, res) {
    try {
      const categories = await serviceCategoryService.getActiveCategories();
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const categories = await serviceCategoryService.getCategoriesByStatus(status);
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const updated = await serviceCategoryService.updateCategory(req.params.id, req.body);
      res.json({
        success: true,
        data: updated,
        message: 'Categoría actualizada correctamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await serviceCategoryService.deleteCategory(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      // 👇 Si la categoría tiene servicios asociados o no existe, llega aquí
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async search(req, res) {
  try {
    const categorias = await serviceCategoryService.searchCategories(req.query);
    res.status(200).json({
      success: true,
      data: categorias,
      message: 'Categorías encontradas correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar categorías',
      error: error.message
    });
  }
}

  async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          success: false,
          error: 'Nuevo estado requerido'
        });
      }

      const category = await serviceCategoryService.changeCategoryStatus(id, estado);
      res.json({
        success: true,
        data: category,
        message: `Estado de la categoría cambiado a ${estado}`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ServiceCategoryController();