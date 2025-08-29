const ServiceCategory = require('../models/ServiceCategory');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class ServiceCategoryController {
  // Obtener todas las categorías de servicios
  static async getAllServiceCategories(req, res) {
    try {
      const categories = await ServiceCategory.findAll({
        order: [['nombre', 'ASC']]
      });
      return ResponseMiddleware.success(res, 'Categorías de servicios obtenidas exitosamente', categories);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener categorías de servicios', error);
    }
  }

  // Obtener categoría de servicio por ID
  static async getServiceCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await ServiceCategory.findByPk(id);
      
      if (!category) {
        return ResponseMiddleware.error(res, 'Categoría de servicio no encontrada', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Categoría de servicio obtenida exitosamente', category);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener categoría de servicio', error);
    }
  }

  // Crear nueva categoría de servicio
  static async createServiceCategory(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = await ServiceCategory.create(categoryData);
      return ResponseMiddleware.success(res, 'Categoría de servicio creada exitosamente', newCategory, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear categoría de servicio', error);
    }
  }

  // Actualizar categoría de servicio
  static async updateServiceCategory(req, res) {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      const category = await ServiceCategory.findByPk(id);
      
      if (!category) {
        return ResponseMiddleware.error(res, 'Categoría de servicio no encontrada', null, 404);
      }
      
      await category.update(categoryData);
      return ResponseMiddleware.success(res, 'Categoría de servicio actualizada exitosamente', category);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar categoría de servicio', error);
    }
  }

  // Eliminar categoría de servicio
  static async deleteServiceCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await ServiceCategory.findByPk(id);
      
      if (!category) {
        return ResponseMiddleware.error(res, 'Categoría de servicio no encontrada', null, 404);
      }
      
      await category.destroy();
      return ResponseMiddleware.success(res, 'Categoría de servicio eliminada exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar categoría de servicio', error);
    }
  }
}

module.exports = ServiceCategoryController;
