const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class CharacteristicValidationMiddleware {
  // Validación para obtener característica por ID
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

  // Validación para crear característica
  static validateCreate = [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('descripcion')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('tipo')
      .isIn(['texto', 'numero', 'booleano', 'fecha', 'lista']).withMessage('El tipo debe ser texto, numero, booleano, fecha o lista'),
    body('valores')
      .optional()
      .isArray().withMessage('Los valores deben ser un array'),
    body('valores.*')
      .optional()
      .isString().withMessage('Cada valor debe ser una cadena de texto'),
    body('requerido')
      .optional()
      .isBoolean().withMessage('El campo requerido debe ser un booleano'),
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

  // Validación para actualizar característica
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/).withMessage('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos'),
    body('descripcion')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('tipo')
      .optional()
      .isIn(['texto', 'numero', 'booleano', 'fecha', 'lista']).withMessage('El tipo debe ser texto, numero, booleano, fecha o lista'),
    body('valores')
      .optional()
      .isArray().withMessage('Los valores deben ser un array'),
    body('valores.*')
      .optional()
      .isString().withMessage('Cada valor debe ser una cadena de texto'),
    body('requerido')
      .optional()
      .isBoolean().withMessage('El campo requerido debe ser un booleano'),
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

  // Validación para eliminar característica
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

  // Middleware para verificar nombre único de característica
  static checkUniqueCharacteristicName = async (req, res, next) => {
    try {
      const { nombre } = req.body;
      const { id } = req.params;

      if (!nombre) {
        return next();
      }

      const Characteristic = require('../models/Characteristic');
      const whereClause = { nombre };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingCharacteristic = await Characteristic.findOne({ where: whereClause });
      
      if (existingCharacteristic) {
        return ResponseMiddleware.error(res, 'Ya existe una característica con ese nombre', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar nombre único', error, 500);
    }
  };

  // Middleware para validar valores según el tipo
  static validateValuesByType = (req, res, next) => {
    const { tipo, valores } = req.body;

    if (tipo === 'lista' && (!valores || !Array.isArray(valores) || valores.length === 0)) {
      return ResponseMiddleware.error(res, 'Las características de tipo lista deben tener al menos un valor', null, 400);
    }

    if (tipo !== 'lista' && valores && valores.length > 0) {
      return ResponseMiddleware.error(res, 'Solo las características de tipo lista pueden tener valores predefinidos', null, 400);
    }

    next();
  };
}

module.exports = CharacteristicValidationMiddleware;
