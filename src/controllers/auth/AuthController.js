const AuthService = require('../../services/auth/AuthService');

/**
 * Controlador de autenticación
 * Maneja las peticiones HTTP relacionadas con autenticación
 */
class AuthController {

  /**
   * Registrar un nuevo usuario
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const userData = req.body;
      const newUser = await AuthService.registerUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente como cliente',
        data: newUser,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Manejar errores específicos de validación
      if (error.message.includes('ya está registrado')) {
        return res.status(409).json({
          success: false,
          message: error.message,
          errorType: 'DUPLICATE_ENTRY',
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
   * Autenticar usuario (login)
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { correo, contrasena } = req.body;
      const result = await AuthService.loginUser(correo, contrasena);
      
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Manejar errores de credenciales inválidas
      if (error.message.includes('Credenciales inválidas')) {
        return res.status(401).json({
          success: false,
          message: error.message,
          errorType: 'INVALID_CREDENTIALS',
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
   * Obtener información del usuario actual
   * GET /api/auth/me
   */
  static async getCurrentUser(req, res) {
    try {
      // El ID del usuario viene del middleware de autenticación
      const userId = req.user.id_usuario;
      const user = await AuthService.getCurrentUser(userId);
      
      res.json({
        success: true,
        message: 'Información del usuario obtenida exitosamente',
        data: user,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Verificar token
   * POST /api/auth/verify
   */
  static async verifyToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token requerido',
          timestamp: new Date().toISOString()
        });
      }

      const decoded = await AuthService.verifyToken(token);
      
      res.json({
        success: true,
        message: 'Token válido',
        data: decoded,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
        errorType: 'INVALID_TOKEN',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Cerrar sesión (logout)
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      // En una implementación más avanzada, aquí podrías invalidar el token
      // Por ahora, solo retornamos un mensaje de éxito
      
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Editar perfil del usuario logueado
   * PUT /api/auth/profile
   */
  static async editProfile(req, res) {
    try {
      // El ID del usuario viene del middleware de autenticación
      const userId = req.user.id_usuario;
      const updateData = req.body;
      
      const updatedUser = await AuthService.editProfile(userId, updateData);
      
      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedUser,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Manejar errores específicos
      if (error.message.includes('ya está registrado')) {
        return res.status(409).json({
          success: false,
          message: error.message,
          errorType: 'DUPLICATE_ENTRY',
          timestamp: new Date().toISOString()
        });
      }
      
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          errorType: 'NOT_FOUND',
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
}

module.exports = AuthController;
