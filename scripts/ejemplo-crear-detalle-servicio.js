/**
 * Ejemplo de cómo crear detalles de servicio cliente
 * Este script muestra cómo usar la API para crear órdenes de servicio
 */

const axios = require('axios');

// Configuración base
const BASE_URL = 'http://localhost:3000/api';
const API_TOKEN = 'tu_token_aqui'; // Reemplazar con token válido

// Headers para las peticiones
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`
};

// Ejemplos de datos para crear detalles de servicio

// Ejemplo 1: Crear detalle con servicio (precio automático)
async function crearDetalleConServicio() {
  try {
    console.log('=== Creando detalle con servicio ===');
    
    const detalleData = {
      serviceClientId: 1,        // ID del servicio cliente
      serviceId: 3,              // ID del servicio (Coloración - $120.00)
      empleadoId: 8,             // ID del empleado
      quantity: 1,               // Cantidad
      // unitPrice se obtiene automáticamente del servicio ($120.00)
      // subtotal se calcula automáticamente ($120.00 * 1 = $120.00)
    };

    const response = await axios.post(`${BASE_URL}/detalles-servicio`, detalleData, { headers });
    
    console.log('✅ Detalle creado exitosamente:');
    console.log('ID:', response.data.data.id);
    console.log('Servicio:', response.data.data.serviceId);
    console.log('Empleado:', response.data.data.empleadoId);
    console.log('Cantidad:', response.data.data.quantity);
    console.log('Precio Unitario:', response.data.data.unitPrice);
    console.log('Subtotal:', response.data.data.subtotal);
    console.log('Estado:', response.data.data.status);
    console.log('');
    
    return response.data.data.id;
  } catch (error) {
    console.error('❌ Error al crear detalle con servicio:', error.response?.data || error.message);
  }
}

// Ejemplo 2: Crear detalle con producto (precio automático)
async function crearDetalleConProducto() {
  try {
    console.log('=== Creando detalle con producto ===');
    
    const detalleData = {
      serviceClientId: 1,        // ID del servicio cliente
      productId: 5,              // ID del producto (Shampoo - $25.00)
      empleadoId: 8,             // ID del empleado
      quantity: 2,               // Cantidad
      // unitPrice se obtiene automáticamente del producto ($25.00)
      // subtotal se calcula automáticamente ($25.00 * 2 = $50.00)
    };

    const response = await axios.post(`${BASE_URL}/detalles-servicio`, detalleData, { headers });
    
    console.log('✅ Detalle creado exitosamente:');
    console.log('ID:', response.data.data.id);
    console.log('Producto:', response.data.data.productId);
    console.log('Empleado:', response.data.data.empleadoId);
    console.log('Cantidad:', response.data.data.quantity);
    console.log('Precio Unitario:', response.data.data.unitPrice);
    console.log('Subtotal:', response.data.data.subtotal);
    console.log('Estado:', response.data.data.status);
    console.log('');
    
    return response.data.data.id;
  } catch (error) {
    console.error('❌ Error al crear detalle con producto:', error.response?.data || error.message);
  }
}

// Ejemplo 3: Crear detalle con precio personalizado
async function crearDetalleConPrecioPersonalizado() {
  try {
    console.log('=== Creando detalle con precio personalizado ===');
    
    const detalleData = {
      serviceClientId: 1,        // ID del servicio cliente
      serviceId: 2,              // ID del servicio (Peinado - $45.00)
      empleadoId: 8,             // ID del empleado
      quantity: 1,               // Cantidad
      unitPrice: 50.00,          // Precio personalizado (sobrescribe el precio del servicio)
      // subtotal se calcula automáticamente ($50.00 * 1 = $50.00)
    };

    const response = await axios.post(`${BASE_URL}/detalles-servicio`, detalleData, { headers });
    
    console.log('✅ Detalle creado exitosamente:');
    console.log('ID:', response.data.data.id);
    console.log('Servicio:', response.data.data.serviceId);
    console.log('Empleado:', response.data.data.empleadoId);
    console.log('Cantidad:', response.data.data.quantity);
    console.log('Precio Unitario:', response.data.data.unitPrice);
    console.log('Subtotal:', response.data.data.subtotal);
    console.log('Estado:', response.data.data.status);
    console.log('');
    
    return response.data.data.id;
  } catch (error) {
    console.error('❌ Error al crear detalle con precio personalizado:', error.response?.data || error.message);
  }
}

// Ejemplo 4: Obtener todos los detalles de un servicio cliente
async function obtenerDetallesPorServicioCliente(serviceClientId) {
  try {
    console.log(`=== Obteniendo detalles del servicio cliente ${serviceClientId} ===`);
    
    const response = await axios.get(`${BASE_URL}/detalles-servicio/service-client/${serviceClientId}`, { headers });
    
    console.log('✅ Detalles obtenidos exitosamente:');
    console.log('Total de detalles:', response.data.data.length);
    
    response.data.data.forEach((detalle, index) => {
      console.log(`\nDetalle ${index + 1}:`);
      console.log('  ID:', detalle.id);
      console.log('  Servicio:', detalle.serviceId || 'N/A');
      console.log('  Producto:', detalle.productId || 'N/A');
      console.log('  Empleado:', detalle.empleadoId);
      console.log('  Cantidad:', detalle.quantity);
      console.log('  Precio Unitario:', detalle.unitPrice);
      console.log('  Subtotal:', detalle.subtotal);
      console.log('  Estado:', detalle.status);
    });
    
    // Calcular total
    const total = response.data.data.reduce((sum, detalle) => sum + parseFloat(detalle.subtotal), 0);
    console.log(`\n💰 Total del servicio cliente: $${total.toFixed(2)}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error al obtener detalles:', error.response?.data || error.message);
  }
}

