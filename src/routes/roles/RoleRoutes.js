const express = require('express');
const router = express.Router();
const RoleController = require('../../controllers/roles/RoleController');
const {
  validateCreateRole,
  validateUpdateRole,
  validateRoleId,
  validateDeleteRole
} = require('../../middlewares/roles/RoleValidationMiddleware');
const {
  authenticateToken,
  requirePermission
} = require('../../middlewares/AuthMiddleware');

// GET /api/roles - Get all roles
router.get('/', 
  authenticateToken,
  requirePermission('read'),
  RoleController.getAllRoles
);

// GET /api/roles/:id - Get role by ID
router.get('/:id', 
  authenticateToken,
  requirePermission('read'),
  validateRoleId,
  RoleController.getRoleById
);

// POST /api/roles - Create new role
router.post('/', 
  authenticateToken,
  requirePermission('create'),
  validateCreateRole,
  RoleController.createRole
);

// PUT /api/roles/:id - Update role
router.put('/:id', 
  authenticateToken,
  requirePermission('update'),
  validateUpdateRole,
  RoleController.updateRole
);

// DELETE /api/roles/:id - Delete role
router.delete('/:id', 
  authenticateToken,
  requirePermission('delete'),
  validateDeleteRole,
  RoleController.deleteRole
);

// GET /api/roles/:id/permissions - Get role permissions
router.get('/:id/permissions', 
  authenticateToken,
  requirePermission('read'),
  validateRoleId,
  RoleController.getRolePermissions
);

// GET /api/roles/:id/privileges - Get role privileges
router.get('/:id/privileges', 
  authenticateToken,
  requirePermission('read'),
  validateRoleId,
  RoleController.getRolePrivileges
);

// GET /api/roles/:id/has-permission - Check if role has specific permission
router.get('/:id/has-permission', 
  authenticateToken,
  requirePermission('read'),
  validateRoleId,
  RoleController.hasPermission
);

// GET /api/roles/:id/has-privilege - Check if role has specific privilege
router.get('/:id/has-privilege', 
  authenticateToken,
  requirePermission('read'),
  validateRoleId,
  RoleController.hasPrivilege
);

module.exports = router;
