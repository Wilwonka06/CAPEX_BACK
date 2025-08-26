const { Usuario } = require('../models/User');
const { Role } = require('../models/roles');
const UserRole = require('../models/UserRole');
const { Op } = require('sequelize');

class UserRoleService {
  /**
   * Asignar un rol a un usuario
   */
  static async asignarRolAUsuario(idUsuario, idRol) {
    try {
      // Verificar que el usuario existe
      const usuario = await Usuario.findByPk(idUsuario);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que el rol existe
      const rol = await Role.findByPk(idRol);
      if (!rol) {
        throw new Error('Rol no encontrado');
      }

      // Verificar si ya existe la asignación
      const asignacionExistente = await UserRole.findOne({
        where: {
          id_usuario: idUsuario,
          id_rol: idRol,
          estado: 'Activo'
        }
      });

      if (asignacionExistente) {
        throw new Error('El usuario ya tiene asignado este rol');
      }

      // Crear la nueva asignación
      const nuevaAsignacion = await UserRole.create({
        id_usuario: idUsuario,
        id_rol: idRol,
        fecha_asignacion: new Date(),
        estado: 'Activo'
      });

      return {
        success: true,
        message: 'Rol asignado correctamente',
        data: nuevaAsignacion
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remover un rol de un usuario
   */
  static async removerRolDeUsuario(idUsuario, idRol) {
    try {
      const asignacion = await UserRole.findOne({
        where: {
          id_usuario: idUsuario,
          id_rol: idRol,
          estado: 'Activo'
        }
      });

      if (!asignacion) {
        throw new Error('No se encontró la asignación de rol');
      }

      // Marcar como inactiva en lugar de eliminar
      await asignacion.update({ estado: 'Inactivo' });

      return {
        success: true,
        message: 'Rol removido correctamente'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los roles de un usuario
   */
  static async obtenerRolesDeUsuario(idUsuario) {
    try {
      const usuario = await Usuario.findByPk(idUsuario, {
        include: [{
          model: Role,
          as: 'roles',
          through: {
            attributes: ['fecha_asignacion', 'estado'],
            where: { estado: 'Activo' }
          }
        }]
      });

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        data: usuario.roles
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios de un rol
   */
  static async obtenerUsuariosDeRol(idRol) {
    try {
      const rol = await Role.findByPk(idRol, {
        include: [{
          model: Usuario,
          as: 'usuarios',
          through: {
            attributes: ['fecha_asignacion', 'estado'],
            where: { estado: 'Activo' }
          }
        }]
      });

      if (!rol) {
        throw new Error('Rol no encontrado');
      }

      return {
        success: true,
        data: rol.usuarios
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las asignaciones activas
   */
  static async obtenerTodasLasAsignaciones() {
    try {
      const asignaciones = await UserRole.findAll({
        where: { estado: 'Activo' },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'correo']
          },
          {
            model: Role,
            as: 'rol',
            attributes: ['id_rol', 'nombre', 'descripcion']
          }
        ]
      });

      return {
        success: true,
        data: asignaciones
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si un usuario tiene un rol específico
   */
  static async usuarioTieneRol(idUsuario, nombreRol) {
    try {
      const usuario = await Usuario.findByPk(idUsuario, {
        include: [{
          model: Role,
          as: 'roles',
          where: { nombre: nombreRol },
          through: {
            where: { estado: 'Activo' }
          }
        }]
      });

      return {
        success: true,
        tieneRol: usuario && usuario.roles.length > 0
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuarios con sus roles (para listado)
   */
  static async obtenerUsuariosConRoles() {
    try {
      const usuarios = await Usuario.findAll({
        include: [{
          model: Role,
          as: 'roles',
          through: {
            attributes: ['fecha_asignacion', 'estado'],
            where: { estado: 'Activo' }
          }
        }]
      });

      return {
        success: true,
        data: usuarios
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRoleService;
