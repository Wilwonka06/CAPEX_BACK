const UserRole = require('../models/UserRole');
const { Usuario } = require('../models/User');
const { Role } = require('../models/roles');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class UserRoleController {
  // Obtener todos los roles de usuario
  static async getAllUserRoles(req, res) {
    try {
      const userRoles = await UserRole.findAll({
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ],
        order: [['fecha_asignacion', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Roles de usuario obtenidos exitosamente', userRoles);
    } catch (error) {
      console.error('Error al obtener roles de usuario:', error);
      return ResponseMiddleware.error(res, 'Error al obtener roles de usuario', error, 500);
    }
  }

  // Obtener rol de usuario por ID
  static async getUserRoleById(req, res) {
    try {
      const { id } = req.params;
      const userRole = await UserRole.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ]
      });

      if (!userRole) {
        return ResponseMiddleware.error(res, 'Rol de usuario no encontrado', null, 404);
      }

      return ResponseMiddleware.success(res, 'Rol de usuario obtenido exitosamente', userRole);
    } catch (error) {
      console.error('Error al obtener rol de usuario:', error);
      return ResponseMiddleware.error(res, 'Error al obtener rol de usuario', error, 500);
    }
  }

  // Crear nuevo rol de usuario
  static async createUserRole(req, res) {
    try {
      const userRoleData = req.body;
      const userRole = await UserRole.create(userRoleData);

      const userRoleWithDetails = await UserRole.findByPk(userRole.id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ]
      });

      return ResponseMiddleware.success(res, 'Rol de usuario creado exitosamente', userRoleWithDetails, 201);
    } catch (error) {
      console.error('Error al crear rol de usuario:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'El usuario ya tiene asignado este rol', null, 409);
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        const field = error.fields[0];
        const message = field === 'id_usuario' ? 'El usuario especificado no existe' : 
                       field === 'id_rol' ? 'El rol especificado no existe' : 
                       'Error de referencia';
        return ResponseMiddleware.error(res, message, null, 400);
      }

      return ResponseMiddleware.error(res, 'Error al crear rol de usuario', error, 500);
    }
  }

  // Actualizar rol de usuario
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const userRole = await UserRole.findByPk(id);
      if (!userRole) {
        return ResponseMiddleware.error(res, 'Rol de usuario no encontrado', null, 404);
      }

      await userRole.update(updateData);

      const updatedUserRole = await UserRole.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          },
          {
            model: Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ]
      });

      return ResponseMiddleware.success(res, 'Rol de usuario actualizado exitosamente', updatedUserRole);
    } catch (error) {
      console.error('Error al actualizar rol de usuario:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'El usuario ya tiene asignado este rol', null, 409);
      }

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        const field = error.fields[0];
        const message = field === 'id_usuario' ? 'El usuario especificado no existe' : 
                       field === 'id_rol' ? 'El rol especificado no existe' : 
                       'Error de referencia';
        return ResponseMiddleware.error(res, message, null, 400);
      }

      return ResponseMiddleware.error(res, 'Error al actualizar rol de usuario', error, 500);
    }
  }

  // Eliminar rol de usuario
  static async deleteUserRole(req, res) {
    try {
      const { id } = req.params;
      const userRole = await UserRole.findByPk(id);

      if (!userRole) {
        return ResponseMiddleware.error(res, 'Rol de usuario no encontrado', null, 404);
      }

      await userRole.destroy();

      return ResponseMiddleware.success(res, 'Rol de usuario eliminado exitosamente', null);
    } catch (error) {
      console.error('Error al eliminar rol de usuario:', error);
      return ResponseMiddleware.error(res, 'Error al eliminar rol de usuario', error, 500);
    }
  }

  // Obtener roles de usuario por usuario
  static async getUserRolesByUser(req, res) {
    try {
      const { userId } = req.params;
      const userRoles = await UserRole.findAll({
        where: { id_usuario: userId },
        include: [
          {
            model: Role,
            as: 'rol',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ],
        order: [['fecha_asignacion', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Roles de usuario obtenidos exitosamente', userRoles);
    } catch (error) {
      console.error('Error al obtener roles de usuario por usuario:', error);
      return ResponseMiddleware.error(res, 'Error al obtener roles de usuario por usuario', error, 500);
    }
  }

  // Obtener roles de usuario por rol
  static async getUserRolesByRole(req, res) {
    try {
      const { roleId } = req.params;
      const userRoles = await UserRole.findAll({
        where: { id_rol: roleId },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['fecha_asignacion', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Usuarios con rol obtenidos exitosamente', userRoles);
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      return ResponseMiddleware.error(res, 'Error al obtener usuarios por rol', error, 500);
    }
  }
}

module.exports = UserRoleController;
