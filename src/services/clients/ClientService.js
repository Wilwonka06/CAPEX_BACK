const Client = require('../../models/clients/Client');
const { Usuario } = require('../../models/User');
const { sequelize } = require('../../config/database');

class ClientService {
  // Get all clients with user data
  static async getAllClients() {
    try {
      const clients = await Client.findAll({
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['contrasena'] }
        }],
        where: { estado: true }
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
      const client = await Client.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['contrasena'] }
        }]
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
      const client = await Client.findOne({
        where: { id_usuario: userId },
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['contrasena'] }
        }]
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
      const client = await Client.findOne({
        include: [{
          model: Usuario,
          as: 'usuario',
          where: { correo: email },
          attributes: { exclude: ['contrasena'] }
        }]
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
      const client = await Client.findOne({
        include: [{
          model: Usuario,
          as: 'usuario',
          where: { documento: documentNumber },
          attributes: { exclude: ['contrasena'] }
        }]
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
    const transaction = await sequelize.transaction();
    
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
        estado
      } = clientData;

      // Mapear los campos del request a los campos del modelo Usuario
      const nombre_completo = `${primer_nombre} ${apellido}`;
      
      // Create user first
      const newUser = await Usuario.create({
        nombre: nombre_completo,
        tipo_documento: tipo_documento,
        documento: documento,
        correo: correo,
        telefono: telefono,
        contrasena: contrasena
      }, { transaction });

      // Then create client
      const newClient = await Client.create({
        id_usuario: newUser.id_usuario,
        direccion: direccion || null,
        estado: estado !== undefined ? estado : true
      }, { transaction });

      await transaction.commit();

      // Get the complete client data
      const createdClient = await this.getClientById(newClient.id_cliente);

      return {
        success: true,
        message: 'Cliente creado exitosamente',
        data: createdClient.data
      };
    } catch (error) {
      await transaction.rollback();
      
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
    const transaction = await sequelize.transaction();
    
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
        estado
      } = clientData;

      // Find the client with user data
      const existingClient = await Client.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario'
        }]
      });

      if (!existingClient) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Update user data if provided
      const userUpdateData = {};
      if (primer_nombre !== undefined || apellido !== undefined) {
        const nombre_completo = `${primer_nombre || existingClient.usuario.nombre.split(' ')[0]} ${apellido || existingClient.usuario.nombre.split(' ')[1] || ''}`;
        userUpdateData.nombre = nombre_completo.trim();
      }
      if (tipo_documento !== undefined) userUpdateData.tipo_documento = tipo_documento;
      if (documento !== undefined) userUpdateData.documento = documento;
      if (correo !== undefined) userUpdateData.correo = correo;
      if (telefono !== undefined) userUpdateData.telefono = telefono;
      if (contrasena !== undefined) userUpdateData.contrasena = contrasena;

      if (Object.keys(userUpdateData).length > 0) {
        await existingClient.usuario.update(userUpdateData, { transaction });
      }

      // Update client-specific data
      const clientUpdateData = {};
      if (direccion !== undefined) clientUpdateData.direccion = direccion;
      if (estado !== undefined) clientUpdateData.estado = estado;

      if (Object.keys(clientUpdateData).length > 0) {
        await existingClient.update(clientUpdateData, { transaction });
      }

      await transaction.commit();
      
      // Get updated client data
      const updatedClient = await this.getClientById(id);
      
      return {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: updatedClient.data
      };
    } catch (error) {
      await transaction.rollback();
      
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
    const transaction = await sequelize.transaction();
    
    try {
      const client = await Client.findByPk(id, { transaction });      
      if (!client) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Cliente no encontrado',
          error: 'CLIENT_NOT_FOUND'
        };
      }

      // Soft delete by setting estado to false
      await client.update({ estado: false }, { transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Cliente eliminado exitosamente'
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }

  // Get client statistics
  static async getClientStats() {
    try {
      const totalClients = await Client.count();
      const activeClients = await Client.count({ where: { estado: true } });
      const inactiveClients = await Client.count({ where: { estado: false } });

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
      const whereClause = {};
      const userWhereClause = {};
      
      if (estado !== undefined) {
        whereClause.estado = estado;
      }
      
      if (nombre) {
        userWhereClause.nombre = { [sequelize.Op.like]: `%${nombre}%` };
      }
      
      if (correo) {
        userWhereClause.correo = { [sequelize.Op.like]: `%${correo}%` };
      }
      
      if (documento) {
        userWhereClause.documento = { [sequelize.Op.like]: `%${documento}%` };
      }
      
      const clients = await Client.findAll({
        where: whereClause,
        include: [{
          model: Usuario,
          as: 'usuario',
          where: Object.keys(userWhereClause).length > 0 ? userWhereClause : undefined,
          attributes: { exclude: ['contrasena'] }
        }],
        order: [['id_cliente', 'ASC']]
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

  // Create user and client in one transaction (prepared for future integration)
  static async createUserAndClient(userData, clientData) {
    const transaction = await sequelize.transaction();
    
    try {
      // TODO: When User model is available, implement this logic:
      // 1. Create user in usuarios table
      // 2. Assign 'Cliente' role in usuarios_roles table
      // 3. Create client record in clientes table
      
      // For now, this is a placeholder that will be implemented later
      throw new Error('Función createUserAndClient no implementada aún. Los modelos de usuario deben ser proporcionados primero.');
      
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error al crear usuario y cliente: ${error.message}`);
    }
  }
}

module.exports = ClientService;