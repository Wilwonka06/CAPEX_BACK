const ventaProductoService = require('../../services/salesProducts/SalesProductServices');

// Obtener todas las ventas
const getAllVentas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await ventaProductoService.getAllVentas(page, limit);
    
    res.status(200).json({
      success: true,
      data: result.ventas,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Búsqueda global de ventas
const searchVentas = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido'
      });
    }

    const result = await ventaProductoService.searchVentas(q.trim(), page, limit);

    res.status(200).json({
      success: true,
      data: result.ventas,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al buscar ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener venta por ID
const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await ventaProductoService.getVentaById(id);

    if (!venta) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: venta
    });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nueva venta
const createVenta = async (req, res) => {
  try {
    const ventaData = req.body;

    // Validaciones básicas
    if (!ventaData.fecha) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    if (!ventaData.detalles || !Array.isArray(ventaData.detalles) || ventaData.detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere al menos un producto en la venta'
      });
    }

    const nuevaVenta = await ventaProductoService.createVenta(ventaData);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    
    if (error.message.includes('Cliente no encontrado') || 
        error.message.includes('Producto con ID') || 
        error.message.includes('Stock insuficiente')) {
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

// Actualizar venta
const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const ventaActualizada = await ventaProductoService.updateVenta(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Venta actualizada exitosamente',
      data: ventaActualizada
    });
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    
    if (error.message === 'Venta no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('No se pueden modificar') || 
        error.message.includes('Stock insuficiente') ||
        error.message.includes('Producto con ID')) {
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

// Cancelar venta
const cancelarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ventaCancelada = await ventaProductoService.cancelarVenta(id);

    res.status(200).json({
      success: true,
      message: 'Venta cancelada exitosamente',
      data: ventaCancelada
    });
  } catch (error) {
    console.error('Error al cancelar venta:', error);
    
    if (error.message === 'Venta no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'La venta ya está cancelada') {
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

// Obtener ventas por cliente
const getVentasByCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await ventaProductoService.getVentasByCliente(id, page, limit);

    res.status(200).json({
      success: true,
      data: result.ventas,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener ventas por cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener ventas por rango de fechas
const getVentasByFechas = async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!inicio || !fin) {
      return res.status(400).json({
        success: false,
        message: 'Las fechas de inicio y fin son requeridas'
      });
    }

    const result = await ventaProductoService.getVentasByFechas(inicio, fin, page, limit);

    res.status(200).json({
      success: true,
      data: result.ventas,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener ventas por fechas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllVentas,
  searchVentas,
  getVentaById,
  createVenta,
  updateVenta,
  cancelarVenta,
  getVentasByCliente,
  getVentasByFechas
};