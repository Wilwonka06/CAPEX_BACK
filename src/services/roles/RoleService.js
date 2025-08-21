const Role = require('../../models/roles/Role');
const Permission = require('../../models/roles/Permission');
const Privilege = require('../../models/roles/Privilege');
const RolePermissionPrivilege = require('../../models/roles/RolePermissionPrivilege');
const { sequelize } = require('../../config/database');

class RoleService {
  // Get all roles
  static async getAllRoles() {
    try {
      const roles = await Role.findAll({
        where: { estado_rol: true },
        include: [
          {
            model: Permission,
            through: {
              model: RolePermissionPrivilege,
              attributes: []
            },
            as: 'permisos'
          },
          {
            model: Privilege,
            through: {
              model: RolePermissionPrivilege,
              attributes: []
            },
            as: 'privilegios'
          }
        ]
      });

      return {
        success: true,
        message: 'Roles obtenidos exitosamente',
        data: roles
      };
    } catch (error) {
      throw new Error(`Error al obtener roles: ${error.message}`);
    }
  }

  // Get role by ID
  static async getRoleById(id) {
    try {
      const role = await Role.findByPk(id, {
        include: [
          {
            model: Permission,
            through: {
              model: RolePermissionPrivilege,
              attributes: []
            },
            as: 'permisos'
          },
          {
            model: Privilege,
            through: {
              model: RolePermissionPrivilege,
              attributes: []
            },
            as: 'privilegios'
          }
        ]
      });

      if (!role) {
        return {
          success: false,
          message: 'Rol no encontrado'
        };
      }

      return {
        success: true,
        message: 'Rol obtenido exitosamente',
        data: role
      };
    } catch (error) {
      throw new Error(`Error al obtener rol: ${error.message}`);
    }
  }

  // Get role by name
  static async getRoleByName(nombre_rol) {
    try {
      const role = await Role.findOne({
        where: { nombre_rol },
        include: [
          {
            model: Permission,
            through: {
              model: RolePermissionPrivilege,
              attributes: []
            },
            as: 'permisos'
          },
          {
            model: Privilege,
            through: {
              model: RolePermissionPrivilege,
              attributes: []
            },
            as: 'privilegios'
          }
        ]
      });

      if (!role) {
        return {
          success: false,
          message: 'Rol no encontrado'
        };
      }

      return {
        success: true,
        message: 'Rol obtenido exitosamente',
        data: role
      };
    } catch (error) {
      throw new Error(`Error al obtener rol por nombre: ${error.message}`);
    }
  }

  // Create role with permissions and privileges
  static async createRole(roleData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { nombre_rol, descripcion, estado_rol, permisos_privilegios } = roleData;

      // Check if role name already exists
      const existingRole = await Role.findOne({ where: { nombre_rol } });
      if (existingRole) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Ya existe un rol con ese nombre',
          error: 'ROLE_NAME_EXISTS'
        };
      }

      // Validate that at least one permission+privilege is provided
      if (!permisos_privilegios || !Array.isArray(permisos_privilegios) || permisos_privilegios.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          message: 'El rol debe tener al menos un permiso+privilegio asociado',
          error: 'NO_PERMISSIONS_PROVIDED'
        };
      }

      // Create the role
      const newRole = await Role.create({
        nombre_rol,
        descripcion: descripcion || null,
        estado_rol: estado_rol !== undefined ? estado_rol : true
      }, { transaction });

      // Create permission+privilege associations
      const rolePermissionPrivileges = permisos_privilegios.map(permPriv => ({
        id_rol: newRole.id_rol,
        id_permiso: permPriv.id_permiso,
        id_privilegio: permPriv.id_privilegio
      }));

      await RolePermissionPrivilege.bulkCreate(rolePermissionPrivileges, { transaction });

      await transaction.commit();

      // Get the created role with its associations
      const createdRole = await this.getRoleById(newRole.id_rol);

      return {
        success: true,
        message: 'Rol creado exitosamente',
        data: createdRole.data
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al crear rol: ${error.message}`);
    }
  }

  // Update role
  static async updateRole(id, roleData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { nombre_rol, descripcion, estado_rol, permisos_privilegios } = roleData;

      // Check if role exists
      const existingRole = await Role.findByPk(id);
      if (!existingRole) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Rol no encontrado',
          error: 'ROLE_NOT_FOUND'
        };
      }

      // Check if new name already exists (if name is being updated)
      if (nombre_rol && nombre_rol !== existingRole.nombre_rol) {
        const roleWithSameName = await Role.findOne({ 
          where: { 
            nombre_rol,
            id_rol: { [sequelize.Op.ne]: id } // Exclude current role from check
          } 
        });
        if (roleWithSameName) {
          await transaction.rollback();
          return {
            success: false,
            message: 'Ya existe un rol con ese nombre',
            error: 'ROLE_NAME_EXISTS'
          };
        }
      }

      // Update role data
      const updateData = {};
      if (nombre_rol !== undefined) updateData.nombre_rol = nombre_rol;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (estado_rol !== undefined) updateData.estado_rol = estado_rol;

      await existingRole.update(updateData, { transaction });

      // Update permissions and privileges if provided
      if (permisos_privilegios !== undefined) {
        // Validate that at least one permission+privilege is provided
        if (!Array.isArray(permisos_privilegios) || permisos_privilegios.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            message: 'El rol debe tener al menos un permiso+privilegio asociado',
            error: 'NO_PERMISSIONS_PROVIDED'
          };
        }

        // Validate that each permission+privilege combination is valid
        for (const permPriv of permisos_privilegios) {
          if (!permPriv.id_permiso || !permPriv.id_privilegio) {
            await transaction.rollback();
            return {
              success: false,
              message: 'Cada permiso+privilegio debe tener un ID de permiso y privilegio válidos',
              error: 'INVALID_PERMISSION_PRIVILEGE'
            };
          }
        }

        // Remove existing associations
        await RolePermissionPrivilege.destroy({
          where: { id_rol: id },
          transaction
        });

        // Create new associations
        const rolePermissionPrivileges = permisos_privilegios.map(permPriv => ({
          id_rol: id,
          id_permiso: permPriv.id_permiso,
          id_privilegio: permPriv.id_privilegio
        }));

        await RolePermissionPrivilege.bulkCreate(rolePermissionPrivileges, { transaction });
      }

      await transaction.commit();

      // Get the updated role with its associations
      const updatedRole = await this.getRoleById(id);

      return {
        success: true,
        message: 'Rol actualizado exitosamente',
        data: updatedRole.data
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al actualizar rol: ${error.message}`);
    }
  }

  // Delete role (soft delete by setting estado_rol to false)
  static async deleteRole(id) {
    const transaction = await sequelize.transaction();
    
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Rol no encontrado'
        };
      }

      // Soft delete by setting estado_rol to false
      await role.update({ estado_rol: false }, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Rol eliminado exitosamente'
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al eliminar rol: ${error.message}`);
    }
  }

  // Get all permissions
  static async getAllPermissions() {
    try {
      const permissions = await Permission.findAll();
      return {
        success: true,
        message: 'Permisos obtenidos exitosamente',
        data: permissions
      };
    } catch (error) {
      throw new Error(`Error al obtener permisos: ${error.message}`);
    }
  }

  // Get all privileges
  static async getAllPrivileges() {
    try {
      const privileges = await Privilege.findAll();
      return {
        success: true,
        message: 'Privilegios obtenidos exitosamente',
        data: privileges
      };
    } catch (error) {
      throw new Error(`Error al obtener privilegios: ${error.message}`);
    }
  }
}

module.exports = RoleService;
