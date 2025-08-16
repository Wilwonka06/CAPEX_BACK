const CategoriaProducto = require('../models/CategoriaProducto');
const Producto = require('../models/Producto');
const categoriaProductoService = require('../services/categoriaProductoService');

// Obtener todas las categorías
const getAllCategorias = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await categoriaProductoService.getAllCategorias(page, limit);
    
    res.status(200).json({
      success: true,
      data: result.categorias,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaProductoService.getCategoriaById(id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: categoria
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    const newCategoria = await categoriaProductoService.createCategoria({
      nombre,
      estado: estado || 'Activo'
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategoria
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    
    if (error.message === 'El nombre de la categoría ya existe') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
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

// Actualizar una categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const categoria = await categoriaProductoService.updateCategoria(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    
    if (error.message === 'Categoría no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'El nombre de la categoría ya existe') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    await categoriaProductoService.deleteCategoria(id);

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    
    if (error.message === 'Categoría no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'No se puede eliminar la categoría porque tiene productos asociados') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Buscar categorías por nombre
const searchCategorias = async (req, res) => {
  try {
    const { nombre } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "nombre" es requerido'
      });
    }

    const result = await categoriaProductoService.searchCategorias(nombre, page, limit);

    res.status(200).json({
      success: true,
      data: result.categorias,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al buscar categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener categorías por estado
const getCategoriasByEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!estado || !['Activo', 'Inactivo'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'El estado debe ser "Activo" o "Inactivo"'
      });
    }

    const result = await categoriaProductoService.getCategoriasByEstado(estado, page, limit);

    res.status(200).json({
      success: true,
      data: result.categorias,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener categorías por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  searchCategorias,
  getCategoriasByEstado
};