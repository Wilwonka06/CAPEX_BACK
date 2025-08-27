const RoleService = require('../../services/roles/RoleService');

class RoleController {
  // Get all roles
  static async getAllRoles(req, res) {
    try {
      const result = await RoleService.getAllRoles();
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get all roles including inactive
  static async getAllRolesWithInactive(req, res) {
    try {
      const result = await RoleService.getAllRolesWithInactive();
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get role by ID
  static async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const result = await RoleService.getRoleById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Create new role
  static async createRole(req, res) {
    try {
      const roleData = req.body;
      const result = await RoleService.createRole(roleData);
      
      if (!result.success) {
        const statusCode = result.error === 'ROLE_NAME_EXISTS' || result.error === 'NO_PERMISSIONS_PROVIDED' ? 400 : 500;
        return res.status(statusCode).json(result);
      }
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Update role
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const result = await RoleService.updateRole(id, roleData);
      
      if (!result.success) {
        let statusCode = 404;
        
        // Determine appropriate status code based on error type
        if (result.error === 'ROLE_NAME_EXISTS' || 
            result.error === 'NO_PERMISSIONS_PROVIDED' || 
            result.error === 'INVALID_PERMISSION_PRIVILEGE') {
          statusCode = 400;
        } else if (result.error === 'ROLE_NOT_FOUND') {
          statusCode = 404;
        } else {
          statusCode = 500;
        }
        
        return res.status(statusCode).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Delete role
  static async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const result = await RoleService.deleteRole(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Hard delete role (permanent deletion)
  static async hardDeleteRole(req, res) {
    try {
      const { id } = req.params;
      const result = await RoleService.hardDeleteRole(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Activate role
  static async activateRole(req, res) {
    try {
      const { id } = req.params;
      const result = await RoleService.activateRole(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Deactivate role
  static async deactivateRole(req, res) {
    try {
      const { id } = req.params;
      const result = await RoleService.deactivateRole(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get all permissions
  static async getAllPermissions(req, res) {
    try {
      const result = await RoleService.getAllPermissions();
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Get all privileges
  static async getAllPrivileges(req, res) {
    try {
      const result = await RoleService.getAllPrivileges();
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = RoleController;
