// controllers/serviceController.js
const ServicesService = require("../services/ServicesService");

// Create service
exports.create = async (req, res) => {
  try {
    const service = await ServicesService.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all services
exports.getAll = async (req, res) => {
  try {
    const services = await ServicesService.getAllServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get service by ID
exports.getById = async (req, res) => {
  try {
    const service = await ServicesService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update service
exports.update = async (req, res) => {
  try {
    const service = await ServicesService.updateService(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete service
exports.delete = async (req, res) => {
  try {
    const result = await ServicesService.deleteService(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
