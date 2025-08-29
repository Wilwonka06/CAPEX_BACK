const ProductCategory = require('../models/ProductCategory');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class ProductCategoryController {
  // Obtener todas las categorías de productos
  static async getAllProductCategories(req, res) {
    try {
      const categories = await ProductCategory.findAll({
        order: [['nombre', 'ASC']]
      });

      return ResponseMiddleware.success(res, 'Categorías de productos obtenidas exitosamente', categories);
    } catch (error) {
      console.error('Error al obtener categorías de productos:', error);
      return ResponseMiddleware.error(res, 'Error al obtener categorías de productos', error, 500);
    }
  }

  // Obtener categoría de producto por ID
  static async getProductCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await ProductCategory.findByPk(id);

      if (!category) {
        return ResponseMiddleware.error(res, 'Categoría de producto no encontrada', null, 404);
      }

      return ResponseMiddleware.success(res, 'Categoría de producto obtenida exitosamente', category);
    } catch (error) {
      console.error('Error al obtener categoría de producto:', error);
      return ResponseMiddleware.error(res, 'Error al obtener categoría de producto', error, 500);
    }
  }

  // Crear nueva categoría de producto
  static async createProductCategory(req, res) {
    try {
      const categoryData = req.body;
      const category = await ProductCategory.create(categoryData);

      return ResponseMiddleware.success(res, 'Categoría de producto creada exitosamente', category, 201);
    } catch (error) {
      console.error('Error al crear categoría de producto:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'Ya existe una categoría con ese nombre', null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al crear categoría de producto', error, 500);
    }
  }

  // Actualizar categoría de producto
  static async updateProductCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await ProductCategory.findByPk(id);
      if (!category) {
        return ResponseMiddleware.error(res, 'Categoría de producto no encontrada', null, 404);
      }

      await category.update(updateData);

      return ResponseMiddleware.success(res, 'Categoría de producto actualizada exitosamente', category);
    } catch (error) {
      console.error('Error al actualizar categoría de producto:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'Ya existe una categoría con ese nombre', null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al actualizar categoría de producto', error, 500);
    }
  }

  // Eliminar categoría de producto
  static async deleteProductCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await ProductCategory.findByPk(id);

      if (!category) {
        return ResponseMiddleware.error(res, 'Categoría de producto no encontrada', null, 404);
      }

      await category.destroy();

      return ResponseMiddleware.success(res, 'Categoría de producto eliminada exitosamente', null);
    } catch (error) {
      console.error('Error al eliminar categoría de producto:', error);
      return ResponseMiddleware.error(res, 'Error al eliminar categoría de producto', error, 500);
    }
  }
}

module.exports = ProductCategoryController;
