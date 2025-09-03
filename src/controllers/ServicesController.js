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

exports.search = async (req, res) => {
  try {
    const servicios = await ServicesService.searchServices(req.query);

    res.status(200).json({
      success: true,
      data: servicios, // puede ser [] si no hay resultados
      message: servicios.length > 0 
        ? "Servicios encontrados correctamente" 
        : "No se encontraron servicios con esos criterios"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar servicios",
      error: error.message
    });
  }
};


exports.changeStatus = async (req, res) =>{
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          success: false,
          error: 'Nuevo estado requerido'
        });
      }

      const category = await ServicesService.changeServiceStatus(id, estado);
      res.json({
        success: true,
        data: category,
        message: `Estado del servicio cambiado a ${estado}`
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
