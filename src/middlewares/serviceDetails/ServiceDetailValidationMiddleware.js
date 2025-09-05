const { body, param, validationResult } = require('express-validator');

class ServiceDetailValidationMiddleware {
  // Validación para obtener por ID
  static validateGetById = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para crear con nuevos criterios de aceptación
  static validateCreate = [
    // Validar que existe al menos un servicio o producto
    body().custom((value, { req }) => {
      const { productId, serviceId } = req.body;
      if (!productId && !serviceId) {
        throw new Error('Debe especificar al menos un producto o servicio');
      }
      return true;
    }).withMessage('Debe especificar al menos un producto o servicio'),

    // Validar serviceClientId (cliente asociado)
    body('serviceClientId')
      .isInt({ min: 1 })
      .withMessage('El ID del servicio cliente debe ser un número entero positivo'),

    // Validar productId (opcional)
    body('productId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del producto debe ser un número entero positivo'),

    // Validar serviceId (opcional)
    body('serviceId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del servicio debe ser un número entero positivo'),

    // Validar cantidad de servicios
    body('serviceQuantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La cantidad de servicios debe ser un número entero positivo'),

    // Validar cantidad de productos
    body('productQuantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La cantidad de productos debe ser un número entero positivo'),

    // Validar cantidad general (para compatibilidad)
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser un número entero positivo'),

    // Validar precio unitario
    body('unitPrice')
      .isFloat({ min: 0 })
      .withMessage('El precio unitario debe ser un número positivo'),

    // Validar subtotal (opcional, se calcula automáticamente)
    body('subtotal')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El subtotal debe ser un número positivo'),

    // Validar estado
    body('status')
      .optional()
      .isIn(['En ejecución', 'Pagada', 'Anulada'])
      .withMessage('El estado debe ser: En ejecución, Pagada o Anulada'),

    // Validar empleado asociado al servicio (solo obligatorio si hay servicio)
    body('empleadoId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del empleado debe ser un número entero positivo'),

    // Validación personalizada: empleadoId es obligatorio solo si hay servicio
    body().custom((value, { req }) => {
      const { serviceId, empleadoId } = req.body;
      if (serviceId && !empleadoId) {
        throw new Error('El empleado es obligatorio cuando se especifica un servicio');
      }
      return true;
    }).withMessage('El empleado es obligatorio cuando se especifica un servicio'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para actualizar (con verificación de estado)
  static validateUpdate = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    
    // Validar que existe al menos un servicio o producto
    body().custom((value, { req }) => {
      const { productId, serviceId } = req.body;
      if (req.body.hasOwnProperty('productId') || req.body.hasOwnProperty('serviceId')) {
        if (!productId && !serviceId) {
          throw new Error('Debe especificar al menos un producto o servicio');
        }
      }
      return true;
    }).withMessage('Debe especificar al menos un producto o servicio'),

    body('serviceClientId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del servicio cliente debe ser un número entero positivo'),
    body('productId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del producto debe ser un número entero positivo'),
    body('serviceId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del servicio debe ser un número entero positivo'),
    body('serviceQuantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La cantidad de servicios debe ser un número entero positivo'),
    body('productQuantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La cantidad de productos debe ser un número entero positivo'),
    body('quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser un número entero positivo'),
    body('unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio unitario debe ser un número positivo'),
    body('subtotal')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El subtotal debe ser un número positivo'),
    body('status')
      .optional()
      .isIn(['En ejecución', 'Pagada', 'Anulada'])
      .withMessage('El estado debe ser: En ejecución, Pagada o Anulada'),
    body('empleadoId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del empleado debe ser un número entero positivo'),

    // Validación personalizada: empleadoId es obligatorio solo si hay servicio
    body().custom((value, { req }) => {
      const { serviceId, empleadoId } = req.body;
      if (req.body.hasOwnProperty('serviceId') && serviceId && !empleadoId) {
        throw new Error('El empleado es obligatorio cuando se especifica un servicio');
      }
      return true;
    }).withMessage('El empleado es obligatorio cuando se especifica un servicio'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para eliminar
  static validateDelete = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para cambiar estado (con verificación de estado actual)
  static validateChangeStatus = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    body('estado')
      .isIn(['En ejecución', 'Pagada', 'Anulada'])
      .withMessage('El estado debe ser: En ejecución, Pagada o Anulada'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para obtener por servicio cliente
  static validateGetByServiceClient = [
    param('serviceClientId').isInt({ min: 1 }).withMessage('El ID del servicio cliente debe ser un número entero positivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para obtener por producto
  static validateGetByProduct = [
    param('productId').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para obtener por servicio
  static validateGetByService = [
    param('serviceId').isInt({ min: 1 }).withMessage('El ID del servicio debe ser un número entero positivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para obtener por empleado
  static validateGetByEmployee = [
    param('empleadoId').isInt({ min: 1 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para anular servicio o producto específico del detalle (NO ELIMINAR)
  static validateRemoveServiceOrProduct = [
    param('id').isInt({ min: 1 }).withMessage('El ID del detalle debe ser un número entero positivo'),
    
    // Validar que se especifique al menos un serviceId o productId
    body().custom((value, { req }) => {
      const { serviceId, productId } = req.body;
      if (!serviceId && !productId) {
        throw new Error('Debe especificar un serviceId o productId para anular');
      }
      return true;
    }).withMessage('Debe especificar un serviceId o productId para anular'),

    body('serviceId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del servicio debe ser un número entero positivo'),
    
    body('productId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del producto debe ser un número entero positivo'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];

  // Validación para agregar servicio o producto al detalle existente
  static validateAddServiceOrProduct = [
    param('serviceClientId').isInt({ min: 1 }).withMessage('El ID del servicio cliente debe ser un número entero positivo'),
    
    // Validar que existe al menos un servicio o producto
    body().custom((value, { req }) => {
      const { productId, serviceId } = req.body;
      if (!productId && !serviceId) {
        throw new Error('Debe especificar al menos un producto o servicio');
      }
      return true;
    }).withMessage('Debe especificar al menos un producto o servicio'),

    body('productId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del producto debe ser un número entero positivo'),

    body('serviceId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del servicio debe ser un número entero positivo'),

    body('empleadoId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del empleado debe ser un número entero positivo'),

    body('quantity')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser un número entero positivo'),

    body('unitPrice')
      .isFloat({ min: 0 })
      .withMessage('El precio unitario debe ser un número positivo'),

    body('subtotal')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El subtotal debe ser un número positivo'),

    body('status')
      .optional()
      .isIn(['En ejecución', 'Pagada', 'Anulada'])
      .withMessage('El estado debe ser: En ejecución, Pagada o Anulada'),

    // Validación personalizada: empleadoId es obligatorio solo si hay servicio
    body().custom((value, { req }) => {
      const { serviceId, empleadoId } = req.body;
      if (serviceId && !empleadoId) {
        throw new Error('El empleado es obligatorio cuando se especifica un servicio');
      }
      return true;
    }).withMessage('El empleado es obligatorio cuando se especifica un servicio'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: errors.array()
        });
      }
      next();
    }
  ];
}

module.exports = ServiceDetailValidationMiddleware;
