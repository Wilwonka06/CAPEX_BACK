// src/middlewares/EmployeeMiddleware.js
const { Usuario } = require('../models/User');

const EMPLOYEE_ROLE_ID = 2; // Ajusta según tu tabla "roles"

async function isEmployee(req, res, next) {
  try {
    const userId = req.user?.id_usuario; // Asumiendo que req.user viene de auth middleware

    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const user = await Usuario.findByPk(userId);
    if (!user || user.roleId !== EMPLOYEE_ROLE_ID) {
      return res.status(403).json({ message: 'Acceso solo permitido a empleados' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error en validación de rol', error });
  }
}

module.exports = { isEmployee };
