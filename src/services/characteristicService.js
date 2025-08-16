const Characteristic = require('../models/Characteristic');
const Product = require('../models/Product');
const TechnicalSheet = require('../models/TechnicalSheet');
const { Op } = require('sequelize');

class CharacteristicService {
  // Obtener todas las características con paginación
  async getAllCaracteristicas(page = 1, limit = 10, includeProductos = false) {
    const offset = (page - 1) * limit;
    
    const options = {
      limit,
      offset,
      order: [['nombre', 'ASC']]
    };

    if (includeProductos) {
      options.include = [
        {
          model: Product,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ];
    }

    const { count, rows } = await Characteristic.findAndCountAll(options);
    
    return {
      caracteristicas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener característica por ID
  async getCaracteristicaById(id, includeProductos = false) {
    const options = { where: { id_caracteristica: id } };
    
    if (includeProductos) {
      options.include = [
        {
          model: Product,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ];
    }

    return await Characteristic.findOne(options);
  }

  // Crear nueva característica
  async createCaracteristica(caracteristicaData) {
    const { nombre } = caracteristicaData;

    // Verificar si el nombre ya existe
    const existingCaracteristica = await Characteristic.findOne({ 
      where: { nombre } 
    });
    
    if (existingCaracteristica) {
      throw new Error('El nombre de la característica ya existe');
    }

    return await Characteristic.create({ nombre });
  }

  // Actualizar característica
  async updateCaracteristica(id, updateData) {
    const { nombre } = updateData;
    
    const caracteristica = await Characteristic.findByPk(id);
    if (!caracteristica) {
      throw new Error('Característica no encontrada');
    }

    // Verificar si el nuevo nombre ya existe
    if (nombre && nombre !== caracteristica.nombre) {
      const existingCaracteristica = await Characteristic.findOne({ 
        where: { nombre } 
      });
      
      if (existingCaracteristica) {
        throw new Error('El nombre de la característica ya existe');
      }
    }

    await caracteristica.update({ nombre });
    return caracteristica;
  }

  // Eliminar característica
  async deleteCaracteristica(id) {
    const caracteristica = await Characteristic.findByPk(id);
    if (!caracteristica) {
      throw new Error('Característica no encontrada');
    }

    // Verificar si la característica está siendo usada por algún producto
    const fichasTecnicas = await TechnicalSheet.count({
      where: { id_caracteristica: id }
    });

    if (fichasTecnicas > 0) {
      throw new Error(`No se puede eliminar la característica porque está siendo usada por ${fichasTecnicas} producto(s)`);
    }

    await caracteristica.destroy();
    return { message: 'Característica eliminada exitosamente' };
  }

  // Buscar características por nombre
  async searchCaracteristicas(nombre, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Characteristic.findAndCountAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        {
          model: Product,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ],
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      caracteristicas: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener características más utilizadas
  async getCaracteristicasMasUtilizadas(limit = 10) {
    const caracteristicas = await Characteristic.findAll({
      include: [
        {
          model: Product,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ],
      order: [[Product, 'id_producto', 'DESC']],
      limit
    });

    // Contar productos por característica
    const caracteristicasConConteo = await Promise.all(
      caracteristicas.map(async (caracteristica) => {
        const conteo = await TechnicalSheet.count({
          where: { id_caracteristica: caracteristica.id_caracteristica }
        });
        
        return {
          ...caracteristica.toJSON(),
          conteoProductos: conteo
        };
      })
    );

    // Ordenar por conteo descendente
    return caracteristicasConConteo.sort((a, b) => b.conteoProductos - a.conteoProductos);
  }

  // Obtener características no utilizadas
  async getCaracteristicasNoUtilizadas() {
    const caracteristicas = await Characteristic.findAll({
      include: [
        {
          model: Product,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ]
    });

    const caracteristicasNoUtilizadas = [];

    for (const caracteristica of caracteristicas) {
      const conteo = await TechnicalSheet.count({
        where: { id_caracteristica: caracteristica.id_caracteristica }
      });

      if (conteo === 0) {
        caracteristicasNoUtilizadas.push(caracteristica);
      }
    }

    return caracteristicasNoUtilizadas;
  }

  // Obtener productos por característica
  async getProductosByCaracteristica(caracteristicaId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const caracteristica = await Characteristic.findByPk(caracteristicaId);
    if (!caracteristica) {
      throw new Error('Característica no encontrada');
    }

    const { count, rows } = await Product.findAndCountAll({
      include: [
        {
          model: Characteristic,
          as: 'caracteristicas',
          through: { 
            attributes: ['valor'],
            where: { id_caracteristica: caracteristicaId }
          }
        }
      ],
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      caracteristica,
      productos: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener estadísticas de características
  async getEstadisticas() {
    const totalCaracteristicas = await Characteristic.count();
    const caracteristicasUtilizadas = await TechnicalSheet.count({
      distinct: true,
      col: 'id_caracteristica'
    });
    const caracteristicasNoUtilizadas = totalCaracteristicas - caracteristicasUtilizadas;

    // Obtener la característica más utilizada
    const caracteristicaMasUtilizada = await TechnicalSheet.findOne({
      attributes: [
        'id_caracteristica',
        [TechnicalSheet.sequelize.fn('COUNT', TechnicalSheet.sequelize.col('id_caracteristica')), 'conteo']
      ],
      group: ['id_caracteristica'],
      order: [[TechnicalSheet.sequelize.fn('COUNT', TechnicalSheet.sequelize.col('id_caracteristica')), 'DESC']],
      include: [
        {
          model: Characteristic,
          attributes: ['nombre']
        }
      ]
    });

    return {
      totalCaracteristicas,
      caracteristicasUtilizadas,
      caracteristicasNoUtilizadas,
      caracteristicaMasUtilizada: caracteristicaMasUtilizada ? {
        id: caracteristicaMasUtilizada.id_caracteristica,
        nombre: caracteristicaMasUtilizada.Characteristic?.nombre,
        conteo: caracteristicaMasUtilizada.dataValues.conteo
      } : null
    };
  }

  // Crear múltiples características
  async createMultipleCaracteristicas(caracteristicas) {
    const resultados = [];
    const errores = [];

    for (const caracteristica of caracteristicas) {
      try {
        const nuevaCaracteristica = await this.createCaracteristica(caracteristica);
        resultados.push(nuevaCaracteristica);
      } catch (error) {
        errores.push({
          nombre: caracteristica.nombre,
          error: error.message
        });
      }
    }

    return {
      creadas: resultados,
      errores,
      totalCreadas: resultados.length,
      totalErrores: errores.length
    };
  }
}

module.exports = new CharacteristicService();
