const Client = require('../models/clients/Client');
const { Op } = require('sequelize');

class ClientService {
  // Obtener todos los clientes con paginación
  static async getAllClients(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await Client.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        clients: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  // Obtener cliente por ID
  static async getClientById(id) {
    try {
      const client = await Client.findByPk(id);
      return client;
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  // Crear nuevo cliente
  static async createClient(clientData) {
    try {
      const { documentType, documentNumber, firstName, lastName, email, phone, password } = clientData;
      
      // Verificar si el cliente ya existe por documento o email
      const existingClient = await Client.findOne({
        where: {
          [Op.or]: [
            { documentNumber },
            { email }
          ]
        }
      });

      if (existingClient) {
        throw new Error('Ya existe un cliente con ese documento o email');
      }

      const newClient = await Client.create({
        documentType,
        documentNumber,
        firstName,
        lastName,
        email,
        phone,
        password,
        status: 'activo'
      });

      return newClient;
    } catch (error) {
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  // Actualizar cliente
  static async updateClient(id, clientData) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        return null;
      }

      const { documentType, documentNumber, firstName, lastName, email, phone } = clientData;
      
      // Verificar si el nuevo documento o email ya existe en otro cliente
      if (documentNumber || email) {
        const existingClient = await Client.findOne({
          where: {
            [Op.or]: [
              { documentNumber: documentNumber || client.documentNumber },
              { email: email || client.email }
            ],
            id: { [Op.ne]: id }
          }
        });

        if (existingClient) {
          throw new Error('Ya existe un cliente con ese documento o email');
        }
      }

      await client.update({
        documentType: documentType || client.documentType,
        documentNumber: documentNumber || client.documentNumber,
        firstName: firstName || client.firstName,
        lastName: lastName || client.lastName,
        email: email || client.email,
        phone: phone || client.phone
      });

      return client;
    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  // Eliminar cliente
  static async deleteClient(id) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        return false;
      }

      await client.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }

  // Obtener estadísticas de clientes
  static async getClientStats() {
    try {
      const totalClients = await Client.count();
      const activeClients = await Client.count({ where: { status: 'activo' } });
      const inactiveClients = await Client.count({ where: { status: 'inactivo' } });

      return {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  // Buscar clientes
  static async searchClients(query, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await Client.findAndCountAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
            { documentNumber: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        clients: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error en la búsqueda: ${error.message}`);
    }
  }

  // Obtener cliente por email
  static async getClientByEmail(email) {
    try {
      const client = await Client.findOne({ where: { email } });
      return client;
    } catch (error) {
      throw new Error(`Error al obtener cliente por email: ${error.message}`);
    }
  }

  // Obtener cliente por número de documento
  static async getClientByDocument(documentNumber) {
    try {
      const client = await Client.findOne({ where: { documentNumber } });
      return client;
    } catch (error) {
      throw new Error(`Error al obtener cliente por documento: ${error.message}`);
    }
  }
}

module.exports = ClientService;
