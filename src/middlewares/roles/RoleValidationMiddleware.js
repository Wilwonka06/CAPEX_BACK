const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para crear rol
const validateCreateRole = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del rol es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('permisos')
    .optional()
    .isArray()
    .withMessage('Los permisos deben ser un array')
    .custom((value) => {
      if (value && !value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('Los IDs de permisos deben ser números enteros positivos');
      }
      return true;
    }),
  
  body('privilegios')
    .optional()
    .isArray()
    .withMessage('Los privilegios deben ser un array')
    .custom((value) => {
      if (value && !value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('Los IDs de privilegios deben ser números enteros positivos');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validaciones para actualizar rol
const validateUpdateRole = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
  
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del rol no puede estar vacío')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('permisos')
    .optional()
    .isArray()
    .withMessage('Los permisos deben ser un array')
    .custom((value) => {
      if (value && !value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('Los IDs de permisos deben ser números enteros positivos');
      }
      return true;
    }),
  
  body('privilegios')
    .optional()
    .isArray()
    .withMessage('Los privilegios deben ser un array')
    .custom((value) => {
      if (value && !value.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('Los IDs de privilegios deben ser números enteros positivos');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validaciones para obtener rol por ID
const validateRoleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
  
  handleValidationErrors
];

// Validaciones para eliminar rol
const validateDeleteRole = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
  
  handleValidationErrors
];

// Validaciones para verificar permisos
const validatePermissionCheck = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
  
  body('permissionName')
    .trim()
    .notEmpty()
    .withMessage('El nombre del permiso es requerido'),
  
  handleValidationErrors
];

// Validaciones para verificar privilegios
const validatePrivilegeCheck = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),
  
  body('privilegeName')
    .trim()
    .notEmpty()
    .withMessage('El nombre del privilegio es requerido'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateRole,
  validateUpdateRole,
  validateRoleId,
  validateDeleteRole,
  validatePermissionCheck,
  validatePrivilegeCheck,
  handleValidationErrors
};
