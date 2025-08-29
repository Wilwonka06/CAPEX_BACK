// src/middlewares/ServiceCategoryMiddleware.js

/**
 * Middleware para validar datos de creación/actualización de categorías de servicios
 */
const validateServiceCategoryData = (req, res, next) => {
  const { nombre, descripcion, estado } = req.body;

  // Validar campos obligatorios para creación
  if (!nombre) {
    return res.status(400).json({
      success: false,
      message: 'El nombre es obligatorio.',
    });
  }

  // Validar formato del nombre (solo letras, incluyendo acentos)
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nameRegex.test(nombre)) {
    return res.status(400).json({
      success: false,
      message: 'El nombre solo puede contener letras (incluyendo acentos).',
    });
  }

  // Validar longitud del nombre (máximo 20 caracteres)
  if (nombre.length > 20) {
    return res.status(400).json({
      success: false,
      message: 'El nombre no puede tener más de 20 caracteres.',
    });
  }

  // Validar descripción si se proporciona (máximo 100 caracteres)
  if (!descripcion && descripcion.length > 100 && descripcion.length < 5) {
    return res.status(400).json({
      message: "La descripción es obligatoria, no puede tener más de 100 caracteres ni ser menor a 5.",
    });
  }

  // Validar estado si se proporciona
  if (estado) {
    const validStates = ['Activo', 'Inactivo'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: Activo o Inactivo.',
      });
    }
  }

  next();
};

/**
 * Middleware para validar datos de actualización de categorías (campos opcionales)
 */
const validateServiceCategoryUpdate = (req, res, next) => {
  const { nombre, descripcion, estado } = req.body;

  // Si se proporciona nombre, validar formato
  if (nombre) {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nameRegex.test(nombre)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre solo puede contener letras (incluyendo acentos).',
      });
    }

    if (nombre.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'El nombre no puede tener más de 20 caracteres.',
      });
    }
  }

  // Si se proporciona descripción, validar longitud
  if (!descripcion && descripcion.length > 100 && descripcion.length < 5) {
    return res.status(400).json({
      message: "La descripción es obligatoria, no puede tener más de 100 caracteres ni ser menor a 5.",
    });
  }

  // Si se proporciona estado, validar
  if (estado) {
    const validStates = ['Activo', 'Inactivo'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: Activo o Inactivo.',
      });
    }
  }

  next();
};

const validateServiceCategorySearch = (req, res, next) => {
  const { nombre, estado } = req.query;

  if (nombre) {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nameRegex.test(nombre)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre solo puede contener letras y espacios (incluyendo acentos).',
      });
    }
    if (nombre.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'El nombre no puede tener más de 20 caracteres.',
      });
    }
  }

  if (estado) {
    const validStates = ['Activo', 'Inactivo'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "El estado debe ser 'Activo' o 'Inactivo'.",
      });
    }
  }

  next();
};

module.exports = {
  validateServiceCategoryData,
  validateServiceCategoryUpdate,
  validateServiceCategorySearch, // 👈 exporta el nuevo
};