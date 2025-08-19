// src/services/EmployeeService.js
const Employee = require('../models/Employee');
const User = require('../models/User');
const { Op } = require('sequelize');

class EmployeeService {
  async createEmployee(employeeData) {
    try {
      // Crear primero el usuario
      const user = await User.create({
        nombre: employeeData.nombre,
        tipo_documento: employeeData.tipo_documento,
        documento: employeeData.documento,
        telefono: employeeData.telefono,
        correo: employeeData.correo,
        contrasena: employeeData.contrasena
      });

      // Crear el empleado asociado al usuario
      const employee = await Employee.create({
        id_usuario: user.id_usuario,
        estado: employeeData.estado || 'Activo'
      });

      // Retornar empleado con datos del usuario
      return await this.getEmployeeWithUser(employee.id_empleado);
    } catch (error) {
      throw error;
    }
  }

  async getAllEmployees() {
    const employees = await Employee.findAll({
      order: [['id_empleado', 'ASC']]
    });

    // Obtener datos de usuarios para cada empleado
    const employeesWithUsers = await Promise.all(
      employees.map(async (employee) => {
        const user = await User.findByPk(employee.id_usuario);
        return {
          ...employee.toJSON(),
          usuario: {
            nombre: user.nombre,
            tipo_documento: user.tipo_documento,
            documento: user.documento,
            telefono: user.telefono,
            correo: user.correo
          }
        };
      })
    );

    return employeesWithUsers;
  }

  async getEmployeeById(id_empleado) {
    return await this.getEmployeeWithUser(id_empleado);
  }

  async getEmployeeWithUser(id_empleado) {
    const employee = await Employee.findByPk(id_empleado);
    if (!employee) return null;

    const user = await User.findByPk(employee.id_usuario);
    return {
      ...employee.toJSON(),
      usuario: {
        nombre: user.nombre,
        tipo_documento: user.tipo_documento,
        documento: user.documento,
        telefono: user.telefono,
        correo: user.correo
      }
    };
  }

  async getEmployeesByStatus(estado) {
    const employees = await Employee.findAll({
      where: { estado },
      order: [['id_empleado', 'ASC']]
    });

    // Obtener datos de usuarios para cada empleado
    const employeesWithUsers = await Promise.all(
      employees.map(async (employee) => {
        const user = await User.findByPk(employee.id_usuario);
        return {
          ...employee.toJSON(),
          usuario: {
            nombre: user.nombre,
            tipo_documento: user.tipo_documento,
            documento: user.documento,
            telefono: user.telefono,
            correo: user.correo
          }
        };
      })
    );

    return employeesWithUsers;
  }

  async getActiveEmployees() {
    return await this.getEmployeesByStatus('Activo');
  }

  async updateEmployee(id_empleado, employeeData) {
    const employee = await Employee.findByPk(id_empleado);
    if (!employee) {
      throw new Error('Empleado no encontrado');
    }

    const user = await User.findByPk(employee.id_usuario);

    // Actualizar datos del usuario si se proporcionan
    if (employeeData.nombre || employeeData.tipo_documento || employeeData.documento || 
        employeeData.telefono || employeeData.correo || employeeData.contrasena) {
      
      const userUpdateData = {};
      if (employeeData.nombre) userUpdateData.nombre = employeeData.nombre;
      if (employeeData.tipo_documento) userUpdateData.tipo_documento = employeeData.tipo_documento;
      if (employeeData.documento) userUpdateData.documento = employeeData.documento;
      if (employeeData.telefono) userUpdateData.telefono = employeeData.telefono;
      if (employeeData.correo) userUpdateData.correo = employeeData.correo;
      if (employeeData.contrasena) userUpdateData.contrasena = employeeData.contrasena;

      await user.update(userUpdateData);
    }

    // Actualizar estado del empleado si se proporciona
    if (employeeData.estado) {
      await employee.update({ estado: employeeData.estado });
    }

    return await this.getEmployeeWithUser(id_empleado);
  }

  async deleteEmployee(id_empleado) {
    const employee = await Employee.findByPk(id_empleado);
    if (!employee) {
      throw new Error('Empleado no encontrado');
    }

    // Eliminar el empleado (esto no elimina el usuario)
    await employee.destroy();
    
    return { message: 'Empleado eliminado correctamente' };
  }

  async searchEmployees(searchTerm) {
    // Buscar usuarios que coincidan con el término de búsqueda
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${searchTerm}%` } },
          { documento: { [Op.like]: `%${searchTerm}%` } },
          { correo: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });

    // Obtener los IDs de usuarios encontrados
    const userIds = users.map(user => user.id_usuario);

    // Buscar empleados que correspondan a esos usuarios
    const employees = await Employee.findAll({
      where: { id_usuario: { [Op.in]: userIds } },
      order: [['id_empleado', 'ASC']]
    });

    // Combinar datos de empleados y usuarios
    const employeesWithUsers = await Promise.all(
      employees.map(async (employee) => {
        const user = await User.findByPk(employee.id_usuario);
        return {
          ...employee.toJSON(),
          usuario: {
            nombre: user.nombre,
            tipo_documento: user.tipo_documento,
            documento: user.documento,
            telefono: user.telefono,
            correo: user.correo
          }
        };
      })
    );

    return employeesWithUsers;
  }

  async changeEmployeeStatus(id_empleado, nuevoEstado) {
    const employee = await Employee.findByPk(id_empleado);
    if (!employee) {
      throw new Error('Empleado no encontrado');
    }

    await employee.update({ estado: nuevoEstado });
    return await this.getEmployeeWithUser(id_empleado);
  }
}

module.exports = new EmployeeService();
