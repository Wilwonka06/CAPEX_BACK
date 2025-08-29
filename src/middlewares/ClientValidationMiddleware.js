const { body, param, query, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class ClientValidationMiddleware {
  // Validación para obtener cliente por ID
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

  // Validación para crear cliente
  static validateCreate = [
    body('documentType')
      .notEmpty().withMessage('El tipo de documento es requerido')
      .isIn(['CC', 'CE', 'TI', 'PP', 'NIT']).withMessage('Tipo de documento inválido'),
    body('documentNumber')
      .notEmpty().withMessage('El número de documento es requerido')
      .isLength({ min: 5, max: 20 }).withMessage('El número de documento debe tener entre 5 y 20 caracteres')
      .matches(/^[0-9]+$/).withMessage('El número de documento solo puede contener números'),
    body('firstName')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('lastName')
      .notEmpty().withMessage('El apellido es requerido')
      .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),
    body('email')
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Formato de email inválido')
      .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),
    body('phone')
      .optional()
      .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres')
      .matches(/^[0-9+\-\s()]+$/).withMessage('Formato de teléfono inválido'),
    body('password')
      .notEmpty().withMessage('La contraseña es requerida')
      .isLength({ min: 6, max: 255 }).withMessage('La contraseña debe tener entre 6 y 255 caracteres'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar cliente
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('documentType')
      .optional()
      .isIn(['CC', 'CE', 'TI', 'PP', 'NIT']).withMessage('Tipo de documento inválido'),
    body('documentNumber')
      .optional()
      .isLength({ min: 5, max: 20 }).withMessage('El número de documento debe tener entre 5 y 20 caracteres')
      .matches(/^[0-9]+$/).withMessage('El número de documento solo puede contener números'),
    body('firstName')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('lastName')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),
    body('email')
      .optional()
      .isEmail().withMessage('Formato de email inválido')
      .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),
    body('phone')
      .optional()
      .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres')
      .matches(/^[0-9+\-\s()]+$/).withMessage('Formato de teléfono inválido'),
    body('status')
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

  // Validación para eliminar cliente
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

  // Validación para búsqueda de clientes
  static validateSearch = [
    query('q')
      .notEmpty().withMessage('El término de búsqueda es requerido')
      .isLength({ min: 2, max: 100 }).withMessage('El término de búsqueda debe tener entre 2 y 100 caracteres'),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('La página debe ser un número entero mayor a 0'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('El límite debe ser un número entre 1 y 100'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para obtener cliente por email
  static validateGetByEmail = [
    param('email')
      .notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Formato de email inválido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para obtener cliente por documento
  static validateGetByDocument = [
    param('documentNumber')
      .notEmpty().withMessage('El número de documento es requerido')
      .isLength({ min: 5, max: 20 }).withMessage('El número de documento debe tener entre 5 y 20 caracteres')
      .matches(/^[0-9]+$/).withMessage('El número de documento solo puede contener números'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Middleware para verificar documento único
  static checkUniqueDocument = async (req, res, next) => {
    try {
      const { documentNumber } = req.body;
      const { id } = req.params;

      if (!documentNumber) {
        return next();
      }

      const Client = require('../models/clients/Client');
      const whereClause = { documentNumber };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingClient = await Client.findOne({ where: whereClause });
      
      if (existingClient) {
        return ResponseMiddleware.error(res, 'Ya existe un cliente con ese número de documento', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar documento único', error, 500);
    }
  };

  // Middleware para verificar email único
  static checkUniqueEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const { id } = req.params;

      if (!email) {
        return next();
      }

      const Client = require('../models/clients/Client');
      const whereClause = { email };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingClient = await Client.findOne({ where: whereClause });
      
      if (existingClient) {
        return ResponseMiddleware.error(res, 'Ya existe un cliente con ese email', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar email único', error, 500);
    }
  };
}

module.exports = ClientValidationMiddleware;
