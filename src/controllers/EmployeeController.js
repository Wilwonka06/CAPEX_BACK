// src/controllers/EmployeeController.js
const employeeService = require('../services/EmployeeService');

class EmployeeController {
  async getEmployees(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener empleados', error });
    }
  }

  async getEmployee(req, res) {
    try {
      const { id } = req.params;
      const employee = await employeeService.getEmployeeById(id);
      if (!employee) return res.status(404).json({ message: 'Empleado no encontrado' });

      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener empleado', error });
    }
  }

  async createEmployee(req, res) {
    try {
      // Ignorar roleId y contrasena en el body
      const { roleId, contrasena, ...data } = req.body;
      const newEmployee = await employeeService.createEmployee(data);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear empleado', error });
    }
  }

  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const { roleId, contrasena, ...data } = req.body; // ignoramos roleId y contrasena
      const updatedEmployee = await employeeService.updateEmployee(id, data);

      if (!updatedEmployee) return res.status(404).json({ message: 'Empleado no encontrado' });

      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar empleado', error });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const deletedEmployee = await employeeService.deleteEmployee(id);

      if (!deletedEmployee) return res.status(404).json({ message: 'Empleado no encontrado' });

      res.json({ message: 'Empleado eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar empleado', error });
    }
  }
}

module.exports = new EmployeeController();
