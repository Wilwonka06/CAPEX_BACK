/**
 * EJEMPLO: RELACIÓN ENTRE SERVICIO_CLIENTE Y DETALLE_SERVICIO_CLIENTE
 * 
 * Este archivo muestra cómo funciona la relación:
 * 1. Primero se crea un servicio_cliente (cita/agenda)
 * 2. Luego se agregan detalles (productos/servicios) a ese servicio_cliente
 * 
 * FLUJO:
 * servicio_cliente (cita) → detalle_servicio_cliente (productos/servicios de esa cita)
 */

// ===== PASO 1: CREAR SERVICIO_CLIENTE (CITA/AGENDA) =====
// Primero necesitas crear un servicio_cliente (esto se hace en otro endpoint)

const ejemploCrearServicioCliente = {
  method: "POST",
  url: "http://localhost:3000/api/servicios-clientes", // Endpoint de servicios_clientes
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <tu_token_jwt>"
  },
  body: {
    "id_cliente": 1,
    "fecha_servicio": "2024-01-15",
    "hora_entrada": "09:00:00",
    "hora_salida": "11:00:00",
    "estado": "Confirmada",
    "motivo": "Corte de cabello y peinado"
  }
};

// Respuesta esperada del servicio_cliente:
const respuestaServicioCliente = {
  "success": true,
  "data": {
    "id_servicio_cliente": 1,  // ← ESTE ES EL ID QUE NECESITAS
    "id_cliente": 1,
    "fecha_servicio": "2024-01-15",
    "hora_entrada": "09:00:00",
    "hora_salida": "11:00:00",
    "estado": "Confirmada",
    "motivo": "Corte de cabello y peinado"
  },
  "message": "Servicio cliente creado exitosamente"
};

// ===== PASO 2: AGREGAR DETALLES AL SERVICIO_CLIENTE =====
// Ahora usas el ID del servicio_cliente para agregar productos/servicios

// Ejemplo 1: Agregar un producto al servicio_cliente
const ejemploAgregarProducto = {
  method: "POST",
  url: "http://localhost:3000/api/detalles-servicio", // Endpoint de detalle_servicio_cliente
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <tu_token_jwt>"
  },
  body: {
    "serviceClientId": 1,  // ← ID del servicio_cliente creado en el paso 1
    "productId": 1,        // Shampoo Profesional
    "quantity": 2,
    "unitPrice": 45.00
    // empleadoId: NO requerido para productos
  }
};

// Ejemplo 2: Agregar un servicio al servicio_cliente
const ejemploAgregarServicio = {
  method: "POST",
  url: "http://localhost:3000/api/detalles-servicio",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <tu_token_jwt>"
  },
  body: {
    "serviceClientId": 1,  // ← Mismo ID del servicio_cliente
    "serviceId": 1,        // Corte de Cabello
    "empleadoId": 1,       // SÍ requerido para servicios
    "quantity": 1,
    "unitPrice": 35.00
  }
};

// Ejemplo 3: Agregar producto + servicio al servicio_cliente
const ejemploAgregarProductoServicio = {
  method: "POST",
  url: "http://localhost:3000/api/detalles-servicio",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <tu_token_jwt>"
  },
  body: {
    "serviceClientId": 1,  // ← Mismo ID del servicio_cliente
    "productId": 7,        // Tinte Profesional
    "serviceId": 3,        // Coloración
    "empleadoId": 6,       // SÍ requerido porque hay servicio
    "quantity": 1,
    "unitPrice": 240.00    // 120 + 120
  }
};

// ===== PASO 3: VER TODOS LOS DETALLES DEL SERVICIO_CLIENTE =====

// Opción A: Ver detalles organizados (recomendado)
const ejemploVerDetallesOrganizados = {
  method: "GET",
  url: "http://localhost:3000/api/detalles-servicio/service-client/1/organized",
  headers: {
    "Authorization": "Bearer <tu_token_jwt>"
  }
};

// Respuesta esperada:
const respuestaDetallesOrganizados = {
  "success": true,
  "data": {
    "serviceClientId": 1,
    "resumen": {
      "totalDetalles": 3,
      "totalServicios": 2,
      "totalProductos": 1,
      "subtotalServicios": "275.00",
      "subtotalProductos": "90.00",
      "totalGeneral": "365.00"
    },
    "servicios": [
      {
        "id": 2,
        "serviceId": 1,
        "nombre": "Corte de Cabello",
        "empleadoId": 1,
        "empleado": {
          "id": 1,
          "nombre": "María González",
          "especialidad": "Corte y coloración"
        },
        "cantidad": 1,
        "precioUnitario": "35.00",
        "subtotal": "35.00",
        "estado": "En ejecución"
      },
      {
        "id": 3,
        "serviceId": 3,
        "nombre": "Coloración",
        "empleadoId": 6,
        "empleado": {
          "id": 6,
          "nombre": "Carmen Vega",
          "especialidad": "Coloración y mechas"
        },
        "cantidad": 1,
        "precioUnitario": "240.00",
        "subtotal": "240.00",
        "estado": "En ejecución"
      }
    ],
    "productos": [
      {
        "id": 1,
        "productId": 1,
        "nombre": "Shampoo Profesional",
        "cantidad": 2,
        "precioUnitario": "45.00",
        "subtotal": "90.00",
        "estado": "En ejecución"
      }
    ]
  },
  "message": "Detalles organizados obtenidos exitosamente"
};

