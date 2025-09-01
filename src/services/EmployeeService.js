// src/services/EmployeeService.js
const { Usuario } = require('../models/User');

const EMPLOYEE_ROLE_ID = 2; // Ajusta según tu tabla "roles"

class EmployeeService {
  async getAllEmployees() {
    return await Usuario.findAll({ where: { roleId: EMPLOYEE_ROLE_ID } });
  }

  async getEmployeeById(id) {
    return await Usuario.findOne({ where: { id_usuario: id, roleId: EMPLOYEE_ROLE_ID } });
  }

  async createEmployee(data) {
    // Forzar rol = empleado y contraseña = documento
    const employeeData = {
      ...data,
      roleId: EMPLOYEE_ROLE_ID,
      contrasena: data.documento
    };
    return await Usuario.create(employeeData);
  }

  async updateEmployee(id, data) {
    const employee = await this.getEmployeeById(id);
    if (!employee) return null;

    // Evitar que actualicen roleId o contrasena directamente
    delete data.roleId;
    delete data.contrasena;

    await employee.update(data);
    return employee;
  }

  async deleteEmployee(id) {
    const employee = await this.getEmployeeById(id);
    if (!employee) return null;

    await employee.destroy();
    return employee;
  }
}

module.exports = new EmployeeService();
