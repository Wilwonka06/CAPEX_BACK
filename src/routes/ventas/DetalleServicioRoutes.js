const express = require('express');
const router = express.Router();
const ServiceDetailController = require('../../controllers/serviceDetails/ServiceDetailController');
const {
  validateCreateServiceDetail,
  validateUpdateServiceDetail,
  validateServiceDetailId,
  validateDeleteServiceDetail,
  validateUpdateStatus,
  validateStatus,
  validateEmployeeId,
  validateDateRange,
  validateConvertToSale,
  validatePaidServiceModification,
  validatePaidServiceStatusChange
} = require('../../middlewares/serviceDetails/ServiceDetailValidationMiddleware');
const {
  authenticateToken,
  requirePermission
} = require('../../middlewares/AuthMiddleware');

// ===== RUTAS BÁSICAS DE DETALLES DE SERVICIOS =====

// GET /api/ventas/detalles-servicios - Obtener todos los detalles de servicios
router.get('/', 
  authenticateToken,
  requirePermission('read'),
  ServiceDetailController.getAllServiceDetails
);

// GET /api/ventas/detalles-servicios/:id - Obtener detalle de servicio por ID
router.get('/:id', 
  authenticateToken,
  requirePermission('read'),
  validateServiceDetailId,
  ServiceDetailController.getServiceDetailById
);

// POST /api/ventas/detalles-servicios - Crear nuevo detalle de servicio
router.post('/', 
  authenticateToken,
  requirePermission('create'),
  validateCreateServiceDetail,
  ServiceDetailController.createServiceDetail
);

// PUT /api/ventas/detalles-servicios/:id - Actualizar detalle de servicio
router.put('/:id', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceModification,
  validateUpdateServiceDetail,
  ServiceDetailController.updateServiceDetail
);

// DELETE /api/ventas/detalles-servicios/:id - Eliminar detalle de servicio
router.delete('/:id', 
  authenticateToken,
  requirePermission('delete'),
  validateServiceDetailId,
  validatePaidServiceModification,
  ServiceDetailController.deleteServiceDetail
);

// ===== RUTAS DE GESTIÓN DE ESTADOS =====

// PATCH /api/ventas/detalles-servicios/:id/status - Actualizar estado del detalle de servicio
router.patch('/:id/status', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  validateUpdateStatus,
  ServiceDetailController.updateServiceDetailStatus
);

// GET /api/ventas/detalles-servicios/status/:status - Obtener detalles por estado
router.get('/status/:status', 
  authenticateToken,
  requirePermission('read'),
  validateStatus,
  ServiceDetailController.getServiceDetailsByStatus
);

// ===== RUTAS DE ORDEN DE SERVICIO =====

// GET /api/ventas/detalles-servicios/orden-servicio - Obtener orden de servicio (En proceso)
router.get('/orden-servicio/list', 
  authenticateToken,
  requirePermission('read'),
  ServiceDetailController.getOrderOfService
);

// PATCH /api/ventas/detalles-servicios/:id/iniciar - Iniciar servicio (cambiar a "En proceso")
router.patch('/:id/iniciar', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  ServiceDetailController.startService
);

// PATCH /api/ventas/detalles-servicios/:id/completar - Completar servicio (cambiar a "Finalizada")
router.patch('/:id/completar', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  ServiceDetailController.completeService
);

// ===== RUTAS DE AGENDAMIENTO =====

// GET /api/ventas/detalles-servicios/agendados - Obtener servicios agendados
router.get('/agendados/list', 
  authenticateToken,
  requirePermission('read'),
  ServiceDetailController.getScheduledServices
);

// PATCH /api/ventas/detalles-servicios/:id/confirmar - Confirmar servicio agendado
router.patch('/:id/confirmar', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  ServiceDetailController.confirmScheduledService
);

// PATCH /api/ventas/detalles-servicios/:id/reprogramar - Reprogramar servicio
router.patch('/:id/reprogramar', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  ServiceDetailController.rescheduleService
);

// ===== RUTAS DE VENTA =====

// GET /api/ventas/detalles-servicios/para-venta - Obtener servicios listos para venta
router.get('/para-venta/list', 
  authenticateToken,
  requirePermission('read'),
  ServiceDetailController.getServiceDetailsForSales
);

// PATCH /api/ventas/detalles-servicios/:id/convertir-venta - Convertir a venta
router.patch('/:id/convertir-venta', 
  authenticateToken,
  requirePermission('update'),
  validateConvertToSale,
  ServiceDetailController.convertToSale
);

// ===== RUTAS DE CANCELACIÓN =====

// PATCH /api/ventas/detalles-servicios/:id/cancelar-usuario - Cancelar por usuario
router.patch('/:id/cancelar-usuario',
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  ServiceDetailController.cancelByUser
);

// PATCH /api/ventas/detalles-servicios/:id/no-asistio - Marcar como no asistió
router.patch('/:id/no-asistio', 
  authenticateToken,
  requirePermission('update'),
  validateServiceDetailId,
  validatePaidServiceStatusChange,
  ServiceDetailController.markAsNoShow
);

// ===== RUTAS DE CONSULTA ESPECÍFICA =====

// GET /api/ventas/detalles-servicios/empleado/:employeeId - Obtener por empleado
router.get('/empleado/:employeeId', 
  authenticateToken,
  requirePermission('read'),
  validateEmployeeId,
  ServiceDetailController.getServiceDetailsByEmployee
);

// POST /api/ventas/detalles-servicios/rango-fechas - Obtener por rango de fechas
router.post('/rango-fechas/search', 
  authenticateToken,
  requirePermission('read'),
  validateDateRange,
  ServiceDetailController.getServiceDetailsByDateRange
);

// ===== RUTAS DE ESTADÍSTICAS =====

// GET /api/ventas/detalles-servicios/stats - Obtener estadísticas
router.get('/stats/overview', 
  authenticateToken,
  requirePermission('read'),
  ServiceDetailController.getServiceDetailStats
);

module.exports = router;
