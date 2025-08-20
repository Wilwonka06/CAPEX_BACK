require('dotenv').config();
const express = require('express');
const { connectDB, sequelize } = require('./config/database');
const initializeRoles = require('./config/initRoles');

// Import models
const Role = require('./models/roles/Role');
const Permission = require('./models/roles/Permission');
const Privilege = require('./models/roles/Privilege');
const RolePermissionPrivilege = require('./models/roles/RolePermissionPrivilege');
const Client = require('./models/clients/Client');
const ServiceDetail = require('./models/serviceDetails/ServiceDetail');

// Define Role associations
Role.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_permiso'
});

Permission.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_rol'
});

Role.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_rol',
  otherKey: 'id_privilegio'
});

Privilege.belongsToMany(Role, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_rol'
});

Permission.belongsToMany(Privilege, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_permiso',
  otherKey: 'id_privilegio'
});

Privilege.belongsToMany(Permission, {
  through: RolePermissionPrivilege,
  foreignKey: 'id_privilegio',
  otherKey: 'id_permiso'
});

// Note: Client associations with User and ServiceDetail associations with Employee, Service, and ServiceClient
// are commented out as these models were referenced but not found in the current project structure.
// Uncomment and adjust these associations when these models are available.

/*
// Client associations
Client.belongsTo(User, {
  foreignKey: 'id_user',
  as: 'user'
});

User.hasOne(Client, {
  foreignKey: 'id_user',
  as: 'client'
});

// ServiceDetail associations
ServiceDetail.belongsTo(Employee, {
  foreignKey: 'id_employee',
  as: 'employee'
});

ServiceDetail.belongsTo(Service, {
  foreignKey: 'id_service',
  as: 'service'
});

ServiceDetail.belongsTo(ServiceClient, {
  foreignKey: 'id_service_client',
  as: 'serviceClient'
});

Employee.hasMany(ServiceDetail, {
  foreignKey: 'id_employee',
  as: 'serviceDetails'
});

Service.hasMany(ServiceDetail, {
  foreignKey: 'id_service',
  as: 'serviceDetails'
});

ServiceClient.hasMany(ServiceDetail, {
  foreignKey: 'id_service_client',
  as: 'serviceDetails'
});

ServiceClient.belongsTo(Client, {
  foreignKey: 'id_client',
  as: 'client'
});

Client.hasMany(ServiceClient, {
  foreignKey: 'id_client',
  as: 'serviceClients'
});
*/

const app = express();
app.use(express.json());

// Conexión a MySQL
connectDB();

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true }).then(async () => {
  console.log('Modelos sincronizados con la base de datos');
  // Inicializar roles por defecto
  await initializeRoles();
}).catch((error) => {
  console.error('Error sincronizando modelos:', error);
});

// Aquí irían tus rutas
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Role routes
const roleRoutes = require('./routes/roles/RoleRoutes');
app.use('/api/roles', roleRoutes);

// Cliente routes
const clienteRoutes = require('./routes/clientes/ClienteRoutes');
app.use('/api/clientes', clienteRoutes);

// Venta de servicios routes
const detalleServicioRoutes = require('./routes/ventas/DetalleServicioRoutes');
app.use('/api/ventas/detalles-servicios', detalleServicioRoutes);

module.exports = app; // 👈 Exportamos app para usarlo en server.js