// Opción B: Ver detalles en formato original
const ejemploVerDetallesOriginal = {
  method: "GET",
  url: "http://localhost:3000/api/detalles-servicio/service-client/1",
  headers: {
    "Authorization": "Bearer <tu_token_jwt>"
  }
};

// ===== EJEMPLO COMPLETO DE FLUJO =====

const flujoCompleto = {
  
  // PASO 1: Crear cita/servicio_cliente
  paso1_crearCita: {
    method: "POST",
    url: "http://localhost:3000/api/servicios-clientes",
    body: {
      "id_cliente": 1,
      "fecha_servicio": "2024-01-15",
      "hora_entrada": "09:00:00",
      "hora_salida": "11:00:00",
      "estado": "Confirmada",
      "motivo": "Corte de cabello y peinado"
    }
  },

  // PASO 2: Agregar productos/servicios a la cita
  paso2_agregarDetalles: [
    {
      method: "POST",
      url: "http://localhost:3000/api/detalles-servicio",
      body: {
        "serviceClientId": 1,  // ID de la cita creada
        "productId": 1,        // Shampoo
        "quantity": 1,
        "unitPrice": 45.00
      }
    },
    {
      method: "POST",
      url: "http://localhost:3000/api/detalles-servicio",
      body: {
        "serviceClientId": 1,  // Mismo ID de la cita
        "serviceId": 1,        // Corte
        "empleadoId": 1,       // María González
        "quantity": 1,
        "unitPrice": 35.00
      }
    },
    {
      method: "POST",
      url: "http://localhost:3000/api/detalles-servicio",
      body: {
        "serviceClientId": 1,  // Mismo ID de la cita
        "productId": 4,        // Aceite de Argán
        "serviceId": 2,        // Peinado
        "empleadoId": 4,       // Laura Martínez
        "quantity": 1,
        "unitPrice": 100.00    // 55 + 45
      }
    }
  ],

  // PASO 3: Ver todos los detalles de la cita
  paso3_verDetalles: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/service-client/1/organized"
  }
};

// ===== EXPLICACIÓN DE LA RELACIÓN =====

const explicacionRelacion = {
  
  // ¿Qué es servicio_cliente?
  servicioCliente: {
    descripcion: "Es una cita o agenda del cliente",
    ejemplo: "Cliente Juan tiene cita el 15 de enero a las 9:00 AM",
    campos: [
      "id_servicio_cliente - ID único de la cita",
      "id_cliente - Cliente que tiene la cita",
      "fecha_servicio - Fecha de la cita",
      "hora_entrada - Hora de inicio",
      "hora_salida - Hora de finalización",
      "estado - Estado de la cita (Confirmada, En proceso, etc.)",
      "motivo - Descripción de lo que va a hacer"
    ]
  },

  // ¿Qué es detalle_servicio_cliente?
  detalleServicioCliente: {
    descripcion: "Son los productos y servicios específicos de esa cita",
    ejemplo: "En la cita de Juan, va a comprar shampoo y le van a hacer un corte",
    campos: [
      "id_detalle - ID único del detalle",
      "id_servicio_cliente - ID de la cita a la que pertenece",
      "id_producto - Producto que va a comprar (opcional)",
      "id_servicio - Servicio que le van a hacer (opcional)",
      "id_empleado - Empleado que hará el servicio (si hay servicio)",
      "cantidad - Cantidad del producto/servicio",
      "precio_unitario - Precio por unidad",
      "subtotal - Total del detalle",
      "estado - Estado del detalle (En ejecución, Pagada)"
    ]
  },

  // Relación entre ambos
  relacion: {
    descripcion: "Una cita puede tener múltiples productos y servicios",
    ejemplo: "Cita #1 tiene: 1 shampoo, 1 corte de cabello, 1 peinado",
    estructura: {
      "servicio_cliente": {
        "id_servicio_cliente": 1,
        "cliente": "Juan Pérez",
        "fecha": "2024-01-15",
        "hora": "09:00-11:00"
      },
      "detalles": [
        {
          "id_detalle": 1,
          "id_servicio_cliente": 1,  // ← Referencia a la cita
          "producto": "Shampoo",
          "cantidad": 1,
          "precio": 45.00
        },
        {
          "id_detalle": 2,
          "id_servicio_cliente": 1,  // ← Misma referencia
          "servicio": "Corte de cabello",
          "empleado": "María González",
          "cantidad": 1,
          "precio": 35.00
        },
        {
          "id_detalle": 3,
          "id_servicio_cliente": 1,  // ← Misma referencia
          "servicio": "Peinado",
          "empleado": "Laura Martínez",
          "cantidad": 1,
          "precio": 45.00
        }
      ]
    }
  }
};

