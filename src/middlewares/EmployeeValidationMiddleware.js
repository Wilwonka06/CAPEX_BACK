const { body, param, query, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class EmployeeValidationMiddleware {
  // Validación para obtener empleado por ID
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

  // Validación para crear empleado
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
      .notEmpty().withMessage('El teléfono es requerido')
      .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 caracteres')
      .matches(/^[0-9+\-\s()]+$/).withMessage('Formato de teléfono inválido'),
    body('position')
      .notEmpty().withMessage('El cargo es requerido')
      .isLength({ max: 100 }).withMessage('El cargo no puede exceder 100 caracteres'),
    body('department')
      .optional()
      .isLength({ max: 100 }).withMessage('El departamento no puede exceder 100 caracteres'),
    body('salary')
      .optional()
      .isFloat({ min: 0 }).withMessage('El salario debe ser un número mayor o igual a 0'),
    body('hireDate')
      .optional()
      .isISO8601().withMessage('La fecha de contratación debe tener un formato válido'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar empleado
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
    body('position')
      .optional()
      .isLength({ max: 100 }).withMessage('El cargo no puede exceder 100 caracteres'),
    body('department')
      .optional()
      .isLength({ max: 100 }).withMessage('El departamento no puede exceder 100 caracteres'),
    body('salary')
      .optional()
      .isFloat({ min: 0 }).withMessage('El salario debe ser un número mayor o igual a 0'),
    body('hireDate')
      .optional()
      .isISO8601().withMessage('La fecha de contratación debe tener un formato válido'),
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

  // Validación para eliminar empleado
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

  // Validación para búsqueda de empleados
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

  // Middleware para verificar documento único
  static checkUniqueDocument = async (req, res, next) => {
    try {
      const { documentNumber } = req.body;
      const { id } = req.params;

      if (!documentNumber) {
        return next();
      }

      const Employee = require('../models/Employee');
      const whereClause = { documentNumber };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingEmployee = await Employee.findOne({ where: whereClause });
      
      if (existingEmployee) {
        return ResponseMiddleware.error(res, 'Ya existe un empleado con ese número de documento', null, 409);
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

      const Employee = require('../models/Employee');
      const whereClause = { email };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingEmployee = await Employee.findOne({ where: whereClause });
      
      if (existingEmployee) {
        return ResponseMiddleware.error(res, 'Ya existe un empleado con ese email', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar email único', error, 500);
    }
  };
}

module.exports = EmployeeValidationMiddleware;
