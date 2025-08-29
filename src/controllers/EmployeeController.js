const Employee = require('../models/Employee');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class EmployeeController {
  // Obtener todos los empleados
  static async getAllEmployees(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Employee.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Empleados obtenidos exitosamente', {
        employees: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener empleados', error);
    }
  }

  // Obtener empleado por ID
  static async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        return ResponseMiddleware.error(res, 'Empleado no encontrado', null, 404);
      }
      
      return ResponseMiddleware.success(res, 'Empleado obtenido exitosamente', employee);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener empleado', error);
    }
  }

  // Crear nuevo empleado
  static async createEmployee(req, res) {
    try {
      const employeeData = req.body;
      const newEmployee = await Employee.create(employeeData);
      return ResponseMiddleware.success(res, 'Empleado creado exitosamente', newEmployee, 201);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al crear empleado', error);
    }
  }

  // Actualizar empleado
  static async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const employeeData = req.body;
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        return ResponseMiddleware.error(res, 'Empleado no encontrado', null, 404);
      }
      
      await employee.update(employeeData);
      return ResponseMiddleware.success(res, 'Empleado actualizado exitosamente', employee);
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al actualizar empleado', error);
    }
  }

  // Eliminar empleado
  static async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        return ResponseMiddleware.error(res, 'Empleado no encontrado', null, 404);
      }
      
      await employee.destroy();
      return ResponseMiddleware.success(res, 'Empleado eliminado exitosamente');
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al eliminar empleado', error);
    }
  }

  // Obtener estadísticas de empleados
  static async getEmployeeStats(req, res) {
    try {
      const totalEmployees = await Employee.count();
      const activeEmployees = await Employee.count({ where: { status: 'activo' } });
      const inactiveEmployees = await Employee.count({ where: { status: 'inactivo' } });

      return ResponseMiddleware.success(res, 'Estadísticas obtenidas exitosamente', {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees
      });
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error al obtener estadísticas', error);
    }
  }

  // Buscar empleados
  static async searchEmployees(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Employee.findAndCountAll({
        where: {
          [require('sequelize').Op.or]: [
            { firstName: { [require('sequelize').Op.like]: `%${q}%` } },
            { lastName: { [require('sequelize').Op.like]: `%${q}%` } },
            { email: { [require('sequelize').Op.like]: `%${q}%` } },
            { documentNumber: { [require('sequelize').Op.like]: `%${q}%` } }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return ResponseMiddleware.success(res, 'Búsqueda completada exitosamente', {
        employees: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      return ResponseMiddleware.error(res, 'Error en la búsqueda', error);
    }
  }
}

module.exports = EmployeeController;
