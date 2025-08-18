// middlewares/validarServicio.js
module.exports = (req, res, next) => {
  const { nombre, id_categoria_servicio, duracion, precio } = req.body;

  if (!nombre || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(nombre)) {
    return res.status(400).json({ error: "Nombre inválido" });
  }

  if (!id_categoria_servicio) {
    return res.status(400).json({ error: "La categoría es obligatoria" });
  }

  if (!duracion || duracion <= 0) {
    return res.status(400).json({ error: "La duración debe ser mayor a 0" });
  }

  if (!precio || precio <= 0) {
    return res.status(400).json({ error: "El precio debe ser mayor a 0" });
  }

  next();
};
