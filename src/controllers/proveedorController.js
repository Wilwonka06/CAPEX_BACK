const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
const getAllProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll();
    
    res.status(200).json({
      success: true,
      data: proveedores,
      count: proveedores.length
    });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un proveedor por ID
const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: proveedor
    });
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo proveedor
const createProveedor = async (req, res) => {
  try {
    const { 
      nit, 
      tipo_proveedor, 
      nombre, 
      contacto, 
      direccion, 
      correo, 
      telefono, 
      estado 
    } = req.body;

    // Verificar si el NIT ya existe
    const existingProveedor = await Proveedor.findOne({ where: { nit } });
    if (existingProveedor) {
      return res.status(400).json({
        success: false,
        message: 'El NIT ya está registrado'
      });
    }

    // Verificar si el correo ya existe (si se proporciona)
    if (correo) {
      const existingEmail = await Proveedor.findOne({ where: { correo } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está registrado'
        });
      }
    }

    // Crear el proveedor
    const newProveedor = await Proveedor.create({
      nit,
      tipo_proveedor,
      nombre,
      contacto,
      direccion,
      correo,
      telefono,
      estado: estado || 'Activo'
    });

    res.status(201).json({
      success: true,
      message: 'Proveedor creado exitosamente',
      data: newProveedor
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    
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

// Actualizar un proveedor
const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    // Si se está actualizando el NIT, verificar que no exista
    if (updateData.nit && updateData.nit !== proveedor.nit) {
      const existingProveedor = await Proveedor.findOne({ where: { nit: updateData.nit } });
      if (existingProveedor) {
        return res.status(400).json({
          success: false,
          message: 'El NIT ya está registrado'
        });
      }
    }

    // Si se está actualizando el correo, verificar que no exista
    if (updateData.correo && updateData.correo !== proveedor.correo) {
      const existingEmail = await Proveedor.findOne({ where: { correo: updateData.correo } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está registrado'
        });
      }
    }

    await proveedor.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Proveedor actualizado exitosamente',
      data: proveedor
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un proveedor
const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    await proveedor.destroy();

    res.status(200).json({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Buscar proveedores por nombre
const searchProveedores = async (req, res) => {
  try {
    const { nombre } = req.query;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "nombre" es requerido'
      });
    }

    const proveedores = await Proveedor.findAll({
      where: {
        nombre: {
          [require('sequelize').Op.like]: `%${nombre}%`
        }
      }
    });

    res.status(200).json({
      success: true,
      data: proveedores,
      count: proveedores.length
    });
  } catch (error) {
    console.error('Error al buscar proveedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener proveedores por estado
const getProveedoresByEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    
    if (!estado || !['Activo', 'Inactivo'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'El estado debe ser "Activo" o "Inactivo"'
      });
    }

    const proveedores = await Proveedor.findAll({
      where: { estado }
    });

    res.status(200).json({
      success: true,
      data: proveedores,
      count: proveedores.length
    });
  } catch (error) {
    console.error('Error al obtener proveedores por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  searchProveedores,
  getProveedoresByEstado
};
