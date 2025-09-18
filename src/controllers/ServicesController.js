// controllers/serviceController.js
const ServicesService = require("../services/ServicesService");

// Helper function to handle Sequelize errors
const handleSequelizeError = (error, res) => {
  const timestamp = new Date().toISOString();
  
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: "El valor ingresado no existe en la tabla relacionada",
      error: "FOREIGN_KEY_CONSTRAINT_ERROR",
      timestamp
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: "El valor ingresado ya existe",
      error: "UNIQUE_CONSTRAINT_ERROR",
      timestamp
    });
  }
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      error: "VALIDATION_ERROR",
      validationErrors: error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      })),
      timestamp
    });
  }
  
  // For other errors
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: "INTERNAL_SERVER_ERROR",
    timestamp
  });
};


exports.create = async (req, res) => {
  try {
    const service = await ServicesService.createService(req.body);
    res.status(201).json({
      success: true,
      message: "Servicio creado exitosamente",
      data: service
    });
  } catch (error) {
    handleSequelizeError(error, res);
  }
};

// Get all services
exports.getAll = async (req, res) => {
  try {
    const services = await ServicesService.getAllServices();
    res.status(200).json({
      success: true,
      message: "Servicios obtenidos exitosamente",
      data: services
    });
  } catch (error) {
    handleSequelizeError(error, res);
  }
};

// Get service by ID
exports.getById = async (req, res) => {
  try {
    const service = await ServicesService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
        error: "SERVICE_NOT_FOUND",
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({
      success: true,
      message: "Servicio obtenido exitosamente",
      data: service
    });
  } catch (error) {
    handleSequelizeError(error, res);
  }
};

// Update service
exports.update = async (req, res) => {
  try {
    const service = await ServicesService.updateService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Servicio actualizado exitosamente",
      data: service
    });
  } catch (error) {
    handleSequelizeError(error, res);
  }
};

// Delete service
exports.delete = async (req, res) => {
  try {
    const result = await ServicesService.deleteService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Servicio eliminado exitosamente",
      data: result
    });
  } catch (error) {
    handleSequelizeError(error, res);
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
    handleSequelizeError(error, res);
  }
};


exports.changeStatus = async (req, res) =>{
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          success: false,
          message: "Nuevo estado requerido",
          error: "MISSING_STATUS",
          timestamp: new Date().toISOString()
        });
      }

      const service = await ServicesService.changeServiceStatus(id, estado);
      res.status(200).json({
        success: true,
        data: service,
        message: `Estado del servicio cambiado a ${estado}`
      });
    } catch (error) {
      handleSequelizeError(error, res);
    }
  }
