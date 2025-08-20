const ServiceDetail = require('./ServiceDetail');
const Employee = require('../employees/Employee');
const Service = require('../services/Service');
const ServiceClient = require('../serviceClients/ServiceClient');
const Client = require('../clients/Client');

// Define associations
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

// Reverse associations
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

// ServiceClient associations
ServiceClient.belongsTo(Client, {
  foreignKey: 'id_client',
  as: 'client'
});

Client.hasMany(ServiceClient, {
  foreignKey: 'id_client',
  as: 'serviceClients'
});

module.exports = {
  ServiceDetail,
  Employee,
  Service,
  ServiceClient,
  Client
};
