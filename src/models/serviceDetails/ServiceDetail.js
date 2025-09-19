const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id_detalle_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_servicio_cliente'
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
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
  id_cita: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'citas',
      key: 'id_cita'
    }
  },
  id_cliente: {
    type: DataTypes.INTEGER, // Referencia a id_usuario del usuario
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    }
  },
  hora_finalizacion: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    }
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  fecha_programada: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM(
      'Agendada', 
      'Confirmada', 
      'Reprogramada', 
      'En proceso', 
      'Finalizada', 
      'Pagada',
      'Cancelada por el usuario',
      'No asistio'
    ),
    allowNull: false,
    defaultValue: 'Agendada',
    validate: {
      isIn: {
        args: [['Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el usuario', 'No asistio']],
        msg: 'Estado inválido'
      }
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'detalles_servicios_clientes',
  timestamps: false,
  indexes: [
    {
      fields: ['id_empleado']
    },
    {
      fields: ['id_servicio']
    },
    {
      fields: ['id_cita']
    },
    {
      fields: ['fecha_programada']
    },
    {
      fields: ['estado']
    }
  ]
});

module.exports = ServiceDetail;