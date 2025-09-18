const { Usuario } = require('../../models/User');
const { sequelize } = require('../../config/database');

class ClientService {
  // Get all clients (users with client role)
  static async getAllClients() {
    try {
      const clients = await Usuario.findAll({
        where: { 
          roleId: 1, // Rol de cliente
          estado: 'Activo'
        },
        attributes: { exclude: ['contrasena'] }
      });

      return {
        success: true,
        message: 'Clientes obtenidos exitosamente',
        data: clients
      };
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  // Get client by ID
  static async getClientById(id) {
    try {
      const client = await Usuario.findOne({
        where: { 
          id_usuario: id,
          roleId: 1 // Rol de cliente
        },
        attributes: { exclude: ['contrasena'] }
      });

      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado'
        };
      }

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: client
      };
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  // Get client by user ID
  static async getClientByUserId(userId) {
    try {
      const client = await Usuario.findOne({
        where: { 
          id_usuario: userId,
          roleId: 1 // Rol de cliente
        },
        attributes: { exclude: ['contrasena'] }
      });

      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado'
        };
      }

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: client
      };
    } catch (error) {
      throw new Error(`Error al obtener cliente por ID de usuario: ${error.message}`);
    }
  }

  // Get client by email
  static async getClientByEmail(email) {
    try {
      const client = await Usuario.findOne({
        where: { 
          correo: email,
          roleId: 1 // Rol de cliente
        },
        attributes: { exclude: ['contrasena'] }
      });

      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado'
        };
      }

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: client
      };
    } catch (error) {
      throw new Error(`Error al obtener cliente por email: ${error.message}`);
    }
  }

  // Get client by document number
  static async getClientByDocument(documentNumber) {
    try {
      const client = await Usuario.findOne({
        where: { 
          documento: documentNumber,
          roleId: 1 // Rol de cliente
        },
        attributes: { exclude: ['contrasena'] }
      });

      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado'
        };
      }

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: client
      };
    } catch (error) {
      throw new Error(`Error al obtener cliente por documento: ${error.message}`);
    }
  }

  // Create new client
  static async createClient(clientData) {
    try {
      const {
        tipo_documento,
        documento,
        primer_nombre,
        apellido,
        correo,
        telefono,
        contrasena,
        direccion
      } = clientData;

      // Mapear los campos del request a los campos del modelo Usuario
      const nombre_completo = `${primer_nombre} ${apellido}`;
      
      // Create user with client role
      const newClient = await Usuario.create({
        nombre: nombre_completo,
        tipo_documento: tipo_documento,
        documento: documento,
        correo: correo,
        telefono: telefono,
        contrasena: contrasena,
        roleId: 1, // Rol de cliente
        direccion: direccion || null,
        estado: 'Activo'
        // concepto_estado es opcional para clientes
      });

      // Get the complete client data
      const createdClient = await this.getClientById(newClient.id_usuario);

      return {
        success: true,
        message: 'Cliente creado exitosamente',
        data: createdClient.data
      };
    } catch (error) {
      // Manejar errores específicos de validación
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
        throw new Error(`Error de validación: ${validationErrors}`);
      }
      
      // Manejar errores de restricción única
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields && error.fields.correo) {
          throw new Error('El correo electrónico ya está registrado');
        }
        if (error.fields && error.fields.documento) {
          throw new Error('El número de documento ya está registrado');
        }
        throw new Error('Ya existe un registro con estos datos');
      }
      
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  // Update client
  static async updateClient(id, clientData) {
    try {
      const {
        tipo_documento,
        documento,
        primer_nombre,
        apellido,
        correo,
        telefono,
        contrasena,
        direccion,
        estado,
        concepto_estado
      } = clientData;

      // Find the client
      const existingClient = await Usuario.findOne({
        where: { 
          id_usuario: id,
          roleId: 1 // Rol de cliente
        }
      });

      if (!existingClient) {
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Update user data if provided
      const updateData = {};
      if (primer_nombre !== undefined || apellido !== undefined) {
        const nombre_completo = `${primer_nombre || existingClient.nombre.split(' ')[0]} ${apellido || existingClient.nombre.split(' ')[1] || ''}`;
        updateData.nombre = nombre_completo.trim();
      }
      if (tipo_documento !== undefined) updateData.tipo_documento = tipo_documento;
      if (documento !== undefined) updateData.documento = documento;
      if (correo !== undefined) updateData.correo = correo;
      if (telefono !== undefined) updateData.telefono = telefono;
      if (contrasena !== undefined) updateData.contrasena = contrasena;
      if (direccion !== undefined) updateData.direccion = direccion;
      if (estado !== undefined) updateData.estado = estado;
      if (concepto_estado !== undefined) updateData.concepto_estado = concepto_estado;

      await existingClient.update(updateData);
      
      // Get updated client data
      const updatedClient = await this.getClientById(id);
      
      return {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: updatedClient.data
      };
    } catch (error) {
      // Handle specific database errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields && error.fields.correo) {
          return {
            success: false,
            message: 'El correo electrónico ya está registrado',
            error: 'EMAIL_EXISTS'
          };
        }
        if (error.fields && error.fields.documento) {
          return {
            success: false,
            message: 'El número de documento ya está registrado',
            error: 'DOCUMENT_EXISTS'
          };
        }
      }
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  // Delete client (soft delete)
  static async deleteClient(id) {
    try {
      const client = await Usuario.findOne({
        where: { 
          id_usuario: id,
          roleId: 1 // Rol de cliente
        }
      });
      
      if (!client) {
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Soft delete by setting estado to 'Inactivo'
      await client.update({ 
        estado: 'Inactivo'
        // concepto_estado es opcional para clientes
      });

      return {
        success: true,
        message: 'Cliente eliminado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }

  // Get client statistics
  static async getClientStats() {
    try {
      const totalClients = await Usuario.count({ where: { roleId: 1 } });
      const activeClients = await Usuario.count({ 
        where: { 
          roleId: 1,
          estado: 'Activo'
        } 
      });
      const inactiveClients = await Usuario.count({ 
        where: { 
          roleId: 1,
          estado: 'Inactivo'
        } 
      });

      return {
        success: true,
        message: 'Estadísticas de clientes obtenidas exitosamente',
        data: {
          total_clients: totalClients,
          active_clients: activeClients,
          inactive_clients: inactiveClients
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de clientes: ${error.message}`);
    }
  }

  // Search clients
  static async searchClients(criteria) {
    try {
      const { estado, nombre, correo, documento } = criteria;
      const whereClause = { roleId: 1 }; // Solo usuarios con rol de cliente
      
      if (estado !== undefined) {
        whereClause.estado = estado;
      }
      
      if (nombre) {
        whereClause.nombre = { [sequelize.Op.like]: `%${nombre}%` };
      }
      
      if (correo) {
        whereClause.correo = { [sequelize.Op.like]: `%${correo}%` };
      }
      
      if (documento) {
        whereClause.documento = { [sequelize.Op.like]: `%${documento}%` };
      }
      
      const clients = await Usuario.findAll({
        where: whereClause,
        attributes: { exclude: ['contrasena'] },
        order: [['id_usuario', 'ASC']]
      });

      return {
        success: true,
        message: 'Búsqueda de clientes completada exitosamente',
        data: clients
      };
    } catch (error) {
      throw new Error(`Error al buscar clientes: ${error.message}`);
    }
  }
}

module.exports = ClientService;