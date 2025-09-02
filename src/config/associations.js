const { Usuario } = require('../models/User');
const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../models/roles');
const UserRole = require('../models/UserRole');
const Client = require('../models/clients/Client');
const Product = require('../models/Product');
const Characteristic = require('../models/Characteristic');
const TechnicalSheet = require('../models/TechnicalSheet');
const ProductCategory = require('../models/ProductCategory');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
const Employee = require('../models/Employee');
const Scheduling = require('../models/Scheduling');
const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
const Supplier = require('../models/Supplier');

/**
 * Configurar todas las asociaciones entre modelos
 */
function setupAssociations() {
  console.log('🔗 Configurando asociaciones entre modelos...');

  // ===== ASOCIACIONES USUARIOS Y ROLES =====
  
  // Relación directa entre Usuario y Role (para el campo roleId)
  Usuario.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'rol'
  });

  Role.hasMany(Usuario, {
    foreignKey: 'roleId',
    as: 'usuariosDirectos'
  });
  
  // Relación muchos a muchos entre Usuario y Role a través de UserRole
  Usuario.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'id_usuario',
    otherKey: 'id_rol',
    as: 'roles'
  });

  Role.belongsToMany(Usuario, {
    through: UserRole,
    foreignKey: 'id_rol',
    otherKey: 'id_usuario',
    as: 'usuarios'
  });

  // Relaciones directas con UserRole
  UserRole.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });

  UserRole.belongsTo(Role, {
    foreignKey: 'id_rol',
    as: 'rol'
  });

  Usuario.hasMany(UserRole, {
    foreignKey: 'id_usuario',
    as: 'userRoles'
  });

  Role.hasMany(UserRole, {
    foreignKey: 'id_rol',
    as: 'userRoles'
  });

  // ===== ASOCIACIONES USUARIOS Y CLIENTES =====
  
  // Establecer relación Usuario-Cliente
  Usuario.hasOne(Client, {
    foreignKey: 'id_usuario',
    as: 'cliente'
  });

  Client.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });

  // ===== ASOCIACIONES PRODUCTOS =====
  
  // Un producto puede tener muchas fichas técnicas
  Product.hasMany(TechnicalSheet, {
    foreignKey: 'producto_id',
    as: 'fichasTecnicas'
  });

  // Una ficha técnica pertenece a un producto
  TechnicalSheet.belongsTo(Product, {
    foreignKey: 'producto_id',
    as: 'producto'
  });

  // Una característica puede estar en muchas fichas técnicas
  Characteristic.hasMany(TechnicalSheet, {
    foreignKey: 'caracteristica_id',
    as: 'fichasTecnicas'
  });

  // Una ficha técnica pertenece a una característica
  TechnicalSheet.belongsTo(Characteristic, {
    foreignKey: 'caracteristica_id',
    as: 'caracteristica'
  });

  // Relación muchos a muchos entre Product y Characteristic a través de TechnicalSheet
  Product.belongsToMany(Characteristic, {
    through: TechnicalSheet,
    foreignKey: 'producto_id',
    otherKey: 'caracteristica_id',
    as: 'caracteristicas'
  });

  Characteristic.belongsToMany(Product, {
    through: TechnicalSheet,
    foreignKey: 'caracteristica_id',
    otherKey: 'producto_id',
    as: 'productos'
  });

  // Relación entre ProductCategory y Product
  ProductCategory.hasMany(Product, {
    foreignKey: 'categoria_id',
    as: 'productos'
  });

  Product.belongsTo(ProductCategory, {
    foreignKey: 'categoria_id',
    as: 'categoria'
  });

  // ===== ASOCIACIONES SERVICIOS =====
  
  // Relación entre ServiceCategory y Service
  ServiceCategory.hasMany(Service, {
    foreignKey: 'categoria_id',
    as: 'servicios'
  });

  Service.belongsTo(ServiceCategory, {
    foreignKey: 'categoria_id',
    as: 'categoria'
  });

  // ===== ASOCIACIONES EMPLEADOS =====
  
  // Un empleado puede tener muchas programaciones
  Employee.hasMany(Scheduling, {
    foreignKey: 'empleado_id',
    as: 'programaciones'
  });

  Scheduling.belongsTo(Employee, {
    foreignKey: 'empleado_id',
    as: 'empleado'
  });

  // ===== ASOCIACIONES DETALLES DE SERVICIO =====
  
  // Un servicio cliente puede tener muchos detalles de servicio
  // Nota: Asumiendo que existe un modelo ServiceClient
  // ServiceClient.hasMany(ServiceDetail, {
  //   foreignKey: 'id_servicio_cliente',
  //   as: 'detallesServicio'
  // });

  // ServiceDetail.belongsTo(ServiceClient, {
  //   foreignKey: 'id_servicio_cliente',
  //   as: 'servicioCliente'
  // });

  // Un producto puede estar en muchos detalles de servicio
  Product.hasMany(ServiceDetail, {
    foreignKey: 'id_producto',
    as: 'detallesServicio'
  });

  ServiceDetail.belongsTo(Product, {
    foreignKey: 'id_producto',
    as: 'producto'
  });

  // Un servicio puede estar en muchos detalles de servicio
  Service.hasMany(ServiceDetail, {
    foreignKey: 'id_servicio',
    as: 'detallesServicio'
  });

  ServiceDetail.belongsTo(Service, {
    foreignKey: 'id_servicio',
    as: 'servicio'
  });

  // Un empleado puede tener muchos detalles de servicio
  Employee.hasMany(ServiceDetail, {
    foreignKey: 'id_empleado',
    as: 'detallesServicio'
  });

  ServiceDetail.belongsTo(Employee, {
    foreignKey: 'id_empleado',
    as: 'empleado'
  });

  console.log('✅ Asociaciones configuradas correctamente');
}

module.exports = { setupAssociations };
