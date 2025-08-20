const Product = require('../models/Product');
const TechnicalSheet = require('../models/TechnicalSheet');
const Characteristic = require('../models/Characteristic');

// Obtener todos los productos
const getAllProductos = async (req, res) => {
  try {
    const productos = await Product.findAll({
      include: [
        {
          model: Characteristic,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: productos,
      count: productos.length
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByPk(id, {
      include: [
        {
          model: Characteristic,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ]
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
  try {
    const { 
      nombre, 
      id_categoria_producto, 
      costo, 
      iva, 
      precio_venta, 
      stock, 
      url_foto,
      caracteristicas 
    } = req.body;

    // Verificar si el nombre ya existe
    const existingProducto = await Product.findOne({ where: { nombre } });
    if (existingProducto) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del producto ya existe'
      });
    }

    // Crear el producto
    const newProducto = await Product.create({
      nombre,
      id_categoria_producto,
      costo,
      iva,
      precio_venta,
      stock: stock || 0,
      url_foto
    });

    // Si se proporcionan características, agregarlas o crearlas si no existen
    if (caracteristicas && Array.isArray(caracteristicas)) {
      for (const caracteristica of caracteristicas) {
        let idCaracteristica = caracteristica.id_caracteristica;
        // Si no se proporciona id, buscar por nombre o crear
        if (!idCaracteristica && caracteristica.nombre) {
          let found = await Characteristic.findOne({ where: { nombre: caracteristica.nombre } });
          if (!found) {
            found = await Characteristic.create({ nombre: caracteristica.nombre });
          }
          idCaracteristica = found.id_caracteristica;
        }
        // Si tenemos id y valor, crear la ficha técnica
        if (idCaracteristica && caracteristica.valor) {
          await TechnicalSheet.create({
            id_producto: newProducto.id_producto,
            id_caracteristica: idCaracteristica,
            valor: caracteristica.valor
          });
        }
      }
    }

    // Obtener el producto con sus características
    const productoCompleto = await Product.findByPk(newProducto.id_producto, {
      include: [
        {
          model: Characteristic,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: productoCompleto
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    
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

// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const producto = await Product.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Si se está actualizando el nombre, verificar que no exista
    if (updateData.nombre && updateData.nombre !== producto.nombre) {
      const existingProducto = await Product.findOne({ where: { nombre: updateData.nombre } });
      if (existingProducto) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del producto ya existe'
        });
      }
    }

    await producto.update(updateData);

    // Si se proporcionan características, actualizarlas
    if (updateData.caracteristicas && Array.isArray(updateData.caracteristicas)) {
      // Eliminar características existentes
      await TechnicalSheet.destroy({ where: { id_producto: id } });
      
      // Agregar nuevas características
      for (const caracteristica of updateData.caracteristicas) {
        if (caracteristica.id_caracteristica && caracteristica.valor) {
          await TechnicalSheet.create({
            id_producto: id,
            id_caracteristica: caracteristica.id_caracteristica,
            valor: caracteristica.valor
          });
        }
      }
    }

    // Obtener el producto actualizado con sus características
    const productoActualizado = await Product.findByPk(id, {
      include: [
        {
          model: Characteristic,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Product.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Eliminar fichas técnicas asociadas (se hará automáticamente por CASCADE)
    await producto.destroy();

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Buscar productos por nombre
const searchProductos = async (req, res) => {
  try {
    const { nombre } = req.query;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "nombre" es requerido'
      });
    }

    const productos = await Product.findAll({
      where: {
        nombre: {
          [require('sequelize').Op.like]: `%${nombre}%`
        }
      },
      include: [
        {
          model: Characteristic,
          as: 'caracteristicas',
          through: { attributes: ['valor'] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: productos,
      count: productos.length
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos
};
