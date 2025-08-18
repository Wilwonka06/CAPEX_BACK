// models/Servicio.js
module.exports = (sequelize, DataTypes) => {
  const Servicio = sequelize.define("Servicio", {
    id_servicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/i,
      },
    },
    id_categoria_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    precio: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01,
        max: 9999999999999.99,
      },
    },
    estado: {
      type: DataTypes.STRING(10),
      defaultValue: "Activo",
      validate: {
        isIn: [["Activo", "Inactivo"]],
      },
    },
    foto: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  }, {
    tableName: "servicios",
    timestamps: false,
  });

  return Servicio;
};