// Ejemplo 5: Calcular subtotal de un detalle específico
async function calcularSubtotal(detalleId) {
  try {
    console.log(`=== Calculando subtotal del detalle ${detalleId} ===`);
    
    const response = await axios.get(`${BASE_URL}/detalles-servicio/${detalleId}/subtotal`, { headers });
    
    console.log('✅ Subtotal calculado:');
    console.log('Precio Unitario:', response.data.data.unitPrice);
    console.log('Cantidad:', response.data.data.quantity);
    console.log('Subtotal:', response.data.data.subtotal);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error al calcular subtotal:', error.response?.data || error.message);
  }
}

// Ejemplo 6: Cambiar estado de un detalle
async function cambiarEstado(detalleId, nuevoEstado) {
  try {
    console.log(`=== Cambiando estado del detalle ${detalleId} a "${nuevoEstado}" ===`);
    
    const response = await axios.patch(`${BASE_URL}/detalles-servicio/${detalleId}/status`, 
      { estado: nuevoEstado }, 
      { headers }
    );
    
    console.log('✅ Estado cambiado exitosamente:');
    console.log('Nuevo estado:', response.data.data.status);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error al cambiar estado:', error.response?.data || error.message);
  }
}

// Función principal para ejecutar todos los ejemplos
async function ejecutarEjemplos() {
  console.log('🚀 Iniciando ejemplos de creación de detalles de servicio\n');
  
  // Crear diferentes tipos de detalles
  const detalle1 = await crearDetalleConServicio();
  const detalle2 = await crearDetalleConProducto();
  const detalle3 = await crearDetalleConPrecioPersonalizado();
  
  // Esperar un momento para que se procesen
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Obtener todos los detalles del servicio cliente
  await obtenerDetallesPorServicioCliente(1);
  
  // Calcular subtotales
  if (detalle1) await calcularSubtotal(detalle1);
  if (detalle2) await calcularSubtotal(detalle2);
  
  // Cambiar estado de un detalle
  if (detalle1) await cambiarEstado(detalle1, 'Pagada');
  
  console.log('✅ Ejemplos completados');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarEjemplos().catch(console.error);
}

module.exports = {
  crearDetalleConServicio,
  crearDetalleConProducto,
  crearDetalleConPrecioPersonalizado,
  obtenerDetallesPorServicioCliente,
  calcularSubtotal,
  cambiarEstado
};
