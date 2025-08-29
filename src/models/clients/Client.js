const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database').sequelize;
const bcrypt = require('bcryptjs');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  documentType: {
    type: DataTypes.ENUM('CC', 'CE', 'TI', 'PP', 'NIT'),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['CC', 'CE', 'TI', 'PP', 'NIT']]
    }
  },
  documentNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [5, 20]
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
      len: [5, 100]
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      len: [7, 15]
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  status: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['documentNumber']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeCreate: async (client) => {
      if (client.password) {
        client.password = await bcrypt.hash(client.password, 10);
      }
    },
    beforeUpdate: async (client) => {
      if (client.changed('password')) {
        client.password = await bcrypt.hash(client.password, 10);
      }
    }
  }
});

// Método para comparar contraseñas
Client.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = Client;
