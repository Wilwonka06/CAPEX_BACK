const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class SupplierValidationMiddleware {
  // Validación para obtener proveedor por ID
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

  // Validación para crear proveedor
  static validateCreate = [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('documento')
      .notEmpty().withMessage('El documento es requerido')
      .isLength({ min: 8, max: 20 }).withMessage('El documento debe tener entre 8 y 20 caracteres'),
    body('email')
      .isEmail().withMessage('El email debe tener un formato válido')
      .normalizeEmail(),
    body('telefono')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono debe contener solo números, espacios, guiones, paréntesis y el símbolo +'),
    body('direccion')
      .optional()
      .isLength({ max: 200 }).withMessage('La dirección no puede exceder 200 caracteres'),
    body('estado')
      .optional()
      .isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar proveedor
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('documento')
      .optional()
      .isLength({ min: 8, max: 20 }).withMessage('El documento debe tener entre 8 y 20 caracteres'),
    body('email')
      .optional()
      .isEmail().withMessage('El email debe tener un formato válido')
      .normalizeEmail(),
    body('telefono')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono debe contener solo números, espacios, guiones, paréntesis y el símbolo +'),
    body('direccion')
      .optional()
      .isLength({ max: 200 }).withMessage('La dirección no puede exceder 200 caracteres'),
    body('estado')
      .optional()
      .isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para eliminar proveedor
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

  // Middleware para verificar documento único de proveedor
  static checkUniqueDocument = async (req, res, next) => {
    try {
      const { documento } = req.body;
      const { id } = req.params;

      if (!documento) {
        return next();
      }

      const Supplier = require('../models/Supplier');
      const whereClause = { documento };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingSupplier = await Supplier.findOne({ where: whereClause });
      
      if (existingSupplier) {
        return ResponseMiddleware.error(res, 'Ya existe un proveedor con ese documento', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar documento único', error, 500);
    }
  };

  // Middleware para verificar email único de proveedor
  static checkUniqueEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const { id } = req.params;

      if (!email) {
        return next();
      }

      const Supplier = require('../models/Supplier');
      const whereClause = { email };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingSupplier = await Supplier.findOne({ where: whereClause });
      
      if (existingSupplier) {
        return ResponseMiddleware.error(res, 'Ya existe un proveedor con ese email', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar email único', error, 500);
    }
  };
}

module.exports = SupplierValidationMiddleware;
