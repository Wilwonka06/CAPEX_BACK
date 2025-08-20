// src/controllers/EmployeeController.js
const employeeService = require('../services/EmployeeService');

class EmployeeController {
  async create(req, res) {
    try {
      const employee = await employeeService.createEmployee(req.body);
      res.status(201).json({
        success: true,
        data: employee,
        message: 'Empleado creado correctamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.json({
        success: true,
        data: employees,
        count: employees.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Empleado no encontrado'
        });
      }
      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const employees = await employeeService.getEmployeesByStatus(status);
      res.json({
        success: true,
        data: employees,
        count: employees.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getActive(req, res) {
    try {
      const employees = await employeeService.getActiveEmployees();
      res.json({
        success: true,
        data: employees,
        count: employees.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const updated = await employeeService.updateEmployee(req.params.id, req.body);
      res.json({
        success: true,
        data: updated,
        message: 'Empleado actualizado correctamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await employeeService.deleteEmployee(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async search(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Término de búsqueda requerido'
        });
      }

      const employees = await employeeService.searchEmployees(q);
      res.json({
        success: true,
        data: employees,
        count: employees.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          success: false,
          error: 'Nuevo estado requerido'
        });
      }

      const employee = await employeeService.changeEmployeeStatus(id, estado);
      res.json({
        success: true,
        data: employee,
        message: `Estado del empleado cambiado a ${estado}`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new EmployeeController();
