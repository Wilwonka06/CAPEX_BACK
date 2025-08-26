const { Usuario } = require('../models/User');
const { Op, sequelize } = require('sequelize');

/**
 * Servicio para gestión de usuarios
 * Maneja toda la lógica de negocio relacionada con usuarios
 * 
 * NOTA: roleId es opcional por ahora. Se asigna automáticamente como 1
 * hasta que se implemente el módulo de Roles completo.
 */
class UsersService {
  
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  static async createUser(userData) {
    try {
      // Validar que el email no exista
      const existingUser = await Usuario.findOne({
        where: { correo: userData.correo }
      });

      if (existingUser) {
        throw new Error('El correo ya está registrado');
      }

      // Validar que el documento no exista
      const existingDocument = await Usuario.findOne({
        where: { 
          tipo_documento: userData.tipo_documento,
          documento: userData.documento
        }
      });

      if (existingDocument) {
        throw new Error('El documento ya está registrado');
      }

      // Asignar rol por defecto si no se proporciona (temporal hasta implementar Roles)
      // TODO: Cuando implementes el módulo de Roles, cambiar esta lógica
      if (!userData.roleId) {
        userData.roleId = 1; // Rol por defecto
      }

      // Crear el usuario
      const newUser = await Usuario.create(userData);
      
      // Retornar usuario sin password
      const { contrasena, ...userWithoutPassword } = newUser.toJSON();
      return userWithoutPassword;

    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Obtener todos los usuarios con paginación
   * @param {Object} options - Opciones de paginación y filtros
   * @returns {Promise<Object>} Lista de usuarios y metadatos de paginación
   */
  static async getAllUsers(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        roleId = null,
        tipo_documento = null
      } = options;

      const offset = (page - 1) * limit;

      // Construir condiciones de búsqueda
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { correo: { [Op.like]: `%${search}%` } },
          { documento: { [Op.like]: `%${search}%` } }
        ];
      }

      if (roleId) {
        whereClause.roleId = roleId;
      }

      if (tipo_documento) {
        whereClause.tipo_documento = tipo_documento;
      }

      // Ejecutar consulta con paginación
      const { count, rows } = await Usuario.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['contrasena'] }, // Excluir password
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      return {
        users: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      };

    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por ID
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  static async getUserById(userId) {
    try {
      const user = await Usuario.findByPk(userId, {
        attributes: { exclude: ['contrasena'] }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;

    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por correo
   * @param {string} correo - correo del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  static async getUserByEmail(correo) {
    try {
      const user = await Usuario.findOne({
        where: { correo },
        attributes: { exclude: ['contrasena'] }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;

    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por documento
   * @param {string} tipo_documento - Tipo de documento
   * @param {string} documento - Número de documento
   * @returns {Promise<Object>} Usuario encontrado
   */
  static async getUserByDocument(tipo_documento, documento) {
    try {
      const user = await Usuario.findOne({
        where: { 
          tipo_documento,
          documento
        },
        attributes: { exclude: ['contrasena'] }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;

    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar un usuario
   * @param {number} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  static async updateUser(userId, updateData) {
    try {
      // Verificar que el usuario existe
      const existingUser = await Usuario.findByPk(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Si se está actualizando el correo, verificar que no exista
      if (updateData.correo && updateData.correo !== existingUser.correo) {
        const emailExists = await Usuario.findOne({
          where: { 
            correo: updateData.correo,
            id_usuario: { [Op.ne]: userId } // Excluir el usuario actual
          }
        });

        if (emailExists) {
          throw new Error('El email ya está registrado por otro usuario');
        }
      }

      // Si se está actualizando el documento, verificar que no exista
      if (updateData.tipo_documento && updateData.documento) {
        const documentExists = await Usuario.findOne({
          where: { 
            tipo_documento: updateData.tipo_documento,
            documento: updateData.documento,
            id_usuario: { [Op.ne]: userId } // Excluir el usuario actual
          }
        });

        if (documentExists) {
          throw new Error('El documento ya está registrado por otro usuario');
        }
      }

      // Actualizar el usuario
      await Usuario.update(updateData, {
        where: { id_usuario: userId }
      });

      // Obtener el usuario actualizado
      const updatedUser = await Usuario.findByPk(userId, {
        attributes: { exclude: ['contrasena'] }
      });

      return updatedUser;

    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Eliminar un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  static async deleteUser(userId) {
    try {
      // Verificar que el usuario existe
      const existingUser = await Usuario.findByPk(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Eliminar el usuario
      await Usuario.destroy({
        where: { id_usuario: userId }
      });

      return true;

    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Cambiar contraseña de un usuario
   * @param {number} userId - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<boolean>} True si se cambió correctamente
   */
  static async changePassword(userId, newPassword) {
    try {
      // Verificar que el usuario existe
      const existingUser = await Usuario.findByPk(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar la contraseña
      await Usuario.update(
        { contrasena: newPassword },
        { where: { id_usuario: userId } }
      );

      return true;

    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  /**
   * Verificar si un usuario existe
   * @param {number} userId - ID del usuario
   * @returns {Promise<boolean>} True si existe
   */
  static async userExists(userId) {
    try {
      const user = await Usuario.findByPk(userId);
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * Contar usuarios por rol
   * @param {number} roleId - ID del rol
   * @returns {Promise<number>} Cantidad de usuarios
   */
  static async countUsersByRole(roleId) {
    try {
      const count = await Usuario.count({
        where: { roleId }
      });
      return count;
    } catch (error) {
      throw new Error(`Error al contar usuarios por rol: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas básicas de usuarios
   * @returns {Promise<Object>} Estadísticas de usuarios
   */
  static async getUserStats() {
    try {
      const totalUsers = await Usuario.count();
      
      // Contar por tipo de documento
      const documentTypeStats = await Usuario.findAll({
        attributes: [
          'tipo_documento',
          [sequelize.fn('COUNT', sequelize.col('id_usuario')), 'count']
        ],
        group: ['tipo_documento']
      });

      // Contar por rol
      const roleStats = await Usuario.findAll({
        attributes: [
          'roleId',
          [sequelize.fn('COUNT', sequelize.col('id_usuario')), 'count']
        ],
        group: ['roleId']
      });

      return {
        totalUsers,
        documentTypeStats,
        roleStats
      };

    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = UsersService;
