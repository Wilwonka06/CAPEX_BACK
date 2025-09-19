// middlewares/ServicesMiddleware.js
/**
 * Middleware to validate data for creating/updating services
 */
const validateServiceData = (req, res, next) => {
  const { nombre, id_categoria_servicio, descripcion, duracion, precio } = req.body;

  // Validate required fields
  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  // Validate name format (letters, accents and spaces)
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nameRegex.test(nombre)) {
    return res.status(400).json({
      message: "El nombre solo puede contener letras, acentos y espacios",
    });
  }

  if (nombre.length > 50 || nombre.length < 3) {
    return res.status(400).json({
      message: "El nombre debe tener entre 3 y 50 caracteres",
    });
  }

  // Validate category ID
  if (!id_categoria_servicio) {
    return res.status(400).json({ message: "El id de la categoria es obligatorio" });
  }

  if (descripcion && (descripcion.length > 255 || descripcion.length < 5)) {
    return res.status(400).json({ message: "La descripción debe tener entre 5 y 255 caracteres." });
  }

  // Validate duration
  if (!duracion || duracion <= 0) {
    return res.status(400).json({ message: "La duración debe ser mayor a 0" });
  }

  // Validate price
  if (!precio || precio <= 0) {
    return res.status(400).json({ message: "El precio debe ser mayor a 0" });
  }

  next();
};

/**
 * Middleware to validate data for updating services (optional fields)
 */
const validateServiceUpdate = (req, res, next) => {
  const { nombre, descripcion, duracion, precio, estado } = req.body;

  if (nombre) {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nameRegex.test(nombre)) {
      return res.status(400).json({
        message: "El nombre solo puede contener letras, acentos y espacios",
      });
    }
    if (nombre.length > 50 || nombre.length < 3) {
      return res.status(400).json({
        message: "El nombre debe tener entre 3 y 50 caracteres",
      });
    }
  }

  if (descripcion && (descripcion.length > 255 || descripcion.length < 5)) {
    return res.status(400).json({
      message: "La descripción debe tener entre 5 y 255 caracteres.",
    });
  }

  if (duracion && duracion <= 0) {
    return res.status(400).json({
      message: "La duración debe ser mayor a 0",
    });
  }

  if (precio && precio <= 0) {
    return res.status(400).json({
      message: "El precio debe ser mayor a 0",
    });
  }

  if (estado) {
    const validStates = ["Activo", "Inactivo"];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        message: "Estado inválido. Debe ser: Activo o Inactivo",
      });
    }
  }

  next();
};

const validateServiceSearch = (req, res, next) => {
  const { precio, duracion, estado, id_categoria_servicio } = req.query;

  // Validar precio (número o rango tipo 100-200)
  if (precio && !/^\d+(-\d+)?$/.test(precio)) {
    return res.status(400).json({
      success: false,
      message: "El precio debe ser un número o un rango (ejemplo: 100 o 100-200)"
    });
  }

  // Validar duración (número o rango tipo 30-60)
  if (duracion && !/^\d+(-\d+)?$/.test(duracion)) {
    return res.status(400).json({
      success: false,
      message: "La duración debe ser un número o un rango (ejemplo: 30 o 30-60)"
    });
  }

  // Validar estado
  if (estado) {
    const validStates = ['Activo', 'Inactivo'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "El estado debe ser 'Activo' o 'Inactivo'"
      });
    }
  }

  // Validar categoría
  if (id_categoria_servicio && isNaN(Number(id_categoria_servicio))) {
    return res.status(400).json({
      success: false,
      message: "El id_categoria_servicio debe ser un número"
    });
  }

  next();
};

module.exports = {
  validateServiceData,
  validateServiceUpdate,
  validateServiceSearch,
};