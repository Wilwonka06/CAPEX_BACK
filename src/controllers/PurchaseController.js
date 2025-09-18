const compraService = require('../services/PurchaseService');

// Obtener todas las compras
const getAllCompras = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const includeDetalles = req.query.includeDetalles !== 'false';

    const result = await compraService.getAllCompras(page, limit, includeDetalles);
    
    res.status(200).json({
      success: true,
      data: result.compras,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener una compra por ID
const getCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDetalles = req.query.includeDetalles !== 'false';
    
    const compra = await compraService.getCompraById(id, includeDetalles);

    if (!compra) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: compra
    });
  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear una nueva compra
const createCompra = async (req, res) => {
  try {
    const compraData = req.body;
    const nuevaCompra = await compraService.createCompra(compraData);

    res.status(201).json({
      success: true,
      message: 'Compra creada exitosamente',
      data: nuevaCompra
    });
  } catch (error) {
    console.error('Error al crear compra:', error);
    
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

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancelar una compra
const cancelarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await compraService.cancelarCompra(id);

    res.status(200).json({
      success: true,
      message: 'Compra cancelada exitosamente',
      data: compra
    });
  } catch (error) {
    console.error('Error al cancelar compra:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener compras por proveedor
const getComprasByProveedor = async (req, res) => {
  try {
    const { idProveedor } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await compraService.getComprasByProveedor(idProveedor, page, limit);
    
    res.status(200).json({
      success: true,
      data: result.compras,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener compras por proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Filtrar compras por fecha
const getComprasByFecha = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await compraService.getComprasByFecha(fecha_inicio, fecha_fin, page, limit);
    
    res.status(200).json({
      success: true,
      data: result.compras,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al filtrar compras por fecha:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas de compras
const getEstadisticasCompras = async (req, res) => {
  try {
    const estadisticas = await compraService.getEstadisticas();
    
    res.status(200).json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllCompras,
  getCompraById,
  createCompra,
  cancelarCompra,
  getComprasByProveedor,
  getComprasByFecha,
  getEstadisticasCompras
};