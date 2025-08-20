const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id_service_detail: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_detalle_servicio_cliente'
  },
  id_employee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_empleado',
    references: {
      model: 'empleados',
      key: 'id_empleado'
    }
  },
  id_service: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_servicio',
    references: {
      model: 'servicios',
      key: 'id_servicio'
    }
  },
  id_service_client: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_servicio_cliente',
    references: {
      model: 'servicios_clientes',
      key: 'id_servicio_cliente'
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'precio_unitario',
    validate: {
      min: 0
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cantidad',
    validate: {
      min: 1
    }
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'hora_inicio'
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'hora_finalizacion'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duracion',
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('Agendada', 'Confirmada', 'Reprogramada', 'En proceso', 'Finalizada', 'Pagada', 'Cancelada por el cliente', 'No asistio'),
    allowNull: false,
    defaultValue: 'Agendada',
    field: 'estado'
  }
}, {
  tableName: 'detalles_servicios_clientes',
  timestamps: false,
  hooks: {
    beforeValidate: (serviceDetail) => {
      // Validate that end_time is greater than start_time
      if (serviceDetail.start_time && serviceDetail.end_time) {
        const startTime = new Date(`2000-01-01 ${serviceDetail.start_time}`);
        const endTime = new Date(`2000-01-01 ${serviceDetail.end_time}`);
        
        if (endTime <= startTime) {
          throw new Error('End time must be greater than start time');
        }
      }
    }
  }
});

module.exports = ServiceDetail;
