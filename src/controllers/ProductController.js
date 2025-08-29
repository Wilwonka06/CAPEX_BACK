const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class ProductController {
  // Obtener todos los productos
  static async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, categoria, activo } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (categoria) whereClause.categoria_id = categoria;
      if (activo !== undefined) whereClause.activo = activo === 'true';

      const products = await Product.findAndCountAll({
        where: whereClause,
        include: [{
          model: ProductCategory,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      const totalPages = Math.ceil(products.count / limit);

      return ResponseMiddleware.success(res, 'Productos obtenidos exitosamente', {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return ResponseMiddleware.error(res, 'Error al obtener productos', error, 500);
    }
  }

  // Obtener producto por ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{
          model: ProductCategory,
          as: 'categoria',
          attributes: ['id', 'nombre', 'descripcion']
        }]
      });

      if (!product) {
        return ResponseMiddleware.error(res, 'Producto no encontrado', null, 404);
      }

      return ResponseMiddleware.success(res, 'Producto obtenido exitosamente', product);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return ResponseMiddleware.error(res, 'Error al obtener producto', error, 500);
    }
  }

  // Crear nuevo producto
  static async createProduct(req, res) {
    try {
      const productData = req.body;
      const product = await Product.create(productData);

      const productWithCategory = await Product.findByPk(product.id, {
        include: [{
          model: ProductCategory,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }]
      });

      return ResponseMiddleware.success(res, 'Producto creado exitosamente', productWithCategory, 201);
    } catch (error) {
      console.error('Error al crear producto:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'Ya existe un producto con ese nombre', null, 409);
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return ResponseMiddleware.error(res, 'La categoría especificada no existe', null, 400);
      }

      return ResponseMiddleware.error(res, 'Error al crear producto', error, 500);
    }
  }

  // Actualizar producto
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return ResponseMiddleware.error(res, 'Producto no encontrado', null, 404);
      }

      await product.update(updateData);

      const updatedProduct = await Product.findByPk(id, {
        include: [{
          model: ProductCategory,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }]
      });

      return ResponseMiddleware.success(res, 'Producto actualizado exitosamente', updatedProduct);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'Ya existe un producto con ese nombre', null, 409);
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return ResponseMiddleware.error(res, 'La categoría especificada no existe', null, 400);
      }

      return ResponseMiddleware.error(res, 'Error al actualizar producto', error, 500);
    }
  }

  // Eliminar producto
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return ResponseMiddleware.error(res, 'Producto no encontrado', null, 404);
      }

      await product.destroy();

      return ResponseMiddleware.success(res, 'Producto eliminado exitosamente', null);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return ResponseMiddleware.error(res, 'Error al eliminar producto', error, 500);
    }
  }

  // Obtener productos por categoría
  static async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const products = await Product.findAndCountAll({
        where: { categoria_id: categoryId },
        include: [{
          model: ProductCategory,
          as: 'categoria',
          attributes: ['id', 'nombre']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      const totalPages = Math.ceil(products.count / limit);

      return ResponseMiddleware.success(res, 'Productos por categoría obtenidos exitosamente', {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return ResponseMiddleware.error(res, 'Error al obtener productos por categoría', error, 500);
    }
  }
}

module.exports = ProductController;
