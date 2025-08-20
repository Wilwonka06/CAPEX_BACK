const User = require('../models/User');
const { Op } = require('sequelize');

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
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Validar que el documento no exista
      const existingDocument = await User.findOne({
        where: { 
          documentType: userData.documentType,
          documentNumber: userData.documentNumber
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
      const newUser = await User.create(userData);
      
      // Retornar usuario sin password
      const { password, ...userWithoutPassword } = newUser.toJSON();
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
        documentType = null
      } = options;

      const offset = (page - 1) * limit;

      // Construir condiciones de búsqueda
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { documentNumber: { [Op.like]: `%${search}%` } }
        ];
      }

      if (roleId) {
        whereClause.roleId = roleId;
      }

      if (documentType) {
        whereClause.documentType = documentType;
      }

      // Ejecutar consulta con paginación
      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] }, // Excluir password
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
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
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
   * Obtener un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['password'] }
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
   * @param {string} documentType - Tipo de documento
   * @param {string} documentNumber - Número de documento
   * @returns {Promise<Object>} Usuario encontrado
   */
  static async getUserByDocument(documentType, documentNumber) {
    try {
      const user = await User.findOne({
        where: { 
          documentType,
          documentNumber
        },
        attributes: { exclude: ['password'] }
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
      const existingUser = await User.findByPk(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Si se está actualizando el email, verificar que no exista
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await User.findOne({
          where: { 
            email: updateData.email,
            id: { [Op.ne]: userId } // Excluir el usuario actual
          }
        });

        if (emailExists) {
          throw new Error('El email ya está registrado por otro usuario');
        }
      }

      // Si se está actualizando el documento, verificar que no exista
      if (updateData.documentType && updateData.documentNumber) {
        const documentExists = await User.findOne({
          where: { 
            documentType: updateData.documentType,
            documentNumber: updateData.documentNumber,
            id: { [Op.ne]: userId } // Excluir el usuario actual
          }
        });

        if (documentExists) {
          throw new Error('El documento ya está registrado por otro usuario');
        }
      }

      // Actualizar el usuario
      await User.update(updateData, {
        where: { id: userId }
      });

      // Obtener el usuario actualizado
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
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
      const existingUser = await User.findByPk(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Eliminar el usuario
      await User.destroy({
        where: { id: userId }
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
      const existingUser = await User.findByPk(userId);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar la contraseña
      await User.update(
        { password: newPassword },
        { where: { id: userId } }
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
      const user = await User.findByPk(userId);
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
      const count = await User.count({
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
      const totalUsers = await User.count();
      
      // Contar por tipo de documento
      const documentTypeStats = await User.findAll({
        attributes: [
          'documentType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['documentType']
      });

      // Contar por rol
      const roleStats = await User.findAll({
        attributes: [
          'roleId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
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
