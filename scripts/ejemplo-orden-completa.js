/**
 * Ejemplo de orden completa con múltiples servicios y productos
 * Este script muestra cómo crear una orden realista de peluquería
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

// Función para crear un detalle de servicio
async function crearDetalle(detalleData) {
  try {
    const response = await axios.post(`${BASE_URL}/detalles-servicio`, detalleData, { headers });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear detalle:', error.response?.data || error.message);
    return null;
  }
}

// Función para obtener detalles de un servicio cliente
async function obtenerDetallesServicioCliente(serviceClientId) {
  try {
    const response = await axios.get(`${BASE_URL}/detalles-servicio/service-client/${serviceClientId}`, { headers });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener detalles:', error.response?.data || error.message);
    return [];
  }
}

// Ejemplo: Orden completa de coloración con productos
async function crearOrdenColoracion() {
  console.log('🎨 === CREANDO ORDEN COMPLETA DE COLORACIÓN ===\n');
  
  const serviceClientId = 1; // ID del servicio cliente
  const detalles = [];
  
  // 1. SERVICIO: Coloración
  console.log('1️⃣ Agregando servicio de coloración...');
  const detalleColoracion = await crearDetalle({
    serviceClientId,
    serviceId: 3,        // Coloración - $120.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleColoracion) {
    detalles.push(detalleColoracion);
    console.log('✅ Coloración agregada: $' + detalleColoracion.subtotal);
  }
  
  // 2. PRODUCTO: Tinte
  console.log('\n2️⃣ Agregando tinte...');
  const detalleTinte = await crearDetalle({
    serviceClientId,
    productId: 9,        // Tinte - $55.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleTinte) {
    detalles.push(detalleTinte);
    console.log('✅ Tinte agregado: $' + detalleTinte.subtotal);
  }
  
  // 3. PRODUCTO: Oxidante
  console.log('\n3️⃣ Agregando oxidante...');
  const detalleOxidante = await crearDetalle({
    serviceClientId,
    productId: 11,       // Oxidante - $20.00
    empleadoId: 8,
    quantity: 2
  });
  
  if (detalleOxidante) {
    detalles.push(detalleOxidante);
    console.log('✅ Oxidante agregado: $' + detalleOxidante.subtotal);
  }
  
  // 4. PRODUCTO: Shampoo
  console.log('\n4️⃣ Agregando shampoo...');
  const detalleShampoo = await crearDetalle({
    serviceClientId,
    productId: 5,        // Shampoo - $25.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleShampoo) {
    detalles.push(detalleShampoo);
    console.log('✅ Shampoo agregado: $' + detalleShampoo.subtotal);
  }
  
  // 5. PRODUCTO: Acondicionador
  console.log('\n5️⃣ Agregando acondicionador...');
  const detalleAcondicionador = await crearDetalle({
    serviceClientId,
    productId: 6,        // Acondicionador - $30.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleAcondicionador) {
    detalles.push(detalleAcondicionador);
    console.log('✅ Acondicionador agregado: $' + detalleAcondicionador.subtotal);
  }
  
  // Mostrar resumen
  console.log('\n📋 === RESUMEN DE LA ORDEN ===');
  console.log('Servicio Cliente ID:', serviceClientId);
  console.log('Total de detalles:', detalles.length);
  
  let total = 0;
  detalles.forEach((detalle, index) => {
    const tipo = detalle.serviceId ? 'SERVICIO' : 'PRODUCTO';
    const nombre = detalle.serviceId ? `Servicio ID ${detalle.serviceId}` : `Producto ID ${detalle.productId}`;
    console.log(`${index + 1}. ${tipo}: ${nombre} - $${detalle.subtotal}`);
    total += parseFloat(detalle.subtotal);
  });
  
  console.log('\n💰 TOTAL DE LA ORDEN: $' + total.toFixed(2));
  console.log('');
  
  return detalles;
}

// Ejemplo: Orden de peinado con productos
async function crearOrdenPeinado() {
  console.log('💇‍♀️ === CREANDO ORDEN DE PEINADO ===\n');
  
  const serviceClientId = 2; // ID del servicio cliente
  const detalles = [];
  
  // 1. SERVICIO: Peinado
  console.log('1️⃣ Agregando servicio de peinado...');
  const detallePeinado = await crearDetalle({
    serviceClientId,
    serviceId: 2,        // Peinado - $45.00
    empleadoId: 9,
    quantity: 1
  });
  
  if (detallePeinado) {
    detalles.push(detallePeinado);
    console.log('✅ Peinado agregado: $' + detallePeinado.subtotal);
  }
  
  // 2. PRODUCTO: Gel
  console.log('\n2️⃣ Agregando gel...');
  const detalleGel = await crearDetalle({
    serviceClientId,
    productId: 12,       // Gel - $15.00
    empleadoId: 9,
    quantity: 1
  });
  
  if (detalleGel) {
    detalles.push(detalleGel);
    console.log('✅ Gel agregado: $' + detalleGel.subtotal);
  }
  
  // 3. PRODUCTO: Laca
  console.log('\n3️⃣ Agregando laca...');
  const detalleLaca = await crearDetalle({
    serviceClientId,
    productId: 13,       // Laca - $18.00
    empleadoId: 9,
    quantity: 1
  });
  
  if (detalleLaca) {
    detalles.push(detalleLaca);
    console.log('✅ Laca agregada: $' + detalleLaca.subtotal);
  }
  
  // Mostrar resumen
  console.log('\n📋 === RESUMEN DE LA ORDEN ===');
  console.log('Servicio Cliente ID:', serviceClientId);
  console.log('Total de detalles:', detalles.length);
  
  let total = 0;
  detalles.forEach((detalle, index) => {
    const tipo = detalle.serviceId ? 'SERVICIO' : 'PRODUCTO';
    const nombre = detalle.serviceId ? `Servicio ID ${detalle.serviceId}` : `Producto ID ${detalle.productId}`;
    console.log(`${index + 1}. ${tipo}: ${nombre} - $${detalle.subtotal}`);
    total += parseFloat(detalle.subtotal);
  });
  
  console.log('\n💰 TOTAL DE LA ORDEN: $' + total.toFixed(2));
  console.log('');
  
  return detalles;
}

// Ejemplo: Orden de tratamiento capilar
async function crearOrdenTratamiento() {
  console.log('🧴 === CREANDO ORDEN DE TRATAMIENTO CAPILAR ===\n');
  
  const serviceClientId = 3; // ID del servicio cliente
  const detalles = [];
  
  // 1. SERVICIO: Tratamiento Capilar
  console.log('1️⃣ Agregando servicio de tratamiento...');
  const detalleTratamiento = await crearDetalle({
    serviceClientId,
    serviceId: 5,        // Tratamiento Capilar - $80.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleTratamiento) {
    detalles.push(detalleTratamiento);
    console.log('✅ Tratamiento agregado: $' + detalleTratamiento.subtotal);
  }
  
  // 2. PRODUCTO: Mascarilla
  console.log('\n2️⃣ Agregando mascarilla...');
  const detalleMascarilla = await crearDetalle({
    serviceClientId,
    productId: 7,        // Mascarilla - $45.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleMascarilla) {
    detalles.push(detalleMascarilla);
    console.log('✅ Mascarilla agregada: $' + detalleMascarilla.subtotal);
  }
  
  // 3. PRODUCTO: Aceite Capilar
  console.log('\n3️⃣ Agregando aceite capilar...');
  const detalleAceite = await crearDetalle({
    serviceClientId,
    productId: 8,        // Aceite - $35.00
    empleadoId: 8,
    quantity: 1
  });
  
  if (detalleAceite) {
    detalles.push(detalleAceite);
    console.log('✅ Aceite agregado: $' + detalleAceite.subtotal);
  }
  
  // 4. PRODUCTO: Shampoo (precio personalizado)
  console.log('\n4️⃣ Agregando shampoo con precio especial...');
  const detalleShampooEspecial = await crearDetalle({
    serviceClientId,
    productId: 5,        // Shampoo - $25.00 (precio original)
    empleadoId: 8,
    quantity: 1,
    unitPrice: 20.00     // Precio especial
  });
  
  if (detalleShampooEspecial) {
    detalles.push(detalleShampooEspecial);
    console.log('✅ Shampoo especial agregado: $' + detalleShampooEspecial.subtotal);
  }
  
  // Mostrar resumen
  console.log('\n📋 === RESUMEN DE LA ORDEN ===');
  console.log('Servicio Cliente ID:', serviceClientId);
  console.log('Total de detalles:', detalles.length);
  
  let total = 0;
  detalles.forEach((detalle, index) => {
    const tipo = detalle.serviceId ? 'SERVICIO' : 'PRODUCTO';
    const nombre = detalle.serviceId ? `Servicio ID ${detalle.serviceId}` : `Producto ID ${detalle.productId}`;
    const precioEspecial = detalle.unitPrice !== 25.00 ? ' (precio especial)' : '';
    console.log(`${index + 1}. ${tipo}: ${nombre}${precioEspecial} - $${detalle.subtotal}`);
    total += parseFloat(detalle.subtotal);
  });
  
  console.log('\n💰 TOTAL DE LA ORDEN: $' + total.toFixed(2));
  console.log('');
  
  return detalles;
}

// Función para mostrar todas las órdenes
async function mostrarTodasLasOrdenes() {
  console.log('📊 === MOSTRANDO TODAS LAS ÓRDENES ===\n');
  
  const serviceClientIds = [1, 2, 3];
  
  for (const serviceClientId of serviceClientIds) {
    console.log(`🔍 Obteniendo detalles del servicio cliente ${serviceClientId}...`);
    const detalles = await obtenerDetallesServicioCliente(serviceClientId);
    
    if (detalles.length > 0) {
      console.log(`\n📋 Servicio Cliente ${serviceClientId}:`);
      console.log('Total de detalles:', detalles.length);
      
      let total = 0;
      detalles.forEach((detalle, index) => {
        const tipo = detalle.serviceId ? 'SERVICIO' : 'PRODUCTO';
        const nombre = detalle.serviceId ? `Servicio ID ${detalle.serviceId}` : `Producto ID ${detalle.productId}`;
        console.log(`  ${index + 1}. ${tipo}: ${nombre} - $${detalle.subtotal}`);
        total += parseFloat(detalle.subtotal);
      });
      
      console.log(`💰 Total: $${total.toFixed(2)}\n`);
    } else {
      console.log(`No se encontraron detalles para el servicio cliente ${serviceClientId}\n`);
    }
  }
}

// Función principal
async function ejecutarEjemplosCompletos() {
  console.log('🚀 Iniciando ejemplos de órdenes completas\n');
  
  // Crear diferentes tipos de órdenes
  await crearOrdenColoracion();
  await crearOrdenPeinado();
  await crearOrdenTratamiento();
  
  // Esperar un momento para que se procesen
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mostrar todas las órdenes
  await mostrarTodasLasOrdenes();
  
  console.log('✅ Ejemplos de órdenes completas finalizados');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarEjemplosCompletos().catch(console.error);
}

module.exports = {
  crearOrdenColoracion,
  crearOrdenPeinado,
  crearOrdenTratamiento,
  mostrarTodasLasOrdenes
};
