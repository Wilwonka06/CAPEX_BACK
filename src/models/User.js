// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/
    }
  },
  tipo_documento: {
    type: DataTypes.ENUM('Pasaporte', 'Cedula de ciudadania', 'Cedula de extranjeria'),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-z0-9]+$/
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^\+[0-9]{7,15}$/
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [8, 100],
        msg: 'La contraseña debe tener entre 8 y 100 caracteres'
      },
      is: {
        args: /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[@$!%?&])[A-Za-zÁÉÍÓÚáéíóúÑñ\d@$!%?&]{8,}$/,
        msg: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%?&)'
      }
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1, // Rol por defecto
    references: {
      model: 'roles',
      key: 'id_rol'
    }
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: {
        args: true,
        msg: 'La foto debe ser una URL válida'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido'),
    allowNull: false,
    defaultValue: 'Activo',
    validate: {
      isIn: {
        args: [['Activo', 'Inactivo', 'Suspendido']],
        msg: 'El estado debe ser Activo, Inactivo o Suspendido'
      }
    }
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'La dirección no puede exceder los 1000 caracteres'
      }
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

// Exportar tanto Usuario como User para mantener compatibilidad
module.exports = { Usuario };
module.exports.Usuario = Usuario;
module.exports.User = Usuario;
