// middlewares/ServicesMiddleware.js
/**
 * Middleware to validate data for creating/updating services
 */
const validateServiceData = (req, res, next) => {
  const { nombre, id_categoria_servicio, duracion, precio } = req.body;

  // Validate required fields
  if (!nombre) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Validate name format (letters, accents and spaces)
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nameRegex.test(nombre)) {
    return res.status(400).json({
      error: "Name can only contain letters, accents, and spaces",
    });
  }

  if (nombre.length > 20) {
    return res.status(400).json({
      error: "Name cannot exceed 20 characters",
    });
  }

  // Validate category ID
  if (!id_categoria_servicio) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  // Validate duration
  if (!duracion || duracion <= 0) {
    return res.status(400).json({ error: "Duration must be greater than 0" });
  }

  // Validate price
  if (!precio || precio <= 0) {
    return res.status(400).json({ error: "Price must be greater than 0" });
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
        error: "Name can only contain letters, accents, and spaces",
      });
    }
    if (nombre.length > 20) {
      return res.status(400).json({
        error: "Name cannot exceed 20 characters",
      });
    }
  }

  if (descripcion && descripcion.length > 100) {
    return res.status(400).json({
      error: "Description cannot exceed 100 characters",
    });
  }

  if (duracion && duracion <= 0) {
    return res.status(400).json({
      error: "Duration must be greater than 0",
    });
  }

  if (precio && precio <= 0) {
    return res.status(400).json({
      error: "Price must be greater than 0",
    });
  }

  if (estado) {
    const validStates = ["Activo", "Inactivo"];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        error: "Invalid status. Must be 'Activo' or 'Inactivo'",
      });
    }
  }

  next();
};

module.exports = {
  validateServiceData,
  validateServiceUpdate,
};
