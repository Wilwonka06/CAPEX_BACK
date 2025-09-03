const { Usuario } = require('../models/User');
const { Role, Permission, Privilege, RolePermissionPrivilege } = require('../models/roles');
const UserRole = require('../models/UserRole');
const Client = require('../models/clients/Client');
const Product = require('../models/Product');
const Characteristic = require('../models/Characteristic');
const TechnicalSheet = require('../models/TechnicalSheet');
const ProductCategory = require('../models/ProductCategory');
const Pedido = require('../models/salesProducts/Order');
const DetallePedido = require('../models/salesProducts/OrderDetail');
const VentaProducto = require('../models/salesProducts/SalesProduct');
const DetalleVentaProducto = require('../models/salesProducts/SalesProductDetail');

/**
 * Configurar todas las asociaciones entre modelos
 */
function setupAssociations() {
  console.log('Configurando asociaciones entre modelos...');

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

  // ===== ASOCIACIONES PEDIDOS =====

  // Un pedido puede tener muchos detalles
  Pedido.hasMany(DetallePedido, {
    foreignKey: 'id_pedido',
    as: 'detalles'
  });

  // Un detalle pertenece a un pedido
  DetallePedido.belongsTo(Pedido, {
    foreignKey: 'id_pedido',
    as: 'pedido'
  });

  // Un detalle pertenece a un producto
  DetallePedido.belongsTo(Product, {
    foreignKey: 'id_producto',
    as: 'producto'
  });

  // Un producto puede estar en muchos detalles de pedido
  Product.hasMany(DetallePedido, {
    foreignKey: 'id_producto',
    as: 'detallesPedidos'
  });

  // ===== ASOCIACIONES VENTAS DE PRODUCTOS =====
  
  // Relación entre VentaProducto y Cliente
  VentaProducto.belongsTo(Client, {
    foreignKey: 'id_cliente',
    as: 'cliente'
  });

  Client.hasMany(VentaProducto, {
    foreignKey: 'id_cliente',
    as: 'ventasProductos'
  });

  // Relación entre VentaProducto y DetalleVentaProducto
  VentaProducto.hasMany(DetalleVentaProducto, {
    foreignKey: 'id_venta_producto',
    as: 'detalles'
  });

  DetalleVentaProducto.belongsTo(VentaProducto, {
    foreignKey: 'id_venta_producto',
    as: 'venta'
  });

  // Relación entre DetalleVentaProducto y Product
  DetalleVentaProducto.belongsTo(Product, {
    foreignKey: 'id_producto',
    as: 'producto'
  });

  Product.hasMany(DetalleVentaProducto, {
    foreignKey: 'id_producto',
    as: 'detallesVentas'
  });

}

module.exports = { setupAssociations };
