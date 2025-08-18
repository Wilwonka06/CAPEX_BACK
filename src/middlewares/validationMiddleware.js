const { validationResult } = require('express-validator');

// Middleware para validar los resultados de express-validator
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Middleware para validar que el ID sea un número válido
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido. Debe ser un número entero positivo'
    });
  }
  
  req.params.id = parseInt(id);
  next();
};

// Middleware para validar paginación
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      message: 'Parámetros de paginación inválidos. page >= 1, limit entre 1 y 100'
    });
  }
  
  req.query.page = pageNum;
  req.query.limit = limitNum;
  next();
};

module.exports = {
  validateRequest,
  validateId,
  validatePagination
};
