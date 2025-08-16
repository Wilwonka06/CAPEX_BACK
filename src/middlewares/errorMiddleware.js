// Middleware para manejar errores de Sequelize
const handleSequelizeError = (error, req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }))
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Conflicto: El registro ya existe',
      errors: error.errors.map(err => ({
        field: err.path,
        message: `El valor '${err.value}' ya existe en el campo ${err.path}`,
        value: err.value
      }))
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Error de referencia: El registro referenciado no existe',
      error: error.message
    });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Error de base de datos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }

  next(error);
};

// Middleware para manejar errores generales
const handleGeneralError = (error, req, res, next) => {
  console.error('Error:', error);

  // Si es un error de validación de Joi o similar
  if (error.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Si es un error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición'
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
};

// Middleware para manejar rutas no encontradas
const handleNotFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
};

// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Middleware para validar Content-Type
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      return res.status(415).json({
        success: false,
        message: 'Content-Type debe ser application/json'
      });
    }
  }
  next();
};

module.exports = {
  handleSequelizeError,
  handleGeneralError,
  handleNotFound,
  requestLogger,
  validateContentType
};
