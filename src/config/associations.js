const { Usuario } = require('../models/User');
const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../models/roles');
const UserRole = require('../models/UserRole');
const Product = require('../models/Product');
const Characteristic = require('../models/Characteristic');
const TechnicalSheet = require('../models/TechnicalSheet');
const ProductCategory = require('../models/ProductCategory');
const Compra = require('../models/Purchase');
const DetalleCompra = require('../models/PurchaseDetail');
const Proveedor = require('../models/Supplier');
const Services = require('../models/Services');
const Citas = require('../models/Appointment');
const ServiceDetail = require('../models/serviceDetails/ServiceDetail');
const Scheduling = require('../models/Scheduling');

function setupAssociations() {
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

  // ===== ASOCIACIONES COMPRAS =====

  // Relación entre Proveedor y Compra
  Proveedor.hasMany(Compra, {
    foreignKey: 'id_proveedor',
    as: 'compras'
  });

  Compra.belongsTo(Proveedor, {
    foreignKey: 'id_proveedor',
    as: 'proveedor'
  });

  // Relación entre Compra y DetalleCompra
  Compra.hasMany(DetalleCompra, {
    foreignKey: 'id_compra',
    as: 'detalles'
  });

  DetalleCompra.belongsTo(Compra, {
    foreignKey: 'id_compra',
    as: 'compra'
  });

  // Relación entre Producto y DetalleCompra
  Product.hasMany(DetalleCompra, {
    foreignKey: 'id_producto',
    as: 'detallesCompras'
  });

  DetalleCompra.belongsTo(Product, {
    foreignKey: 'id_producto',
    as: 'producto'
  });
  
  // ===== ASOCIACIONES CITAS (APPOINTMENTS) =====
  
  // Relación entre Citas y Usuario
  Citas.belongsTo(Usuario, {
    foreignKey: 'id_cliente',
    as: 'usuario'
  });

  Usuario.hasMany(Citas, {
    foreignKey: 'id_cliente',
    as: 'citas'
  });

  // Relación entre Citas y ServiceDetail
  Citas.hasMany(ServiceDetail, {
    foreignKey: 'id_cita',
    as: 'servicios'
  });

  ServiceDetail.belongsTo(Citas, {
    foreignKey: 'id_cita',
    as: 'cita'
  });

  // Relación entre ServiceDetail y Usuario (empleado)
  ServiceDetail.belongsTo(Usuario, {
    foreignKey: 'id_empleado',
    as: 'empleado'
  });

  Usuario.hasMany(ServiceDetail, {
    foreignKey: 'id_empleado',
    as: 'serviciosAsignados'
  });

  // Relación entre ServiceDetail y Usuario - para compatibilidad
  ServiceDetail.belongsTo(Usuario, {
    foreignKey: 'id_cliente',
    as: 'usuario'
  });

  Usuario.hasMany(ServiceDetail, {
    foreignKey: 'id_cliente',
    as: 'serviciosSolicitados'
  });

  // Relación entre ServiceDetail y Services
  ServiceDetail.belongsTo(Services, {
    foreignKey: 'id_servicio',
    as: 'servicio'
  });

  Services.hasMany(ServiceDetail, {
    foreignKey: 'id_servicio',
    as: 'detallesServicios'
  });

  // Relación entre Scheduling y Usuario (ya definida en el modelo Scheduling)
  // Solo definimos la relación inversa aquí
  Usuario.hasMany(Scheduling, {
    foreignKey: 'id_usuario',
    as: 'programaciones'
  });

  console.log('Asociaciones configuradas correctamente. Nota: Referencias a "cliente" reemplazadas con "usuario" para consistencia.');
}

module.exports = { setupAssociations };
