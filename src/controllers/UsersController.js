const UsersService = require('../services/UsersService');

/**
 * Controlador para gestión de usuarios
 * Maneja las peticiones HTTP y utiliza el servicio para la lógica de negocio
 */
class UsersController {

  /**
   * Crear un nuevo usuario
   * POST /api/users
   */
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UsersService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Manejar específicamente errores relacionados con roles
      if (error.message.includes('rol') || error.message.includes('roleId')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          errorType: 'ROLE_VALIDATION_ERROR',
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtener todos los usuarios con paginación y búsqueda avanzada
   * GET /api/users
   */
  static async getAllUsers(req, res) {
    try {
      const { 
        page, 
        limit, 
        search, 
        roleId, 
        tipo_documento,
        nombre,
        correo,
        documento,
        telefono
      } = req.query;
      
      const filters = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || '',
        roleId: roleId ? parseInt(roleId) : null,
        tipo_documento: tipo_documento || null,
        nombre: nombre || '',
        correo: correo || '',
        documento: documento || '',
        telefono: telefono || ''
      };

      const result = await UsersService.searchUsers(filters);
      
      // Determinar el mensaje de respuesta
      let responseMessage = 'Usuarios obtenidos exitosamente';
      if (result.message) {
        responseMessage = result.message;
      }
      
      res.json({
        success: true,
        message: responseMessage,
        data: result.users,
        pagination: result.pagination,
        filters: result.filters,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtener un usuario por ID
   * GET /api/users/:id
   */
  static async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await UsersService.getUserById(userId);
      
      res.json({
        success: true,
        message: 'Usuario encontrado exitosamente',
        data: user,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }



  /**
   * Actualizar un usuario
   * PUT /api/users/:id
   */
  static async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const updateData = req.body;
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido',
          timestamp: new Date().toISOString()
        });
      }

      // No permitir actualizar campos sensibles
      delete updateData.id;
      delete updateData.contrasena; // La contraseña se cambia con endpoint específico

      const updatedUser = await UsersService.updateUser(userId, updateData);
      
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      // Manejar específicamente errores relacionados con roles
      if (error.message.includes('rol') || error.message.includes('roleId')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          errorType: 'ROLE_VALIDATION_ERROR',
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Eliminar un usuario
   * DELETE /api/users/:id
   */
  static async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido',
          timestamp: new Date().toISOString()
        });
      }

      await UsersService.deleteUser(userId);
      
      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Cambiar contraseña de un usuario
   * PATCH /api/users/:id/contrasena
   */
  static async changePassword(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const { newPassword } = req.body;
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido',
          timestamp: new Date().toISOString()
        });
      }

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres',
          timestamp: new Date().toISOString()
        });
      }

      await UsersService.changePassword(userId, newPassword);
      
      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtener estadísticas de usuarios
   * GET /api/users/stats
   */
  static async getUserStats(req, res) {
    try {
      const stats = await UsersService.getUserStats();
      
      res.json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Búsqueda avanzada de usuarios
   * GET /api/users/search
   */
  static async searchUsers(req, res) {
    try {
      const { 
        page, 
        limit, 
        search, 
        roleId, 
        tipo_documento,
        nombre,
        correo,
        documento,
        telefono
      } = req.query;
      
      const filters = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || '',
        roleId: roleId ? parseInt(roleId) : null,
        tipo_documento: tipo_documento || null,
        nombre: nombre || '',
        correo: correo || '',
        documento: documento || '',
        telefono: telefono || ''
      };

      const result = await UsersService.searchUsers(filters);
      
      // Determinar el mensaje de respuesta
      let responseMessage = 'Búsqueda de usuarios completada exitosamente';
      if (result.message) {
        responseMessage = result.message;
      }
      
      res.json({
        success: true,
        message: responseMessage,
        data: result.users,
        pagination: result.pagination,
        filters: result.filters,
        searchInfo: {
          totalResults: result.pagination.total,
          searchTerm: search || 'Todos los campos',
          appliedFilters: Object.keys(filters).filter(key => filters[key] && key !== 'page' && key !== 'limit')
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtener roles disponibles para asignar a usuarios
   * GET /api/users/available-roles
   */
  static async getAvailableRoles(req, res) {
    try {
      const { Role } = require('../models/roles');
      
      const roles = await Role.findAll({
        where: { estado: true },
        attributes: ['id_rol', 'nombre', 'descripcion'],
        order: [['nombre', 'ASC']]
      });
      
      res.json({
        success: true,
        message: 'Roles disponibles obtenidos exitosamente',
        data: roles,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error al obtener roles disponibles: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = UsersController;
