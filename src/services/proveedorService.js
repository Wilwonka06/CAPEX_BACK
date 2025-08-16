const Proveedor = require('../models/Proveedor');
const { Op } = require('sequelize');

class ProveedorService {
  // Obtener todos los proveedores con paginación
  async getAllProveedores(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Proveedor.findAndCountAll({
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });
    
    return {
      proveedores: rows,
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

  // Obtener proveedor por ID
  async getProveedorById(id) {
    return await Proveedor.findByPk(id);
  }

  // Crear nuevo proveedor
  async createProveedor(proveedorData) {
    const { nit, correo, ...otrosDatos } = proveedorData;

    // Verificar si el NIT ya existe
    const existingProveedor = await Proveedor.findOne({ 
      where: { nit } 
    });
    
    if (existingProveedor) {
      throw new Error('El NIT ya está registrado');
    }

    // Verificar si el correo ya existe (si se proporciona)
    if (correo) {
      const existingEmail = await Proveedor.findOne({ 
        where: { correo } 
      });
      
      if (existingEmail) {
        throw new Error('El correo ya está registrado');
      }
    }

    return await Proveedor.create(proveedorData);
  }

  // Actualizar proveedor
  async updateProveedor(id, updateData) {
    const { nit, correo, ...otrosDatos } = updateData;
    
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      throw new Error('Proveedor no encontrado');
    }

    // Verificar si el nuevo NIT ya existe
    if (nit && nit !== proveedor.nit) {
      const existingProveedor = await Proveedor.findOne({ 
        where: { nit } 
      });
      
      if (existingProveedor) {
        throw new Error('El NIT ya está registrado');
      }
    }

    // Verificar si el nuevo correo ya existe
    if (correo && correo !== proveedor.correo) {
      const existingEmail = await Proveedor.findOne({ 
        where: { correo } 
      });
      
      if (existingEmail) {
        throw new Error('El correo ya está registrado');
      }
    }

    await proveedor.update(updateData);
    return proveedor;
  }

  // Eliminar proveedor
  async deleteProveedor(id) {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      throw new Error('Proveedor no encontrado');
    }

    await proveedor.destroy();
    return { message: 'Proveedor eliminado exitosamente' };
  }

  // Buscar proveedores por nombre
  async searchProveedores(nombre, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Proveedor.findAndCountAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      },
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      proveedores: rows,
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

  // Obtener proveedores por estado
  async getProveedoresByEstado(estado, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Proveedor.findAndCountAll({
      where: { estado },
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      proveedores: rows,
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

  // Filtrar proveedores
  async filterProveedores(filters, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Aplicar filtros
    if (filters.tipo_proveedor) {
      whereClause.tipo_proveedor = filters.tipo_proveedor;
    }

    if (filters.estado) {
      whereClause.estado = filters.estado;
    }

    if (filters.nombre) {
      whereClause.nombre = {
        [Op.like]: `%${filters.nombre}%`
      };
    }

    const { count, rows } = await Proveedor.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      proveedores: rows,
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

  // Cambiar estado del proveedor
  async changeEstado(id, nuevoEstado) {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      throw new Error('Proveedor no encontrado');
    }

    if (!['Activo', 'Inactivo'].includes(nuevoEstado)) {
      throw new Error('El estado debe ser Activo o Inactivo');
    }

    await proveedor.update({ estado: nuevoEstado });
    return proveedor;
  }

  // Obtener proveedores activos
  async getProveedoresActivos(page = 1, limit = 10) {
    return await this.getProveedoresByEstado('Activo', page, limit);
  }

  // Obtener proveedores inactivos
  async getProveedoresInactivos(page = 1, limit = 10) {
    return await this.getProveedoresByEstado('Inactivo', page, limit);
  }

  // Obtener proveedores por tipo
  async getProveedoresByTipo(tipo, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    if (!['N', 'J'].includes(tipo)) {
      throw new Error('El tipo debe ser N (Natural) o J (Jurídico)');
    }

    const { count, rows } = await Proveedor.findAndCountAll({
      where: { tipo_proveedor: tipo },
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      proveedores: rows,
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

  // Obtener estadísticas de proveedores
  async getEstadisticas() {
    const totalProveedores = await Proveedor.count();
    const proveedoresActivos = await Proveedor.count({ where: { estado: 'Activo' } });
    const proveedoresInactivos = await Proveedor.count({ where: { estado: 'Inactivo' } });
    const proveedoresNaturales = await Proveedor.count({ where: { tipo_proveedor: 'N' } });
    const proveedoresJuridicos = await Proveedor.count({ where: { tipo_proveedor: 'J' } });

    // Obtener proveedores con correo
    const proveedoresConCorreo = await Proveedor.count({
      where: {
        correo: {
          [Op.not]: null
        }
      }
    });

    // Obtener proveedores con teléfono
    const proveedoresConTelefono = await Proveedor.count({
      where: {
        telefono: {
          [Op.not]: null
        }
      }
    });

    return {
      totalProveedores,
      proveedoresActivos,
      proveedoresInactivos,
      proveedoresNaturales,
      proveedoresJuridicos,
      proveedoresConCorreo,
      proveedoresConTelefono,
      porcentajeActivos: totalProveedores > 0 ? ((proveedoresActivos / totalProveedores) * 100).toFixed(2) : 0,
      porcentajeConCorreo: totalProveedores > 0 ? ((proveedoresConCorreo / totalProveedores) * 100).toFixed(2) : 0
    };
  }

  // Buscar proveedor por NIT
  async getProveedorByNIT(nit) {
    return await Proveedor.findOne({ where: { nit } });
  }

  // Buscar proveedor por correo
  async getProveedorByEmail(correo) {
    return await Proveedor.findOne({ where: { correo } });
  }

  // Crear múltiples proveedores
  async createMultipleProveedores(proveedores) {
    const resultados = [];
    const errores = [];

    for (const proveedor of proveedores) {
      try {
        const nuevoProveedor = await this.createProveedor(proveedor);
        resultados.push(nuevoProveedor);
      } catch (error) {
        errores.push({
          nit: proveedor.nit,
          nombre: proveedor.nombre,
          error: error.message
        });
      }
    }

    return {
      creados: resultados,
      errores,
      totalCreados: resultados.length,
      totalErrores: errores.length
    };
  }

  // Exportar proveedores a formato CSV
  async exportProveedoresToCSV() {
    const proveedores = await Proveedor.findAll({
      order: [['nombre', 'ASC']]
    });

    const csvHeaders = [
      'ID',
      'NIT',
      'Tipo',
      'Nombre',
      'Contacto',
      'Dirección',
      'Correo',
      'Teléfono',
      'Estado'
    ];

    const csvRows = proveedores.map(proveedor => [
      proveedor.id_proveedor,
      proveedor.nit,
      proveedor.tipo_proveedor,
      proveedor.nombre,
      proveedor.contacto || '',
      proveedor.direccion || '',
      proveedor.correo || '',
      proveedor.telefono || '',
      proveedor.estado
    ]);

    return {
      headers: csvHeaders,
      rows: csvRows,
      total: proveedores.length
    };
  }
}

module.exports = new ProveedorService();
