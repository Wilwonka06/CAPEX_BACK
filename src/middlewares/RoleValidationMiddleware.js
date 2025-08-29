const { body, param, validationResult } = require('express-validator');
const ResponseMiddleware = require('./ResponseMiddleware');

class RoleValidationMiddleware {
  // Validación para obtener rol por ID
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

  // Validación para crear rol
  static validateCreate = [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('descripcion')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('permisos')
      .optional()
      .isArray().withMessage('Los permisos deben ser un array'),
    body('privilegios')
      .optional()
      .isArray().withMessage('Los privilegios deben ser un array'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para actualizar rol
  static validateUpdate = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
    body('descripcion')
      .optional()
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('estado')
      .optional()
      .isIn(['activo', 'inactivo']).withMessage('El estado debe ser activo o inactivo'),
    body('permisos')
      .optional()
      .isArray().withMessage('Los permisos deben ser un array'),
    body('privilegios')
      .optional()
      .isArray().withMessage('Los privilegios deben ser un array'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseMiddleware.error(res, 'Error de validación', errors.array(), 400);
      }
      next();
    }
  ];

  // Validación para eliminar rol
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

  // Middleware para verificar nombre único de rol
  static checkUniqueRoleName = async (req, res, next) => {
    try {
      const { nombre } = req.body;
      const { id } = req.params;

      if (!nombre) {
        return next();
      }

      const { Role } = require('../models/roles');
      const whereClause = { nombre };
      
      if (id) {
        whereClause.id_rol = { [require('sequelize').Op.ne]: id };
      }

      const existingRole = await Role.findOne({ where: whereClause });
      
      if (existingRole) {
        return ResponseMiddleware.error(res, 'Ya existe un rol con ese nombre', null, 409);
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al verificar nombre único', error, 500);
    }
  };

  // Middleware para validar permisos de rol
  static validateRolePermissions = async (req, res, next) => {
    try {
      const { permisos, privilegios } = req.body;

      if (permisos && Array.isArray(permisos)) {
        const { Permission } = require('../models/roles');
        for (const permisoId of permisos) {
          const permiso = await Permission.findByPk(permisoId);
          if (!permiso) {
            return ResponseMiddleware.error(res, `Permiso con ID ${permisoId} no encontrado`, null, 400);
          }
        }
      }

      if (privilegios && Array.isArray(privilegios)) {
        const { Privilege } = require('../models/roles');
        for (const privilegioId of privilegios) {
          const privilegio = await Privilege.findByPk(privilegioId);
          if (!privilegio) {
            return ResponseMiddleware.error(res, `Privilegio con ID ${privilegioId} no encontrado`, null, 400);
          }
        }
      }

      next();
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al validar permisos y privilegios', error, 500);
    }
  };
}

module.exports = RoleValidationMiddleware;
