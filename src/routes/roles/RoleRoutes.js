const express = require('express');
const router = express.Router();
const RoleController = require('../../controllers/roles/RoleController');
const {
  validateCreateRole,
  validateUpdateRole,
  validateRoleId,
  validateDeleteRole,
  validateRoleStateChange,
  validateRoleNameUnique,
  validateRolePermissions
} = require('../../middlewares/roles/RoleValidationMiddleware');
const {
  authenticateToken,
  requirePermission
} = require('../../middlewares/AuthMiddleware');

// ===== RUTAS DE CONSULTA DE PERMISOS Y PRIVILEGIOS =====
// IMPORTANTE: Estas rutas deben ir ANTES de /:id para evitar conflictos

// GET /api/roles/permisos - Obtener todos los permisos
router.get('/permisos', 
  authenticateToken,
  requirePermission('read'),
  RoleController.getAllPermissions
);

// GET /api/roles/privilegios - Obtener todos los privilegios
router.get('/privilegios', 
  authenticateToken,
  requirePermission('read'),
  RoleController.getAllPrivileges
);

// GET /api/roles/all - Obtener todos los roles (incluyendo inactivos)
router.get('/all', 
  authenticateToken,
  requirePermission('read'),
  RoleController.getAllRolesWithInactive
);

// ===== RUTAS BÁSICAS DE ROLES =====

// GET /api/roles - Obtener todos los roles
router.get('/', 
  authenticateToken,
  requirePermission('read'),
  RoleController.getAllRoles
);

// GET /api/roles/:id - Obtener rol por ID
router.get('/:id', 
  authenticateToken,
  requirePermission('read'),
  validateRoleId,
  RoleController.getRoleById
);

// POST /api/roles - Crear nuevo rol
router.post('/', 
  authenticateToken,
  requirePermission('create'),
  validateCreateRole,
  validateRoleNameUnique,
  validateRolePermissions,
  RoleController.createRole
);

// PUT /api/roles/:id - Actualizar rol
router.put('/:id', 
  authenticateToken,
  requirePermission('update'),
  validateRoleId,
  validateUpdateRole,
  validateRoleNameUnique,
  RoleController.updateRole
);

// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', 
  authenticateToken,
  requirePermission('delete'),
  validateRoleId,
  validateDeleteRole,
  RoleController.deleteRole
);

// DELETE /api/roles/:id/permanent - Eliminar rol permanentemente
router.delete('/:id/permanent', 
  authenticateToken,
  requirePermission('delete'),
  validateRoleId,
  validateDeleteRole,
  RoleController.hardDeleteRole
);

// PATCH /api/roles/:id/activate - Activar rol
router.patch('/:id/activate', 
  authenticateToken,
  requirePermission('update'),
  validateRoleId,
  validateRoleStateChange,
  RoleController.activateRole
);

// PATCH /api/roles/:id/deactivate - Desactivar rol
router.patch('/:id/deactivate', 
  authenticateToken,
  requirePermission('update'),
  validateRoleId,
  validateRoleStateChange,
  RoleController.deactivateRole
);

module.exports = router;
