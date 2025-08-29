const { Usuario } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class UserController {
  // Obtener todos los usuarios
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, roleId, activo } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (roleId) whereClause.roleId = roleId;
      if (activo !== undefined) whereClause.activo = activo === 'true';

      const users = await Usuario.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      const totalPages = Math.ceil(users.count / limit);

      return ResponseMiddleware.success(res, 'Usuarios obtenidos exitosamente', {
        users: users.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: users.count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return ResponseMiddleware.error(res, 'Error al obtener usuarios', error, 500);
    }
  }

  // Obtener usuario por ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await Usuario.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 404);
      }

      return ResponseMiddleware.success(res, 'Usuario obtenido exitosamente', user);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return ResponseMiddleware.error(res, 'Error al obtener usuario', error, 500);
    }
  }

  // Crear nuevo usuario
  static async createUser(req, res) {
    try {
      const userData = req.body;
      
      // Encriptar contraseña
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const user = await Usuario.create(userData);
      const userWithoutPassword = await Usuario.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      });

      return ResponseMiddleware.success(res, 'Usuario creado exitosamente', userWithoutPassword, 201);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        const message = field === 'email' ? 'Ya existe un usuario con ese email' : 
                       field === 'username' ? 'Ya existe un usuario con ese nombre de usuario' : 
                       'Error de duplicación';
        return ResponseMiddleware.error(res, message, null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al crear usuario', error, 500);
    }
  }

  // Actualizar usuario
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await Usuario.findByPk(id);
      if (!user) {
        return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 404);
      }

      // Encriptar contraseña si se proporciona
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      await user.update(updateData);

      const updatedUser = await Usuario.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      return ResponseMiddleware.success(res, 'Usuario actualizado exitosamente', updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        const message = field === 'email' ? 'Ya existe un usuario con ese email' : 
                       field === 'username' ? 'Ya existe un usuario con ese nombre de usuario' : 
                       'Error de duplicación';
        return ResponseMiddleware.error(res, message, null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al actualizar usuario', error, 500);
    }
  }

  // Eliminar usuario
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await Usuario.findByPk(id);

      if (!user) {
        return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 404);
      }

      await user.destroy();

      return ResponseMiddleware.success(res, 'Usuario eliminado exitosamente', null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return ResponseMiddleware.error(res, 'Error al eliminar usuario', error, 500);
    }
  }

  // Login de usuario
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return ResponseMiddleware.error(res, 'Credenciales inválidas', null, 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return ResponseMiddleware.error(res, 'Credenciales inválidas', null, 401);
      }

      if (!user.activo) {
        return ResponseMiddleware.error(res, 'Usuario inactivo', null, 403);
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          roleId: user.roleId 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const userWithoutPassword = await Usuario.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      });

      return ResponseMiddleware.success(res, 'Login exitoso', {
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      return ResponseMiddleware.error(res, 'Error en login', error, 500);
    }
  }

  // Logout de usuario
  static async logout(req, res) {
    try {
      // En una implementación real, aquí se invalidaría el token
      return ResponseMiddleware.success(res, 'Logout exitoso', null);
    } catch (error) {
      console.error('Error en logout:', error);
      return ResponseMiddleware.error(res, 'Error en logout', error, 500);
    }
  }

  // Obtener perfil del usuario
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await Usuario.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 404);
      }

      return ResponseMiddleware.success(res, 'Perfil obtenido exitosamente', user);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return ResponseMiddleware.error(res, 'Error al obtener perfil', error, 500);
    }
  }

  // Actualizar perfil del usuario
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const user = await Usuario.findByPk(userId);
      if (!user) {
        return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 404);
      }

      // Encriptar contraseña si se proporciona
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      await user.update(updateData);

      const updatedUser = await Usuario.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      return ResponseMiddleware.success(res, 'Perfil actualizado exitosamente', updatedUser);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return ResponseMiddleware.error(res, 'Error al actualizar perfil', error, 500);
    }
  }

  // Cambiar contraseña
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      const user = await Usuario.findByPk(userId);
      if (!user) {
        return ResponseMiddleware.error(res, 'Usuario no encontrado', null, 404);
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return ResponseMiddleware.error(res, 'Contraseña actual incorrecta', null, 400);
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedNewPassword });

      return ResponseMiddleware.success(res, 'Contraseña cambiada exitosamente', null);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return ResponseMiddleware.error(res, 'Error al cambiar contraseña', error, 500);
    }
  }
}

module.exports = UserController;
