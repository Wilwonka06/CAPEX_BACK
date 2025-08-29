const Supplier = require('../models/Supplier');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class SupplierController {
  // Obtener todos los proveedores
  static async getAllSuppliers(req, res) {
    try {
      const suppliers = await Supplier.findAll({
        order: [['nombre', 'ASC']]
      });

      return ResponseMiddleware.success(res, 'Proveedores obtenidos exitosamente', suppliers);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      return ResponseMiddleware.error(res, 'Error al obtener proveedores', error, 500);
    }
  }

  // Obtener proveedor por ID
  static async getSupplierById(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        return ResponseMiddleware.error(res, 'Proveedor no encontrado', null, 404);
      }

      return ResponseMiddleware.success(res, 'Proveedor obtenido exitosamente', supplier);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      return ResponseMiddleware.error(res, 'Error al obtener proveedor', error, 500);
    }
  }

  // Crear nuevo proveedor
  static async createSupplier(req, res) {
    try {
      const supplierData = req.body;
      const supplier = await Supplier.create(supplierData);

      return ResponseMiddleware.success(res, 'Proveedor creado exitosamente', supplier, 201);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        const message = field === 'documento' ? 'Ya existe un proveedor con ese documento' : 
                       field === 'email' ? 'Ya existe un proveedor con ese email' : 
                       'Error de duplicación';
        return ResponseMiddleware.error(res, message, null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al crear proveedor', error, 500);
    }
  }

  // Actualizar proveedor
  static async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return ResponseMiddleware.error(res, 'Proveedor no encontrado', null, 404);
      }

      await supplier.update(updateData);

      return ResponseMiddleware.success(res, 'Proveedor actualizado exitosamente', supplier);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        const message = field === 'documento' ? 'Ya existe un proveedor con ese documento' : 
                       field === 'email' ? 'Ya existe un proveedor con ese email' : 
                       'Error de duplicación';
        return ResponseMiddleware.error(res, message, null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al actualizar proveedor', error, 500);
    }
  }

  // Eliminar proveedor
  static async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        return ResponseMiddleware.error(res, 'Proveedor no encontrado', null, 404);
      }

      await supplier.destroy();

      return ResponseMiddleware.success(res, 'Proveedor eliminado exitosamente', null);
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      return ResponseMiddleware.error(res, 'Error al eliminar proveedor', error, 500);
    }
  }
}

module.exports = SupplierController;
