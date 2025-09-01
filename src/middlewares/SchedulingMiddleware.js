module.exports = {
  validateScheduling(req, res, next) {
    const { fecha_inicio, hora_entrada, hora_salida, id_usuario } = req.body;

    if (!fecha_inicio || !hora_entrada || !hora_salida || !id_usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (hora_salida <= hora_entrada) {
      return res.status(400).json({ message: "La hora de salida debe ser mayor que la de entrada." });
    }

    next();
  }
};

// const User = require('../models/User');

// module.exports = {
//   validateScheduling: async (req, res, next) => {
//     const { fecha_inicio, hora_entrada, hora_salida, id_usuario } = req.body;

//     // Validaciones básicas
//     if (!fecha_inicio || !hora_entrada || !hora_salida || !id_usuario) {
//       return res.status(400).json({ message: "Todos los campos son obligatorios." });
//     }

//     if (hora_salida <= hora_entrada) {
//       return res.status(400).json({ message: "La hora de salida debe ser mayor que la de entrada." });
//     }

//     // Validar que el usuario exista y sea empleado
//     try {
//       const user = await User.findByPk(id_usuario);

//       if (!user) {
//         return res.status(400).json({ message: "El usuario no existe." });
//       }

//       if (user.rol !== 'empleado') {
//         return res.status(400).json({ message: "El usuario no es un empleado." });
//       }

//       next();
//     } catch (err) {
//       return res.status(500).json({ message: "Error validando usuario", error: err.message });
//     }
//   }
// };
