const { body, query } = require('express-validator');
const { validateRequest } = require('./validationMiddleware');

// Validaciones para crear producto
const validateCreateProducto = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('id_categoria_producto')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de categoría debe ser un número entero positivo'),
  
  body('costo')
    .optional()
    .isFloat({ min: 0.01, max: 9999999.99 })
    .withMessage('El costo debe ser un número entre 0.01 y 9,999,999.99'),
  
  body('iva')
    .optional()
    .isFloat({ min: 0, max: 40 })
    .withMessage('El IVA debe ser un número entre 0 y 40'),
  
  body('precio_venta')
    .isFloat({ min: 0.01, max: 9999999.99 })
    .withMessage('El precio de venta es requerido y debe ser un número entre 0.01 y 9,999,999.99'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),
  
  body('url_foto')
    .optional()
    .isURL()
    .withMessage('La URL de la foto debe ser una URL válida'),
  
  body('caracteristicas')
    .optional()
    .isArray()
    .withMessage('Las características deben ser un array'),
  
  body('caracteristicas.*.id_caracteristica')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de característica debe ser un número entero positivo'),
  
  body('caracteristicas.*.valor')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El valor de la característica no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('El valor de la característica no puede exceder 255 caracteres'),
  
  validateRequest
];

// Validaciones para actualizar producto
const validateUpdateProducto = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto no puede estar vacío')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('id_categoria_producto')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de categoría debe ser un número entero positivo'),
  
  body('costo')
    .optional()
    .isFloat({ min: 0.01, max: 9999999.99 })
    .withMessage('El costo debe ser un número entre 0.01 y 9,999,999.99'),
  
  body('iva')
    .optional()
    .isFloat({ min: 0, max: 40 })
    .withMessage('El IVA debe ser un número entre 0 y 40'),
  
  body('precio_venta')
    .optional()
    .isFloat({ min: 0.01, max: 9999999.99 })
    .withMessage('El precio de venta debe ser un número entre 0.01 y 9,999,999.99'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),
  
  body('url_foto')
    .optional()
    .isURL()
    .withMessage('La URL de la foto debe ser una URL válida'),
  
  validateRequest
];

// Validaciones para búsqueda de productos
const validateSearchProducto = [
  query('nombre')
    .trim()
    .notEmpty()
    .withMessage('El parámetro nombre es requerido para la búsqueda')
    .isLength({ min: 2 })
    .withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
  
  validateRequest
];

// Validaciones para filtros de productos
const validateFilterProducto = [
  query('categoria')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de categoría debe ser un número entero positivo'),
  
  query('precio_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número no negativo'),
  
  query('precio_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número no negativo'),
  
  query('stock_min')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock mínimo debe ser un número entero no negativo'),
  
  validateRequest
];

module.exports = {
  validateCreateProducto,
  validateUpdateProducto,
  validateSearchProducto,
  validateFilterProducto
};
