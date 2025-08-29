const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id_detalle_servicio_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_servicio_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_finalizacion: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  estado: {
    type: DataTypes.ENUM('En ejecución', 'Pagado'),
    allowNull: false,
    defaultValue: 'En ejecución'
  }
}, {
  tableName: 'detalles_servicios_clientes',
  timestamps: false,
  hooks: {
    beforeValidate: (serviceDetail) => {
      // Validar que hora_finalizacion sea mayor que hora_inicio
      if (serviceDetail.hora_inicio && serviceDetail.hora_finalizacion) {
        const inicio = new Date(`2000-01-01 ${serviceDetail.hora_inicio}`);
        const fin = new Date(`2000-01-01 ${serviceDetail.hora_finalizacion}`);
        
        if (fin <= inicio) {
          throw new Error('La hora de finalización debe ser mayor que la hora de inicio');
        }
      }
    }
  }
});

module.exports = ServiceDetail;
