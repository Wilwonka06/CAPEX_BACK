const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class ProductValidationMiddleware {
  // Validación para obtener producto por ID
  static validateGetById = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para crear producto
  static validateCreate = [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('descripcion')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('precio')
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock')
      .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    body('categoria_id')
      .isInt().withMessage('El ID de categoría debe ser un número entero'),
    body('activo')
      .optional()
      .isBoolean().withMessage('El campo activo debe ser un booleano'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar producto
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('descripcion')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('precio')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock')
      .optional()
      .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
    body('categoria_id')
      .optional()
      .isInt().withMessage('El ID de categoría debe ser un número entero'),
    body('activo')
      .optional()
      .isBoolean().withMessage('El campo activo debe ser un booleano'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para eliminar producto
  static validateDelete = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Middleware para verificar nombre único de producto
  static checkUniqueProductName = async (req, res, next) => {
    try {
      const { nombre } = req.body;
      const { id } = req.params;

      if (!nombre) {
        return next();
      }

      const Product = require('../models/Product');
      const whereClause = { nombre };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingProduct = await Product.findOne({ where: whereClause });
      
      if (existingProduct) {
        return ResponseMiddleware.error(res, 'Ya existe un producto con ese nombre', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar nombre único', error, 500);
    }
  };

  // Middleware para verificar que la categoría existe
  static checkCategoryExists = async (req, res, next) => {
    try {
      const { categoria_id } = req.body;

      if (!categoria_id) {
        return next();
      }

      const ProductCategory = require('../models/ProductCategory');
      const category = await ProductCategory.findByPk(categoria_id);
      
      if (!category) {
        return ResponseMiddleware.error(res, 'La categoría especificada no existe', null, 400);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar categoría', error, 500);
    }
  };
}

module.exports = ProductValidationMiddleware;
