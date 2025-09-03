const { Usuario } = require('../models/User');
const Scheduling = require('../models/Scheduling');

module.exports = {
  validateCreate: async (req, res, next) => {
    const { fecha_inicio, hora_entrada, hora_salida, id_usuario } = req.body;

    // Validaciones estrictas SOLO para POST
    if (!fecha_inicio || !hora_entrada || !hora_salida || !id_usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (hora_salida <= hora_entrada) {
      return res.status(400).json({ message: "La hora de salida debe ser mayor que la de entrada." });
    }

    try {
      const user = await Usuario.findByPk(id_usuario);
      if (!user) {
        return res.status(400).json({ message: "El usuario no existe." });
      }

      if (user.roleId !== 2) {
        return res.status(400).json({ message: "El usuario no es un empleado." });
      }

      const existing = await Scheduling.findOne({
        where: { fecha_inicio, hora_entrada, id_usuario }
      });
      if (existing) {
        return res.status(400).json({ message: "Ya existe una programación para ese usuario en esa fecha y hora." });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "Error validando programación", error: err.message });
    }
  },

  validateUpdate: async (req, res, next) => {
    const { hora_entrada, hora_salida } = req.body;

    // Para PUT, solo validamos reglas de consistencia
    if (hora_entrada && hora_salida && hora_salida <= hora_entrada) {
      return res.status(400).json({ message: "La hora de salida debe ser mayor que la de entrada." });
    }

    next();
  }
};