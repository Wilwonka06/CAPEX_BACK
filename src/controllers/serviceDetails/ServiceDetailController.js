const ServiceDetailService = require('../../services/serviceDetails/ServiceDetailService');
const { asyncHandler } = require('../../middlewares/ErrorMiddleware');

class ServiceDetailController {
  // ===== BASIC SERVICE DETAIL OPERATIONS =====
  
  // Get all service details
  static getAllServiceDetails = asyncHandler(async (req, res) => {
    const result = await ServiceDetailService.getAllServiceDetails();
    res.json(result);
  });

  // Get service detail by ID
  static getServiceDetailById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.getServiceDetailById(id);
    res.json(result);
  });

  // Create new service detail
  static createServiceDetail = asyncHandler(async (req, res) => {
    const result = await ServiceDetailService.createServiceDetail(req.body);
    res.status(201).json(result);
  });

  // Update service detail
  static updateServiceDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetail(id, req.body);
    res.json(result);
  });

  // Delete service detail
  static deleteServiceDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.deleteServiceDetail(id);
    res.json(result);
  });

  // ===== SPECIFIC SERVICE DETAIL OPERATIONS =====

  // Update service detail status
  static updateServiceDetailStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, status);
    res.json(result);
  });

  // Get service details by status
  static getServiceDetailsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.params;
    const result = await ServiceDetailService.getServiceDetailsByStatus(status);
    res.json(result);
  });

  // Get service details by employee
  static getServiceDetailsByEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;
    const result = await ServiceDetailService.getServiceDetailsByEmployee(employeeId);
    res.json(result);
  });

  // Get service details by date range
  static getServiceDetailsByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;
    const result = await ServiceDetailService.getServiceDetailsByDateRange(startDate, endDate);
    res.json(result);
  });

  // Get service details statistics
  static getServiceDetailStats = asyncHandler(async (req, res) => {
    const result = await ServiceDetailService.getServiceDetailStats();
    res.json(result);
  });

  // ===== SALES CONVERSION OPERATIONS =====

  // Get service details ready for sales conversion
  static getServiceDetailsForSales = asyncHandler(async (req, res) => {
    const result = await ServiceDetailService.getServiceDetailsForSales();
    res.json(result);
  });

  // Convert service detail to sale
  static convertToSale = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.convertToSale(id);
    res.json(result);
  });

  // ===== ORDER OF SERVICE OPERATIONS =====

  // Get service details in "En proceso" status (Order of Service)
  static getOrderOfService = asyncHandler(async (req, res) => {
    const result = await ServiceDetailService.getServiceDetailsByStatus('En proceso');
    res.json(result);
  });

  // Start service (change status to "En proceso")
  static startService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, 'En proceso');
    res.json(result);
  });

  // Complete service (change status to "Finalizada")
  static completeService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, 'Finalizada');
    res.json(result);
  });

  // ===== SCHEDULING OPERATIONS =====

  // Get scheduled services (status: "Agendada")
  static getScheduledServices = asyncHandler(async (req, res) => {
    const result = await ServiceDetailService.getServiceDetailsByStatus('Agendada');
    res.json(result);
  });

  // Confirm scheduled service (change status to "Confirmada")
  static confirmScheduledService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, 'Confirmada');
    res.json(result);
  });

  // Reschedule service (change status to "Reprogramada")
  static rescheduleService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, 'Reprogramada');
    res.json(result);
  });

  // ===== CANCELLATION OPERATIONS =====

  // Cancel service by client (change status to "Cancelada por el cliente")
  static cancelByClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, 'Cancelada por el cliente');
    res.json(result);
  });

  // Mark as no-show (change status to "No asistio")
  static markAsNoShow = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await ServiceDetailService.updateServiceDetailStatus(id, 'No asistio');
    res.json(result);
  });
}

module.exports = ServiceDetailController;
