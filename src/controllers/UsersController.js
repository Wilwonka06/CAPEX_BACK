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
      
      // Validar campos requeridos (roleId es opcional por ahora)
      const requiredFields = ['name', 'documentType', 'documentNumber', 'email', 'password'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Campos requeridos faltantes',
          missingFields,
          timestamp: new Date().toISOString()
        });
      }

      const newUser = await UsersService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtener todos los usuarios con paginación
   * GET /api/users
   */
  static async getAllUsers(req, res) {
    try {
      const { page, limit, search, roleId, documentType } = req.query;
      
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || '',
        roleId: roleId ? parseInt(roleId) : null,
        documentType: documentType || null
      };

      const result = await UsersService.getAllUsers(options);
      
      res.json({
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: result.users,
        pagination: result.pagination,
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
      
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido',
          timestamp: new Date().toISOString()
        });
      }

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
   * Obtener un usuario por email
   * GET /api/users/email/:email
   */
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email requerido',
          timestamp: new Date().toISOString()
        });
      }

      const user = await UsersService.getUserByEmail(email);
      
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
   * Obtener un usuario por documento
   * GET /api/users/document/:documentType/:documentNumber
   */
  static async getUserByDocument(req, res) {
    try {
      const { documentType, documentNumber } = req.params;
      
      if (!documentType || !documentNumber) {
        return res.status(400).json({
          success: false,
          message: 'Tipo y número de documento requeridos',
          timestamp: new Date().toISOString()
        });
      }

      const user = await UsersService.getUserByDocument(documentType, documentNumber);
      
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
      delete updateData.password; // La contraseña se cambia con endpoint específico

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
   * PATCH /api/users/:id/password
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
}

module.exports = UsersController;
