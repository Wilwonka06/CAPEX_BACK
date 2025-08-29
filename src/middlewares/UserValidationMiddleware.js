const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class UserValidationMiddleware {
  // Validación para obtener usuario por ID
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

  // Validación para crear usuario
  static validateCreate = [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('email')
      .isEmail().withMessage('El email debe tener un formato válido')
      .normalizeEmail(),
    body('username')
      .notEmpty().withMessage('El nombre de usuario es requerido')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('roleId')
      .optional()
      .isInt().withMessage('El ID de rol debe ser un número entero'),
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

  // Validación para actualizar usuario
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('email')
      .optional()
      .isEmail().withMessage('El email debe tener un formato válido')
      .normalizeEmail(),
    body('username')
      .optional()
      .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('roleId')
      .optional()
      .isInt().withMessage('El ID de rol debe ser un número entero'),
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

  // Validación para eliminar usuario
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

  // Validación para login
  static validateLogin = [
    body('email')
      .isEmail().withMessage('El email debe tener un formato válido')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es requerida'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para cambiar contraseña
  static validateChangePassword = [
    body('currentPassword')
      .notEmpty().withMessage('La contraseña actual es requerida'),
    body('newPassword')
      .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Middleware para verificar email único
  static checkUniqueEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const { id } = req.params;

      if (!email) {
        return next();
      }

      const { Usuario } = require('../models/User');
      const whereClause = { email };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingUser = await Usuario.findOne({ where: whereClause });
      
      if (existingUser) {
        return ResponseMiddleware.error(res, 'Ya existe un usuario con ese email', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar email único', error, 500);
    }
  };

  // Middleware para verificar username único
  static checkUniqueUsername = async (req, res, next) => {
    try {
      const { username } = req.body;
      const { id } = req.params;

      if (!username) {
        return next();
      }

      const { Usuario } = require('../models/User');
      const whereClause = { username };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingUser = await Usuario.findOne({ where: whereClause });
      
      if (existingUser) {
        return ResponseMiddleware.error(res, 'Ya existe un usuario con ese nombre de usuario', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar username único', error, 500);
    }
  };
}

module.exports = UserValidationMiddleware;
