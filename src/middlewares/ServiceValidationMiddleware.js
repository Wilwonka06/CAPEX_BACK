const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class ServiceValidationMiddleware {
  // Validación para obtener servicio por ID
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

  // Validación para crear servicio
  static validateCreate = [
    body('name')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('price')
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0')
      .notEmpty().withMessage('El precio es requerido'),
    body('duration')
      .optional()
      .isInt({ min: 1 }).withMessage('La duración debe ser un número entero mayor a 0'),
    body('categoryId')
      .isInt().withMessage('El ID de la categoría debe ser un número entero')
      .notEmpty().withMessage('El ID de la categoría es requerido'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('El estado activo debe ser un valor booleano'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar servicio
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('description')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
    body('duration')
      .optional()
      .isInt({ min: 1 }).withMessage('La duración debe ser un número entero mayor a 0'),
    body('categoryId')
      .optional()
      .isInt().withMessage('El ID de la categoría debe ser un número entero'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('El estado activo debe ser un valor booleano'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para eliminar servicio
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

  // Middleware para verificar nombre único de servicio
  static checkUniqueServiceName = async (req, res, next) => {
    try {
      const { name } = req.body;
      const { id } = req.params;

      if (!name) {
        return next();
      }

      const Service = require('../models/Service');
      const whereClause = { name };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingService = await Service.findOne({ where: whereClause });
      
      if (existingService) {
        return ResponseMiddleware.error(res, 'Ya existe un servicio con ese nombre', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar nombre único', error, 500);
    }
  };

  // Middleware para verificar que la categoría existe
  static checkCategoryExists = async (req, res, next) => {
    try {
      const { categoryId } = req.body;

      if (!categoryId) {
        return next();
      }

      const ServiceCategory = require('../models/ServiceCategory');
      const category = await ServiceCategory.findByPk(categoryId);
      
      if (!category) {
        return ResponseMiddleware.error(res, 'La categoría especificada no existe', null, 400);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar categoría', error, 500);
    }
  };
}

module.exports = ServiceValidationMiddleware;
