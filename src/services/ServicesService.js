// services/servicioService.js
const db = require("../models"); // importa el index.js de models
const Servicio = db.Servicio; // modelo de servicios

// Crear un servicio
const createServicio = async (data) => {
  try {
    const servicio = await Servicio.create({
      nombre: data.nombre,
      id_categoria_servicio: data.id_categoria_servicio,
      descripcion: data.descripcion,
      duracion: data.duracion,
      precio: data.precio,
      estado: data.estado || "Activo",
      foto: data.foto
    });
    return servicio;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los servicios
const getAllServicios = async () => {
  try {
    return await Servicio.findAll();
  } catch (error) {
    throw error;
  }
};

// Obtener un servicio por ID
const getServicioById = async (id_servicio) => {
  try {
    return await Servicio.findByPk(id_servicio);
  } catch (error) {
    throw error;
  }
};

// Actualizar un servicio
const updateServicio = async (id_servicio, data) => {
  try {
    const servicio = await Servicio.findByPk(id_servicio);
    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }
    await servicio.update({
      nombre: data.nombre,
      id_categoria_servicio: data.id_categoria_servicio,
      descripcion: data.descripcion,
      duracion: data.duracion,
      precio: data.precio,
      estado: data.estado,
      foto: data.foto
    });
    return servicio;
  } catch (error) {
    throw error;
  }
};

// Eliminar un servicio
const deleteServicio = async (id_servicio) => {
  try {
    const servicio = await Servicio.findByPk(id_servicio);
    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }
    await servicio.destroy();
    return { message: "Servicio eliminado correctamente" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createServicio,
  getAllServicios,
  getServicioById,
  updateServicio,
  deleteServicio,
};
