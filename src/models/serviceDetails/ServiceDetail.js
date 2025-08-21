const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id_detalle_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id_cliente'
    }
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios',
      key: 'id_servicio'
    }
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_programada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'programado', 'en_proceso', 'completado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'detalles_servicios',
  timestamps: false
});

module.exports = ServiceDetail;
