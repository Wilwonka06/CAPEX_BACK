const pedidoService = require('../../services/salesProduct/OrderService');

// Obtener todos los pedidos
const getAllPedidos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await pedidoService.getAllPedidos(page, limit);
    
    res.status(200).json({
      success: true,
      data: result.pedidos,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un pedido por ID
const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.getPedidoById(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: pedido
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo pedido
const createPedido = async (req, res) => {
  try {
    const pedidoData = req.body;
    const newPedido = await pedidoService.createPedido(pedidoData);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: newPedido
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    
    if (error.message.includes('no existe') || 
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

// Actualizar un pedido
const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const pedido = await pedidoService.updatePedido(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Pedido actualizado exitosamente',
      data: pedido
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    
    if (error.message === 'Pedido no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes('no existe')) {
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

// Eliminar un pedido
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pedidoService.deletePedido(id);

    res.status(200).json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    
    if (error.message === 'Pedido no encontrado') {
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

// Búsqueda global de pedidos
const searchPedidos = async (req, res) => {
  try {
    const { q } = req.query; // Parámetro de búsqueda
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido'
      });
    }

    const result = await pedidoService.searchPedidos(q, page, limit);

    res.status(200).json({
      success: true,
      data: result.pedidos,
      pagination: result.pagination,
      searchTerm: q
    });
  } catch (error) {
    console.error('Error al buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener pedidos por estado
const getPedidosByEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const estadosValidos = ['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `El estado debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    const result = await pedidoService.getPedidosByEstado(estado, page, limit);

    res.status(200).json({
      success: true,
      data: result.pedidos,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener pedidos por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Cambiar estado del pedido
const cambiarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await pedidoService.cambiarEstadoPedido(id, estado);

    res.status(200).json({
      success: true,
      message: 'Estado del pedido actualizado exitosamente',
      data: pedido
    });
  } catch (error) {
    console.error('Error al cambiar estado del pedido:', error);
    
    if (error.message === 'Pedido no encontrado') {
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

// Obtener estadísticas de pedidos
const getEstadisticas = async (req, res) => {
  try {
    const estadisticas = await pedidoService.getEstadisticas();

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

// Obtener pedidos por rango de fechas
const getPedidosByFechas = async (req, res) => {
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

    const result = await pedidoService.getPedidosByFechas(fecha_inicio, fecha_fin, page, limit);

    res.status(200).json({
      success: true,
      data: result.pedidos,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error al obtener pedidos por fechas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  searchPedidos,
  getPedidosByEstado,
  cambiarEstadoPedido,
  getEstadisticas,
  getPedidosByFechas
};