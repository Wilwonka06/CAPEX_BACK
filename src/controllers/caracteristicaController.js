const Caracteristica = require('../models/Caracteristica');
const Producto = require('../models/Producto');

// Obtener todas las características
const getAllCaracteristicas = async (req, res) => {
  try {
    const caracteristicas = await Caracteristica.findAll({
      include: [
        {
          model: Producto,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: caracteristicas,
      count: caracteristicas.length
    });
  } catch (error) {
    console.error('Error al obtener características:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener una característica por ID
const getCaracteristicaById = async (req, res) => {
  try {
    const { id } = req.params;
    const caracteristica = await Caracteristica.findByPk(id, {
      include: [
        {
          model: Producto,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ]
    });

    if (!caracteristica) {
      return res.status(404).json({
        success: false,
        message: 'Característica no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: caracteristica
    });
  } catch (error) {
    console.error('Error al obtener característica:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear una nueva característica
const createCaracteristica = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Verificar si el nombre ya existe
    const existingCaracteristica = await Caracteristica.findOne({ where: { nombre } });
    if (existingCaracteristica) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la característica ya existe'
      });
    }

    // Crear la característica
    const newCaracteristica = await Caracteristica.create({
      nombre
    });

    res.status(201).json({
      success: true,
      message: 'Característica creada exitosamente',
      data: newCaracteristica
    });
  } catch (error) {
    console.error('Error al crear característica:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar una característica
const updateCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const caracteristica = await Caracteristica.findByPk(id);
    if (!caracteristica) {
      return res.status(404).json({
        success: false,
        message: 'Característica no encontrada'
      });
    }

    // Si se está actualizando el nombre, verificar que no exista
    if (nombre && nombre !== caracteristica.nombre) {
      const existingCaracteristica = await Caracteristica.findOne({ where: { nombre } });
      if (existingCaracteristica) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la característica ya existe'
        });
      }
    }

    await caracteristica.update({ nombre });

    res.status(200).json({
      success: true,
      message: 'Característica actualizada exitosamente',
      data: caracteristica
    });
  } catch (error) {
    console.error('Error al actualizar característica:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar una característica
const deleteCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    
    const caracteristica = await Caracteristica.findByPk(id);
    if (!caracteristica) {
      return res.status(404).json({
        success: false,
        message: 'Característica no encontrada'
      });
    }

    await caracteristica.destroy();

    res.status(200).json({
      success: true,
      message: 'Característica eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar característica:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllCaracteristicas,
  getCaracteristicaById,
  createCaracteristica,
  updateCaracteristica,
  deleteCaracteristica
};
