const { body, param, validationResult } = require('express-validator');
const RoleService = require('../../services/roles/RoleService');

// Middleware to handle validation errors
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

// Validations for creating role
const validateCreateRole = [
  body('nombre_rol')
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('El nombre del rol debe tener entre 1 y 80 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre del rol solo puede contener letras y espacios'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('estado_rol')
    .optional()
    .isBoolean()
    .withMessage('El estado del rol debe ser un valor booleano'),
  
  body('permisos_privilegios')
    .isArray({ min: 1 })
    .withMessage('Debe proporcionar al menos un permiso+privilegio'),
  
  body('permisos_privilegios.*.id_permiso')
    .isInt({ min: 1 })
    .withMessage('ID de permiso debe ser un entero positivo'),
  
  body('permisos_privilegios.*.id_privilegio')
    .isInt({ min: 1 })
    .withMessage('ID de privilegio debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validations for updating role
const validateUpdateRole = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del rol debe ser un entero positivo'),
  
  body('nombre_rol')
    .optional()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('El nombre del rol debe tener entre 1 y 80 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre del rol solo puede contener letras y espacios'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('estado_rol')
    .optional()
    .isBoolean()
    .withMessage('El estado del rol debe ser un valor booleano'),
  
  body('permisos_privilegios')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Si se proporcionan permisos+privilegios, debe haber al menos uno'),
  
  body('permisos_privilegios.*.id_permiso')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de permiso debe ser un entero positivo'),
  
  body('permisos_privilegios.*.id_privilegio')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de privilegio debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validations for getting role by ID
const validateRoleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del rol debe ser un entero positivo'),
  
  handleValidationErrors
];

// Validations for deleting role
const validateDeleteRole = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del rol debe ser un entero positivo'),
  
  handleValidationErrors
];

// Middleware to check if role name already exists
const validateRoleNameUnique = async (req, res, next) => {
  try {
    const { nombre_rol } = req.body;
    const { id } = req.params; // For updates
    
    if (!nombre_rol) {
      return next();
    }
    
    // Check if role name already exists
    const existingRole = await RoleService.getRoleByName(nombre_rol);
    
    if (existingRole.success) {
      // If updating, check if it's the same role
      if (id && existingRole.data.id_rol === parseInt(id)) {
        return next();
      }
      
      return res.status(400).json({
        success: false,
        message: 'Ya existe un rol con ese nombre',
        error: 'ROLE_NAME_EXISTS'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar el nombre del rol',
      error: error.message
    });
  }
};

// Middleware to validate that role has at least one permission+privilege
const validateRolePermissions = async (req, res, next) => {
  try {
    const { permisos_privilegios } = req.body;
    
    if (!permisos_privilegios || !Array.isArray(permisos_privilegios) || permisos_privilegios.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El rol debe tener al menos un permiso+privilegio asociado',
        error: 'NO_PERMISSIONS_PROVIDED'
      });
    }
    
    // Validate that each permission+privilege combination is valid
    for (const permPriv of permisos_privilegios) {
      if (!permPriv.id_permiso || !permPriv.id_privilegio) {
        return res.status(400).json({
          success: false,
          message: 'Cada permiso+privilegio debe tener un ID de permiso y privilegio válidos',
          error: 'INVALID_PERMISSION_PRIVILEGE'
        });
      }
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar los permisos del rol',
      error: error.message
    });
  }
};

module.exports = {
  validateCreateRole,
  validateUpdateRole,
  validateRoleId,
  validateDeleteRole,
  validateRoleNameUnique,
  validateRolePermissions,
  handleValidationErrors
};
