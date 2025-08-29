const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class UserRoleValidationMiddleware {
  // Validación para obtener rol de usuario por ID
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

  // Validación para crear rol de usuario
  static validateCreate = [
    body('id_usuario')
      .isInt().withMessage('El ID de usuario debe ser un número entero'),
    body('id_rol')
      .isInt().withMessage('El ID de rol debe ser un número entero'),
    body('fecha_asignacion')
      .optional()
      .isISO8601().withMessage('La fecha de asignación debe tener un formato válido'),
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

  // Validación para actualizar rol de usuario
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('id_usuario')
      .optional()
      .isInt().withMessage('El ID de usuario debe ser un número entero'),
    body('id_rol')
      .optional()
      .isInt().withMessage('El ID de rol debe ser un número entero'),
    body('fecha_asignacion')
      .optional()
      .isISO8601().withMessage('La fecha de asignación debe tener un formato válido'),
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

  // Validación para eliminar rol de usuario
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

  // Middleware para verificar que el usuario existe
  static checkUserExists = async (req, res, next) => {
    try {
      const { id_usuario } = req.body;

      if (!id_usuario) {
        return next();
      }

      const { Usuario } = require('../models/User');
      const user = await Usuario.findByPk(id_usuario);
      
      if (!user) {
        return ResponseMiddleware.error(res, 'El usuario especificado no existe', null, 400);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar usuario', error, 500);
    }
  };

  // Middleware para verificar que el rol existe
  static checkRoleExists = async (req, res, next) => {
    try {
      const { id_rol } = req.body;

      if (!id_rol) {
        return next();
      }

      const { Role } = require('../models/roles');
      const role = await Role.findByPk(id_rol);
      
      if (!role) {
        return ResponseMiddleware.error(res, 'El rol especificado no existe', null, 400);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar rol', error, 500);
    }
  };

  // Middleware para verificar asignación única
  static checkUniqueAssignment = async (req, res, next) => {
    try {
      const { id_usuario, id_rol } = req.body;
      const { id } = req.params;

      if (!id_usuario || !id_rol) {
        return next();
      }

      const UserRole = require('../models/UserRole');
      const whereClause = { id_usuario, id_rol };
      
      if (id) {
        whereClause.id = { [require('sequelize').Op.ne]: id };
      }

      const existingAssignment = await UserRole.findOne({ where: whereClause });
      
      if (existingAssignment) {
        return ResponseMiddleware.error(res, 'El usuario ya tiene asignado este rol', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar asignación única', error, 500);
    }
  };
}

module.exports = UserRoleValidationMiddleware;
