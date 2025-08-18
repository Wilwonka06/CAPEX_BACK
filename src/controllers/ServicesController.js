// controllers/servicioController.js
const servicioService = require("../services/servicioService");

// Crear un servicio
exports.create = async (req, res) => {
  try {
    const servicio = await servicioService.createServicio(req.body);
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos los servicios
exports.getAll = async (req, res) => {
  try {
    const servicios = await servicioService.getAllServicios();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un servicio por ID
exports.getById = async (req, res) => {
  try {
    const servicio = await servicioService.getServicioById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un servicio
exports.update = async (req, res) => {
  try {
    const servicio = await servicioService.updateServicio(req.params.id, req.body);
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un servicio
exports.delete = async (req, res) => {
  try {
    const result = await servicioService.deleteServicio(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
