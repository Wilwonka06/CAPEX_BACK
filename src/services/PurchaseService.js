const Compra = require('../models/Purchase');
const DetalleCompra = require('../models/PurchaseDetail');
const Product = require('../models/Product');
const Proveedor = require('../models/Supplier');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

class CompraService {
    // Obtener todas las compras con paginación
    async getAllCompras(page = 1, limit = 10, includeDetalles = true) {
        const offset = (page - 1) * limit;

        const options = {
            limit,
            offset,
            order: [['fecha_compra', 'DESC']],
            include: [
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre', 'telefono']
                }
            ]
        };

        if (includeDetalles) {
            options.include.push({
                model: DetalleCompra,
                as: 'detalles',
                include: [
                    {
                        model: Product,
                        as: 'producto',
                        attributes: ['id_producto', 'nombre', 'precio_venta']
                    }
                ]
            });
        }

        const { count, rows } = await Compra.findAndCountAll(options);

        return {
            compras: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        };
    }

    // Obtener compra por ID
    async getCompraById(id, includeDetalles = true) {
        const options = {
            where: { id_compra: id },
            include: [
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre', 'telefono', 'correo']
                }
            ]
        };

        if (includeDetalles) {
            options.include.push({
                model: DetalleCompra,
                as: 'detalles',
                include: [
                    {
                        model: Product,
                        as: 'producto',
                        attributes: ['id_producto', 'nombre', 'precio_venta', 'stock']
                    }
                ]
            });
        }

        return await Compra.findOne(options);
    }

    // Crear nueva compra con transacción
    async createCompra(compraData) {
        return await sequelize.transaction(async (t) => {
            const { detalles, ...compraInfo } = compraData;

            if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
                throw new Error('La compra debe tener al menos un detalle');
            }

            const proveedor = await Proveedor.findByPk(compraInfo.id_proveedor, { transaction: t });
            if (!proveedor) {
                throw new Error('Proveedor no encontrado');
            }

            let subtotalCalculado = 0;
            let ivaCalculado = 0;
            const detallesValidados = [];

            for (const detalle of detalles) {
                const producto = await Product.findByPk(detalle.id_producto, { transaction: t });
                if (!producto) {
                    throw new Error(`Producto con ID ${detalle.id_producto} no encontrado`);
                }

                if (!detalle.cantidad || detalle.cantidad <= 0) {
                    throw new Error(`La cantidad debe ser mayor a 0 para el producto ${producto.nombre}`);
                }

                if (!detalle.precio_unitario || detalle.precio_unitario <= 0) {
                    throw new Error(`El precio unitario debe ser mayor a 0 para el producto ${producto.nombre}`);
                }

                const subtotalDetalle = detalle.cantidad * detalle.precio_unitario;
                const ivaProducto = producto.iva || 0;
                const ivaDetalle = subtotalDetalle * (ivaProducto / 100);

                subtotalCalculado += subtotalDetalle;
                ivaCalculado += ivaDetalle;

                detallesValidados.push({
                    id_producto: detalle.id_producto,
                    cantidad: detalle.cantidad,
                    precio_unitario: detalle.precio_unitario,
                    subtotal: subtotalDetalle
                });
            }

            const totalCalculado = subtotalCalculado + ivaCalculado;

            const nuevaCompra = await Compra.create({
                id_proveedor: compraInfo.id_proveedor,
                fecha_registro: new Date(),
                fecha_compra: compraInfo.fecha_compra,
                subtotal: subtotalCalculado,
                iva: ivaCalculado,
                total: totalCalculado,
                estado: 'Completada'
            }, { transaction: t });

            for (const detalle of detallesValidados) {
                await DetalleCompra.create({
                    id_compra: nuevaCompra.id_compra,
                    ...detalle
                }, { transaction: t });

                await Product.increment('stock', {
                    by: detalle.cantidad,
                    where: { id_producto: detalle.id_producto },
                    transaction: t
                });
            }

            // Ojo 👀: devolvemos aquí mismo la compra recién creada
            return await this.getCompraById(nuevaCompra.id_compra);
        });
    }

    // Cancelar compra
    async cancelarCompra(id) {
        const transaction = await sequelize.transaction();

        try {
            const compra = await Compra.findByPk(id, {
                include: [
                    {
                        model: DetalleCompra,
                        as: 'detalles'
                    }
                ],
                transaction
            });

            if (!compra) {
                throw new Error('Compra no encontrada');
            }

            if (compra.estado === 'Cancelada') {
                throw new Error('La compra ya está cancelada');
            }

            // Revertir el stock de los productos
            for (const detalle of compra.detalles) {
                await Product.decrement('stock', {
                    by: detalle.cantidad,
                    where: { id_producto: detalle.id_producto },
                    transaction
                });
            }

            // Cambiar estado a cancelada
            await compra.update({ estado: 'Cancelada' }, { transaction });

            await transaction.commit();

            return await this.getCompraById(id);

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // Buscar compras por proveedor
    async getComprasByProveedor(idProveedor, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Compra.findAndCountAll({
            where: { id_proveedor: idProveedor },
            include: [
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre', 'telefono']
                },
                {
                    model: DetalleCompra,
                    as: 'detalles',
                    include: [
                        {
                            model: Product,
                            as: 'producto',
                            attributes: ['id_producto', 'nombre']
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [['fecha_compra', 'DESC']]
        });

        return {
            compras: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        };
    }

    // Filtrar compras por fecha
    async getComprasByFecha(fechaInicio, fechaFin, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const whereClause = {};

        if (fechaInicio && fechaFin) {
            whereClause.fecha_compra = {
                [Op.between]: [fechaInicio, fechaFin]
            };
        } else if (fechaInicio) {
            whereClause.fecha_compra = {
                [Op.gte]: fechaInicio
            };
        } else if (fechaFin) {
            whereClause.fecha_compra = {
                [Op.lte]: fechaFin
            };
        }

        const { count, rows } = await Compra.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre']
                }
            ],
            limit,
            offset,
            order: [['fecha_compra', 'DESC']]
        });

        return {
            compras: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        };
    }

    // Obtener estadísticas de compras
    async getEstadisticas() {
        const totalCompras = await Compra.count();
        const comprasCompletadas = await Compra.count({ where: { estado: 'Completada' } });
        const comprasCanceladas = await Compra.count({ where: { estado: 'Cancelada' } });

        const montoTotal = await Compra.sum('total', { where: { estado: 'Completada' } });

        const comprasMesActual = await Compra.count({
            where: {
                estado: 'Completada',
                fecha_compra: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });

        return {
            totalCompras,
            comprasCompletadas,
            comprasCanceladas,
            montoTotal: parseFloat(montoTotal || 0).toFixed(2),
            comprasMesActual
        };
    }
}

module.exports = new CompraService();