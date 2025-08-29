const Characteristic = require('../models/Characteristic');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

class CharacteristicController {
  // Obtener todas las características
  static async getAllCharacteristics(req, res) {
    try {
      const characteristics = await Characteristic.findAll({
        order: [['nombre', 'ASC']]
      });

      return ResponseMiddleware.success(res, 'Características obtenidas exitosamente', characteristics);
    } catch (error) {
      console.error('Error al obtener características:', error);
      return ResponseMiddleware.error(res, 'Error al obtener características', error, 500);
    }
  }

  // Obtener característica por ID
  static async getCharacteristicById(req, res) {
    try {
      const { id } = req.params;
      const characteristic = await Characteristic.findByPk(id);

      if (!characteristic) {
        return ResponseMiddleware.error(res, 'Característica no encontrada', null, 404);
      }

      return ResponseMiddleware.success(res, 'Característica obtenida exitosamente', characteristic);
    } catch (error) {
      console.error('Error al obtener característica:', error);
      return ResponseMiddleware.error(res, 'Error al obtener característica', error, 500);
    }
  }

  // Crear nueva característica
  static async createCharacteristic(req, res) {
    try {
      const characteristicData = req.body;
      const characteristic = await Characteristic.create(characteristicData);

      return ResponseMiddleware.success(res, 'Característica creada exitosamente', characteristic, 201);
    } catch (error) {
      console.error('Error al crear característica:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'Ya existe una característica con ese nombre', null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al crear característica', error, 500);
    }
  }

  // Actualizar característica
  static async updateCharacteristic(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const characteristic = await Characteristic.findByPk(id);
      if (!characteristic) {
        return ResponseMiddleware.error(res, 'Característica no encontrada', null, 404);
      }

      await characteristic.update(updateData);

      return ResponseMiddleware.success(res, 'Característica actualizada exitosamente', characteristic);
    } catch (error) {
      console.error('Error al actualizar característica:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return ResponseMiddleware.error(res, 'Ya existe una característica con ese nombre', null, 409);
      }

      return ResponseMiddleware.error(res, 'Error al actualizar característica', error, 500);
    }
  }

  // Eliminar característica
  static async deleteCharacteristic(req, res) {
    try {
      const { id } = req.params;
      const characteristic = await Characteristic.findByPk(id);

      if (!characteristic) {
        return ResponseMiddleware.error(res, 'Característica no encontrada', null, 404);
      }

      await characteristic.destroy();

      return ResponseMiddleware.success(res, 'Característica eliminada exitosamente', null);
    } catch (error) {
      console.error('Error al eliminar característica:', error);
      return ResponseMiddleware.error(res, 'Error al eliminar característica', error, 500);
    }
  }
}

module.exports = CharacteristicController;
