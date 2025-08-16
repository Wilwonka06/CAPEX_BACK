const Caracteristica = require('../models/Caracteristica');
const Producto = require('../models/Producto');
const FichaTecnica = require('../models/FichaTecnica');
const { Op } = require('sequelize');

class CaracteristicaService {
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
          model: Producto,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ];
    }

    const { count, rows } = await Caracteristica.findAndCountAll(options);
    
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
          model: Producto,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ];
    }

    return await Caracteristica.findOne(options);
  }

  // Crear nueva característica
  async createCaracteristica(caracteristicaData) {
    const { nombre } = caracteristicaData;

    // Verificar si el nombre ya existe
    const existingCaracteristica = await Caracteristica.findOne({ 
      where: { nombre } 
    });
    
    if (existingCaracteristica) {
      throw new Error('El nombre de la característica ya existe');
    }

    return await Caracteristica.create({ nombre });
  }

  // Actualizar característica
  async updateCaracteristica(id, updateData) {
    const { nombre } = updateData;
    
    const caracteristica = await Caracteristica.findByPk(id);
    if (!caracteristica) {
      throw new Error('Característica no encontrada');
    }

    // Verificar si el nuevo nombre ya existe
    if (nombre && nombre !== caracteristica.nombre) {
      const existingCaracteristica = await Caracteristica.findOne({ 
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
    const caracteristica = await Caracteristica.findByPk(id);
    if (!caracteristica) {
      throw new Error('Característica no encontrada');
    }

    // Verificar si la característica está siendo usada por algún producto
    const fichasTecnicas = await FichaTecnica.count({
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
    
    const { count, rows } = await Caracteristica.findAndCountAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      include: [
        {
          model: Producto,
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
    const caracteristicas = await Caracteristica.findAll({
      include: [
        {
          model: Producto,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ],
      order: [[Producto, 'id_producto', 'DESC']],
      limit
    });

    // Contar productos por característica
    const caracteristicasConConteo = await Promise.all(
      caracteristicas.map(async (caracteristica) => {
        const conteo = await FichaTecnica.count({
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
    const caracteristicas = await Caracteristica.findAll({
      include: [
        {
          model: Producto,
          as: 'productos',
          through: { attributes: ['valor'] }
        }
      ]
    });

    const caracteristicasNoUtilizadas = [];

    for (const caracteristica of caracteristicas) {
      const conteo = await FichaTecnica.count({
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
    
    const caracteristica = await Caracteristica.findByPk(caracteristicaId);
    if (!caracteristica) {
      throw new Error('Característica no encontrada');
    }

    const { count, rows } = await Producto.findAndCountAll({
      include: [
        {
          model: Caracteristica,
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
    const totalCaracteristicas = await Caracteristica.count();
    const caracteristicasUtilizadas = await FichaTecnica.count({
      distinct: true,
      col: 'id_caracteristica'
    });
    const caracteristicasNoUtilizadas = totalCaracteristicas - caracteristicasUtilizadas;

    // Obtener la característica más utilizada
    const caracteristicaMasUtilizada = await FichaTecnica.findOne({
      attributes: [
        'id_caracteristica',
        [FichaTecnica.sequelize.fn('COUNT', FichaTecnica.sequelize.col('id_caracteristica')), 'conteo']
      ],
      group: ['id_caracteristica'],
      order: [[FichaTecnica.sequelize.fn('COUNT', FichaTecnica.sequelize.col('id_caracteristica')), 'DESC']],
      include: [
        {
          model: Caracteristica,
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
        nombre: caracteristicaMasUtilizada.Caracteristica?.nombre,
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

module.exports = new CaracteristicaService();