// ===== EJEMPLOS DE USO REAL =====

const ejemplosUsoReal = {
  
  // Escenario 1: Cliente viene solo a comprar productos
  escenario1_soloProductos: {
    // Crear cita
    crearCita: {
      method: "POST",
      url: "http://localhost:3000/api/servicios-clientes",
      body: {
        "id_cliente": 2,
        "fecha_servicio": "2024-01-16",
        "hora_entrada": "14:00:00",
        "hora_salida": "14:30:00",
        "estado": "Confirmada",
        "motivo": "Compra de productos"
      }
    },
    // Agregar productos
    agregarProductos: [
      {
        method: "POST",
        url: "http://localhost:3000/api/detalles-servicio",
        body: {
          "serviceClientId": 2,  // ID de la cita
          "productId": 1,        // Shampoo
          "quantity": 2,
          "unitPrice": 45.00
        }
      },
      {
        method: "POST",
        url: "http://localhost:3000/api/detalles-servicio",
        body: {
          "serviceClientId": 2,  // Mismo ID
          "productId": 2,        // Acondicionador
          "quantity": 1,
          "unitPrice": 38.00
        }
      }
    ]
  },

  // Escenario 2: Cliente viene a que le hagan servicios
  escenario2_soloServicios: {
    // Crear cita
    crearCita: {
      method: "POST",
      url: "http://localhost:3000/api/servicios-clientes",
      body: {
        "id_cliente": 3,
        "fecha_servicio": "2024-01-17",
        "hora_entrada": "10:00:00",
        "hora_salida": "12:00:00",
        "estado": "Confirmada",
        "motivo": "Manicure y pedicure"
      }
    },
    // Agregar servicios
    agregarServicios: [
      {
        method: "POST",
        url: "http://localhost:3000/api/detalles-servicio",
        body: {
          "serviceClientId": 3,  // ID de la cita
          "serviceId": 6,        // Manicure
          "empleadoId": 3,       // Carlos López
          "quantity": 1,
          "unitPrice": 25.00
        }
      },
      {
        method: "POST",
        url: "http://localhost:3000/api/detalles-servicio",
        body: {
          "serviceClientId": 3,  // Mismo ID
          "serviceId": 7,        // Pedicure
          "empleadoId": 3,       // Carlos López
          "quantity": 1,
          "unitPrice": 30.00
        }
      }
    ]
  },

  // Escenario 3: Cliente viene a comprar productos y que le hagan servicios
  escenario3_productosYServicios: {
    // Crear cita
    crearCita: {
      method: "POST",
      url: "http://localhost:3000/api/servicios-clientes",
      body: {
        "id_cliente": 4,
        "fecha_servicio": "2024-01-18",
        "hora_entrada": "15:00:00",
        "hora_salida": "17:00:00",
        "estado": "Confirmada",
        "motivo": "Coloración y compra de productos"
      }
    },
    // Agregar productos y servicios
    agregarDetalles: [
      {
        method: "POST",
        url: "http://localhost:3000/api/detalles-servicio",
        body: {
          "serviceClientId": 4,  // ID de la cita
          "productId": 7,        // Tinte
          "serviceId": 3,        // Coloración
          "empleadoId": 6,       // Carmen Vega
          "quantity": 1,
          "unitPrice": 240.00
        }
      },
      {
        method: "POST",
        url: "http://localhost:3000/api/detalles-servicio",
        body: {
          "serviceClientId": 4,  // Mismo ID
          "productId": 4,        // Aceite de Argán
          "quantity": 1,
          "unitPrice": 55.00
        }
      }
    ]
  }
};

// Exportar ejemplos
module.exports = {
  ejemploCrearServicioCliente,
  respuestaServicioCliente,
  ejemploAgregarProducto,
  ejemploAgregarServicio,
  ejemploAgregarProductoServicio,
  ejemploVerDetallesOrganizados,
  respuestaDetallesOrganizados,
  flujoCompleto,
  explicacionRelacion,
  ejemplosUsoReal
};

console.log("📋 Ejemplos de relación servicio_cliente ↔ detalle_servicio_cliente");
console.log("🎯 Flujo: Crear cita → Agregar productos/servicios → Ver detalles");
console.log("✅ serviceClientId es el ID de la cita a la que pertenecen los detalles");
