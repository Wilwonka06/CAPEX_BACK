const salesService = require('../../services/salesProduct/SalesService');

// Obtener todas las ventas
const getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await salesService.getAllSales(page, limit);
    
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

// Obtener una venta por ID
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await salesService.getSaleById(id);

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

// Crear una nueva venta
const createSale = async (req, res) => {
  try {
    const ventaData = req.body;
    const nuevaVenta = await salesService.createSale(ventaData);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    
    if (error.message.includes('no existe') || 
        error.message.includes('Stock insuficiente') ||
        error.message.includes('debe tener al menos un producto')) {
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

// Crear venta desde pedido
const createSaleFromOrder = async (req, res) => {
  try {
    const { pedidoId } = req.body;
    
    if (!pedidoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del pedido es requerido'
      });
    }

    const nuevaVenta = await salesService.createSaleFromOrder(pedidoId);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente desde pedido',
      data: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta desde pedido:', error);
    
    if (error.message.includes('no encontrado') || 
        error.message.includes('Solo se pueden convertir') ||
        error.message.includes('Ya existe una venta') ||
        error.message.includes('Stock insuficiente')) {
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
const cancelSale = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await salesService.cancelSale(id);

    res.status(200).json({
      success: true,
      message: 'Venta cancelada exitosamente',
      data: venta
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

// Búsqueda global de ventas
const searchSales = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido'
      });
    }

    const result = await salesService.searchSales(q, page, limit);

    res.status(200).json({
      success: true,
      data: result.ventas,
      pagination: result.pagination,
      searchTerm: q
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

// Obtener ventas por estado
const getSalesByStatus = async (req, res) => {
  try {
    const { estado } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const estadosValidos = ['Completado', 'Cancelado', 'Pendiente'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    const result = await salesService.getSalesByStatus(estado, page, limit);

    res.status(200).json({
      success: true,
      data: result.ventas,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener ventas por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener ventas por cliente
const getSalesByClient = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await salesService.getSalesByClient(clienteId, page, limit);

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
const getSalesByDateRange = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Los parámetros fecha_inicio y fecha_fin son requeridos'
      });
    }

    const result = await salesService.getSalesByDateRange(fecha_inicio, fecha_fin, page, limit);

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

// Obtener estadísticas de ventas
const getSalesStatistics = async (req, res) => {
  try {
    const estadisticas = await salesService.getSalesStatistics();

    res.status(200).json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar método de pago
const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo_pago } = req.body;

    if (!metodo_pago) {
      return res.status(400).json({
        success: false,
        message: 'El método de pago es requerido'
      });
    }

    const venta = await salesService.updatePaymentMethod(id, metodo_pago);

    res.status(200).json({
      success: true,
      message: 'Método de pago actualizado exitosamente',
      data: venta
    });
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    
    if (error.message === 'Venta no encontrada') {
      return res.status(404).json({
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

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  createSaleFromOrder,
  cancelSale,
  searchSales,
  getSalesByStatus,
  getSalesByClient,
  getSalesByDateRange,
  getSalesStatistics,
  updatePaymentMethod
};