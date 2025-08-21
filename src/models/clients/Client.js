const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Client = sequelize.define('Client', {
  id_client: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_cliente'
  },
  documentType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'tipo_documento',
    validate: {
      notEmpty: {
        msg: 'El tipo de documento es requerido'
      }
    }
  },
  documentNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'numero_documento',
    validate: {
      notEmpty: {
        msg: 'El número de documento es requerido'
      },
      len: {
        args: [5, 20],
        msg: 'El número de documento debe tener entre 5 y 20 caracteres'
      },
      isNumeric: {
        msg: 'El número de documento solo debe contener números'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nombres',
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      },
      len: {
        args: [2, 50],
        msg: 'El nombre debe tener entre 2 y 50 caracteres'
      },
      is: {
        args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        msg: 'El nombre solo puede contener letras y espacios'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'apellidos',
    validate: {
      notEmpty: {
        msg: 'El apellido es requerido'
      },
      len: {
        args: [2, 50],
        msg: 'El apellido debe tener entre 2 y 50 caracteres'
      },
      is: {
        args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        msg: 'El apellido solo puede contener letras y espacios'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email',
    validate: {
      notEmpty: {
        msg: 'El correo electrónico es requerido'
      },
      isEmail: {
        msg: 'Correo electrónico inválido'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: 'telefono',
    validate: {
      notEmpty: {
        msg: 'El teléfono es requerido'
      },
      len: {
        args: [7, 15],
        msg: 'El teléfono debe tener entre 7 y 15 dígitos'
      },
      isNumeric: {
        msg: 'El teléfono solo debe contener números'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password',
    validate: {
      notEmpty: {
        msg: 'La contraseña es requerida'
      },
      len: {
        args: [8, 255],
        msg: 'La contraseña debe tener al menos 8 caracteres'
      }
    }
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'direccion'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'estado'
  }
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

module.exports = Client;
