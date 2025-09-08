const { Usuario } = require('../models/User');
const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../models/roles');
const UserRole = require('../models/UserRole');
const Client = require('../models/clients/Client');
const Product = require('../models/Product');
const Characteristic = require('../models/Characteristic');
const TechnicalSheet = require('../models/TechnicalSheet');
const ProductCategory = require('../models/ProductCategory');
const Services = require('../models/Services');
const Appointment = require('../models/Appointment');

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
    foreignKey: 'id_producto',
    as: 'fichasTecnicas'
  });

  // Una ficha técnica pertenece a un producto
  TechnicalSheet.belongsTo(Product, {
    foreignKey: 'id_producto',
    as: 'producto'
  });

  // Una característica puede estar en muchas fichas técnicas
  Characteristic.hasMany(TechnicalSheet, {
    foreignKey: 'id_caracteristica',
    as: 'fichasTecnicas'
  });

  // Una ficha técnica pertenece a una característica
  TechnicalSheet.belongsTo(Characteristic, {
    foreignKey: 'id_caracteristica',
    as: 'caracteristica'
  });

  // Relación muchos a muchos entre Product y Characteristic a través de TechnicalSheet
  Product.belongsToMany(Characteristic, {
    through: TechnicalSheet,
    foreignKey: 'id_producto',
    otherKey: 'id_caracteristica',
    as: 'caracteristicas'
  });

  Characteristic.belongsToMany(Product, {
    through: TechnicalSheet,
    foreignKey: 'id_caracteristica',
    otherKey: 'id_producto',
    as: 'productos'
  });

  // Relación entre ProductCategory y Product
  ProductCategory.hasMany(Product, {
    foreignKey: 'id_categoria_producto',
    as: 'productos'
  });

  Product.belongsTo(ProductCategory, {
    foreignKey: 'id_categoria_producto',
    as: 'categoria'
  });

  // ===== ASOCIACIONES CITAS (APPOINTMENTS) =====
  
  // Un usuario puede tener muchas citas
  Usuario.hasMany(Appointment, {
    foreignKey: 'id_usuario',
    as: 'citas'
  });

  // Una cita pertenece a un usuario
  Appointment.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });

  // Un servicio puede estar en muchas citas
  Services.hasMany(Appointment, {
    foreignKey: 'id_servicio',
    as: 'citas'
  });

  // Una cita pertenece a un servicio
  Appointment.belongsTo(Services, {
    foreignKey: 'id_servicio',
    as: 'servicio'
  });

  console.log('✅ Asociaciones configuradas correctamente');
}

module.exports = { setupAssociations };
