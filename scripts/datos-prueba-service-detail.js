/**
 * DATOS DE PRUEBA PARA SERVICE DETAIL
 * 
 * Este archivo contiene ejemplos de IDs y datos para probar
 * el módulo de detalles de servicio cliente en Postman
 * 
 * CRITERIOS DE ACEPTACIÓN:
 * - Debe haber cliente asociado (serviceClientId)
 * - Debe haber al menos un servicio o producto
 * - Estados: "En ejecución", "Pagada", "Anulada"
 * - Se asignan fecha y hora automáticamente
 * - empleadoId es obligatorio SOLO cuando hay servicio
 * - Respuestas incluyen datos anidados de servicios, productos y empleados
 * - Respuestas organizadas con listas separadas de servicios y productos
 */

// ===== DATOS DE SERVICIOS CLIENTES =====
// Estos son ejemplos de IDs que podrían existir en la tabla servicios_clientes
const serviciosClientes = [
  {
    id_servicio_cliente: 1,
    id_cliente: 1,
    fecha_servicio: "2024-01-15",
    hora_entrada: "09:00:00",
    hora_salida: "11:00:00",
    estado: "Confirmada",
    total_productos: 0.00,
    total_servicios: 0.00,
    valor_total: 0.00,
    dinero_proporcionado: 0.00,
    dinero_devuelto: 0.00,
    motivo: "Corte de cabello y peinado"
  },
  {
    id_servicio_cliente: 2,
    id_cliente: 3,
    fecha_servicio: "2024-01-16",
    hora_entrada: "14:30:00",
    hora_salida: "16:30:00",
    estado: "En proceso",
    total_productos: 0.00,
    total_servicios: 0.00,
    valor_total: 0.00,
    dinero_proporcionado: 0.00,
    dinero_devuelto: 0.00,
    motivo: "Tratamiento facial completo"
  },
  {
    id_servicio_cliente: 3,
    id_cliente: 5,
    fecha_servicio: "2024-01-17",
    hora_entrada: "10:00:00",
    hora_salida: "12:00:00",
    estado: "Agendada",
    total_productos: 0.00,
    total_servicios: 0.00,
    valor_total: 0.00,
    dinero_proporcionado: 0.00,
    dinero_devuelto: 0.00,
    motivo: "Manicure y pedicure"
  },
  {
    id_servicio_cliente: 4,
    id_cliente: 2,
    fecha_servicio: "2024-01-18",
    hora_entrada: "15:00:00",
    hora_salida: "17:00:00",
    estado: "Finalizada",
    total_productos: 0.00,
    total_servicios: 0.00,
    valor_total: 0.00,
    dinero_proporcionado: 0.00,
    dinero_devuelto: 0.00,
    motivo: "Coloración y corte"
  },
  {
    id_servicio_cliente: 5,
    id_cliente: 4,
    fecha_servicio: "2024-01-19",
    hora_entrada: "11:00:00",
    hora_salida: "13:00:00",
    estado: "Pagada",
    total_productos: 0.00,
    total_servicios: 0.00,
    valor_total: 0.00,
    dinero_proporcionado: 0.00,
    dinero_devuelto: 0.00,
    motivo: "Tratamiento capilar"
  }
];

// ===== DATOS DE EMPLEADOS =====
// Estos son ejemplos de IDs que podrían existir en la tabla empleados
const empleados = [
  {
    id_empleado: 1,
    nombre: "María González",
    especialidad: "Corte y coloración",
    telefono: "3001234567",
    email: "maria.gonzalez@salon.com"
  },
  {
    id_empleado: 2,
    nombre: "Ana Rodríguez",
    especialidad: "Tratamientos faciales",
    telefono: "3002345678",
    email: "ana.rodriguez@salon.com"
  },
  {
    id_empleado: 3,
    nombre: "Carlos López",
    especialidad: "Manicure y pedicure",
    telefono: "3003456789",
    email: "carlos.lopez@salon.com"
  },
  {
    id_empleado: 4,
    nombre: "Laura Martínez",
    especialidad: "Peinados y eventos",
    telefono: "3004567890",
    email: "laura.martinez@salon.com"
  },
  {
    id_empleado: 5,
    nombre: "Pedro Sánchez",
    especialidad: "Tratamientos capilares",
    telefono: "3005678901",
    email: "pedro.sanchez@salon.com"
  },
  {
    id_empleado: 6,
    nombre: "Carmen Vega",
    especialidad: "Coloración y mechas",
    telefono: "3006789012",
    email: "carmen.vega@salon.com"
  },
  {
    id_empleado: 7,
    nombre: "Roberto Díaz",
    especialidad: "Corte masculino",
    telefono: "3007890123",
    email: "roberto.diaz@salon.com"
  },
  {
    id_empleado: 8,
    nombre: "Sofia Herrera",
    especialidad: "Tratamientos corporales",
    telefono: "3008901234",
    email: "sofia.herrera@salon.com"
  }
];

// ===== DATOS DE PRODUCTOS =====
// Estos son ejemplos de IDs que podrían existir en la tabla productos
const productos = [
  {
    id_producto: 1,
    nombre: "Shampoo Profesional",
    precio: 45.00,
    descripcion: "Shampoo para todo tipo de cabello"
  },
  {
    id_producto: 2,
    nombre: "Acondicionador Nutritivo",
    precio: 38.00,
    descripcion: "Acondicionador con vitaminas"
  },
  {
    id_producto: 3,
    nombre: "Mascarilla Capilar",
    precio: 65.00,
    descripcion: "Mascarilla reparadora intensiva"
  },
  {
    id_producto: 4,
    nombre: "Aceite de Argán",
    precio: 55.00,
    descripcion: "Aceite natural para el cabello"
  },
  {
    id_producto: 5,
    nombre: "Gel Fijador",
    precio: 25.00,
    descripcion: "Gel de fijación media"
  },
  {
    id_producto: 6,
    nombre: "Laca para Cabello",
    precio: 30.00,
    descripcion: "Laca de fijación fuerte"
  },
  {
    id_producto: 7,
    nombre: "Tinte Profesional",
    precio: 120.00,
    descripcion: "Tinte de color permanente"
  },
  {
    id_producto: 8,
    nombre: "Decolorante",
    precio: 85.00,
    descripcion: "Decolorante profesional"
  }
];

// ===== DATOS DE SERVICIOS =====
// Estos son ejemplos de IDs que podrían existir en la tabla servicios
const servicios = [
  {
    id_servicio: 1,
    nombre: "Corte de Cabello",
    precio: 35.00,
    descripcion: "Corte básico de cabello"
  },
  {
    id_servicio: 2,
    nombre: "Peinado",
    precio: 45.00,
    descripcion: "Peinado para ocasiones especiales"
  },
  {
    id_servicio: 3,
    nombre: "Coloración",
    precio: 120.00,
    descripcion: "Coloración completa del cabello"
  },
  {
    id_servicio: 4,
    nombre: "Mechas",
    precio: 150.00,
    descripcion: "Aplicación de mechas"
  },
  {
    id_servicio: 5,
    nombre: "Tratamiento Capilar",
    precio: 80.00,
    descripcion: "Tratamiento reparador"
  },
  {
    id_servicio: 6,
    nombre: "Manicure",
    precio: 25.00,
    descripcion: "Manicure básico"
  },
  {
    id_servicio: 7,
    nombre: "Pedicure",
    precio: 30.00,
    descripcion: "Pedicure básico"
  },
  {
    id_servicio: 8,
    nombre: "Tratamiento Facial",
    precio: 90.00,
    descripcion: "Tratamiento facial completo"
  }
];

// ===== EJEMPLOS DE RESPUESTAS ORGANIZADAS EN POSTMAN =====

const ejemplosRespuestasOrganizadas = {
  
  // Ejemplo 1: Respuesta GET - Detalles organizados por servicio cliente
  respuestaOrganizadaCompleta: {
    "success": true,
    "data": {
      "serviceClientId": 1,
      "resumen": {
        "totalDetalles": 4,
        "totalServicios": 2,
        "totalProductos": 2,
        "subtotalServicios": "155.00",
        "subtotalProductos": "166.00",
        "totalGeneral": "321.00"
      },
      "servicios": [
        {
          "id": 2,
          "serviceId": 1,
          "nombre": "Corte de Cabello",
          "descripcion": "Corte básico de cabello",
          "precioOriginal": "35.00",
          "empleadoId": 1,
          "empleado": {
            "id": 1,
            "nombre": "María González",
            "especialidad": "Corte y coloración",
            "telefono": "3001234567",
            "email": "maria.gonzalez@salon.com"
          },
          "cantidad": 1,
          "precioUnitario": "35.00",
          "subtotal": "35.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-15T09:00:00.000Z",
          "fechaActualizacion": "2024-01-15T09:00:00.000Z"
        },
        {
          "id": 4,
          "serviceId": 5,
          "nombre": "Tratamiento Capilar",
          "descripcion": "Tratamiento reparador",
          "precioOriginal": "80.00",
          "empleadoId": 5,
          "empleado": {
            "id": 5,
            "nombre": "Pedro Sánchez",
            "especialidad": "Tratamientos capilares",
            "telefono": "3005678901",
            "email": "pedro.sanchez@salon.com"
          },
          "cantidad": 1,
          "precioUnitario": "120.00",
          "subtotal": "120.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-15T10:00:00.000Z",
          "fechaActualizacion": "2024-01-15T10:00:00.000Z"
        }
      ],
      "productos": [
        {
          "id": 1,
          "productId": 1,
          "nombre": "Shampoo Profesional",
          "descripcion": "Shampoo para todo tipo de cabello",
          "precioOriginal": "45.00",
          "cantidad": 2,
          "precioUnitario": "45.00",
          "subtotal": "90.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-15T09:00:00.000Z",
          "fechaActualizacion": "2024-01-15T09:00:00.000Z"
        },
        {
          "id": 3,
          "productId": 3,
          "nombre": "Mascarilla Capilar",
          "descripcion": "Mascarilla reparadora intensiva",
          "precioOriginal": "65.00",
          "cantidad": 1,
          "precioUnitario": "76.00",
          "subtotal": "76.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-15T09:30:00.000Z",
          "fechaActualizacion": "2024-01-15T09:30:00.000Z"
        }
      ]
    },
    "message": "Detalles organizados obtenidos exitosamente"
  },

  // Ejemplo 2: Respuesta GET - Solo servicios
  respuestaSoloServicios: {
    "success": true,
    "data": {
      "serviceClientId": 2,
      "resumen": {
        "totalDetalles": 2,
        "totalServicios": 2,
        "totalProductos": 0,
        "subtotalServicios": "80.00",
        "subtotalProductos": "0.00",
        "totalGeneral": "80.00"
      },
      "servicios": [
        {
          "id": 5,
          "serviceId": 6,
          "nombre": "Manicure",
          "descripcion": "Manicure básico",
          "precioOriginal": "25.00",
          "empleadoId": 3,
          "empleado": {
            "id": 3,
            "nombre": "Carlos López",
            "especialidad": "Manicure y pedicure",
            "telefono": "3003456789",
            "email": "carlos.lopez@salon.com"
          },
          "cantidad": 1,
          "precioUnitario": "25.00",
          "subtotal": "25.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-16T14:30:00.000Z",
          "fechaActualizacion": "2024-01-16T14:30:00.000Z"
        },
        {
          "id": 6,
          "serviceId": 7,
          "nombre": "Pedicure",
          "descripcion": "Pedicure básico",
          "precioOriginal": "30.00",
          "empleadoId": 3,
          "empleado": {
            "id": 3,
            "nombre": "Carlos López",
            "especialidad": "Manicure y pedicure",
            "telefono": "3003456789",
            "email": "carlos.lopez@salon.com"
          },
          "cantidad": 1,
          "precioUnitario": "55.00",
          "subtotal": "55.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-16T15:00:00.000Z",
          "fechaActualizacion": "2024-01-16T15:00:00.000Z"
        }
      ],
      "productos": []
    },
    "message": "Detalles organizados obtenidos exitosamente"
  },

  // Ejemplo 3: Respuesta GET - Solo productos
  respuestaSoloProductos: {
    "success": true,
    "data": {
      "serviceClientId": 3,
      "resumen": {
        "totalDetalles": 3,
        "totalServicios": 0,
        "totalProductos": 3,
        "subtotalServicios": "0.00",
        "subtotalProductos": "248.00",
        "totalGeneral": "248.00"
      },
      "servicios": [],
      "productos": [
        {
          "id": 7,
          "productId": 7,
          "nombre": "Tinte Profesional",
          "descripcion": "Tinte de color permanente",
          "precioOriginal": "120.00",
          "cantidad": 1,
          "precioUnitario": "120.00",
          "subtotal": "120.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-17T10:00:00.000Z",
          "fechaActualizacion": "2024-01-17T10:00:00.000Z"
        },
        {
          "id": 8,
          "productId": 8,
          "nombre": "Decolorante",
          "descripcion": "Decolorante profesional",
          "precioOriginal": "85.00",
          "cantidad": 1,
          "precioUnitario": "85.00",
          "subtotal": "85.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-17T10:15:00.000Z",
          "fechaActualizacion": "2024-01-17T10:15:00.000Z"
        },
        {
          "id": 9,
          "productId": 4,
          "nombre": "Aceite de Argán",
          "descripcion": "Aceite natural para el cabello",
          "precioOriginal": "55.00",
          "cantidad": 1,
          "precioUnitario": "43.00",
          "subtotal": "43.00",
          "estado": "En ejecución",
          "fechaCreacion": "2024-01-17T10:30:00.000Z",
          "fechaActualizacion": "2024-01-17T10:30:00.000Z"
        }
      ]
    },
    "message": "Detalles organizados obtenidos exitosamente"
  },

  // Ejemplo 4: Respuesta GET - Servicio cliente vacío
  respuestaServicioClienteVacio: {
    "success": false,
    "message": "No se encontraron detalles para el servicio cliente especificado"
  }
};

// ===== EJEMPLOS DE RESPUESTAS ANIDADAS EN POSTMAN =====

const ejemplosRespuestasPostman = {
  
  // Ejemplo 1: Respuesta POST - Solo Producto
  respuestaSoloProducto: {
    "success": true,
    "data": {
      "id": 1,
      "serviceClientId": 1,
      "productId": 1,
      "serviceId": null,
      "empleadoId": null,
      "quantity": 2,
      "unitPrice": "45.00",
      "subtotal": "90.00",
      "status": "En ejecución",
      "producto": {
        "id": 1,
        "nombre": "Shampoo Profesional",
        "precio": "45.00",
        "descripcion": "Shampoo para todo tipo de cabello"
      },
      "servicio": null,
      "empleado": null
    },
    "message": "Orden de servicio creada exitosamente"
  },

  // Ejemplo 2: Respuesta POST - Solo Servicio
  respuestaSoloServicio: {
    "success": true,
    "data": {
      "id": 2,
      "serviceClientId": 1,
      "productId": null,
      "serviceId": 1,
      "empleadoId": 1,
      "quantity": 1,
      "unitPrice": "35.00",
      "subtotal": "35.00",
      "status": "En ejecución",
      "producto": null,
      "servicio": {
        "id": 1,
        "nombre": "Corte de Cabello",
        "precio": "35.00",
        "descripcion": "Corte básico de cabello"
      },
      "empleado": {
        "id": 1,
        "nombre": "María González",
        "especialidad": "Corte y coloración",
        "telefono": "3001234567",
        "email": "maria.gonzalez@salon.com"
      }
    },
    "message": "Orden de servicio creada exitosamente"
  },

  // Ejemplo 3: Respuesta POST - Producto + Servicio
  respuestaProductoServicio: {
    "success": true,
    "data": {
      "id": 3,
      "serviceClientId": 2,
      "productId": 7,
      "serviceId": 3,
      "empleadoId": 6,
      "quantity": 1,
      "unitPrice": "240.00",
      "subtotal": "240.00",
      "status": "En ejecución",
      "producto": {
        "id": 7,
        "nombre": "Tinte Profesional",
        "precio": "120.00",
        "descripcion": "Tinte de color permanente"
      },
      "servicio": {
        "id": 3,
        "nombre": "Coloración",
        "precio": "120.00",
        "descripcion": "Coloración completa del cabello"
      },
      "empleado": {
        "id": 6,
        "nombre": "Carmen Vega",
        "especialidad": "Coloración y mechas",
        "telefono": "3006789012",
        "email": "carmen.vega@salon.com"
      }
    },
    "message": "Orden de servicio creada exitosamente"
  }
};

// ===== EJEMPLOS DE PETICIONES POSTMAN =====

const ejemplosPostman = {
  
  // 1. Crear detalle con SOLO producto (empleadoId NO requerido)
  crearDetalleProducto: {
    method: "POST",
    url: "http://localhost:3000/api/detalles-servicio",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer <tu_token_jwt>"
    },
    body: {
      "serviceClientId": 1,
      "productId": 1,
      "quantity": 2,
      "unitPrice": 45.00
      // empleadoId: NO requerido para productos
    }
  },

  // 2. Crear detalle con SOLO servicio (empleadoId SÍ requerido)
  crearDetalleServicio: {
    method: "POST",
    url: "http://localhost:3000/api/detalles-servicio",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer <tu_token_jwt>"
    },
    body: {
      "serviceClientId": 2,
      "serviceId": 5,
      "empleadoId": 5,       // SÍ requerido para servicios
      "quantity": 1,
      "unitPrice": 80.00
    }
  },

  // 3. Crear detalle con producto y servicio (empleadoId SÍ requerido)
  crearDetalleCompleto: {
    method: "POST",
    url: "http://localhost:3000/api/detalles-servicio",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer <tu_token_jwt>"
    },
    body: {
      "serviceClientId": 3,
      "productId": 7,
      "serviceId": 3,
      "empleadoId": 6,       // SÍ requerido porque hay servicio
      "quantity": 1,
      "unitPrice": 240.00
    }
  },

  // 4. Obtener detalles organizados por servicio cliente
  obtenerDetallesOrganizados: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/service-client/1/organized",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 5. Obtener detalles por servicio cliente (formato original)
  obtenerDetallesPorServicioCliente: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/service-client/1",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 6. Actualizar detalle
  actualizarDetalle: {
    method: "PUT",
    url: "http://localhost:3000/api/detalles-servicio/1",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer <tu_token_jwt>"
    },
    body: {
      "quantity": 3,
      "unitPrice": 50.00,
      "status": "Pagada"
    }
  },

  // 7. Cambiar estado
  cambiarEstado: {
    method: "PATCH",
    url: "http://localhost:3000/api/detalles-servicio/1/status",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer <tu_token_jwt>"
    },
    body: {
      "estado": "Pagada"
    }
  },

  // 8. Obtener detalles por producto
  obtenerPorProducto: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/product/1",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 9. Obtener detalles por servicio
  obtenerPorServicio: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/service/1",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 10. Obtener detalles por empleado
  obtenerPorEmpleado: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/employee/1",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 11. Obtener detalles por estado
  obtenerPorEstado: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/status/En%20ejecuci%C3%B3n",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 12. Calcular subtotal
  calcularSubtotal: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/1/subtotal",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  },

  // 13. Obtener estadísticas
  obtenerEstadisticas: {
    method: "GET",
    url: "http://localhost:3000/api/detalles-servicio/statistics/overview",
    headers: {
      "Authorization": "Bearer <tu_token_jwt>"
    }
  }
};

// ===== DATOS DE PRUEBA PARA DIFERENTES ESCENARIOS =====

const escenariosPrueba = {
  
  // Escenario 1: Solo productos (empleadoId NO requerido)
  soloProductos: [
    {
      serviceClientId: 1,
      productId: 1,      // Shampoo
      serviceId: null,
      empleadoId: null,  // NO requerido
      quantity: 1,
      unitPrice: 45.00,
      status: "En ejecución"
    },
    {
      serviceClientId: 1,
      productId: 2,      // Acondicionador
      serviceId: null,
      empleadoId: null,  // NO requerido
      quantity: 1,
      unitPrice: 38.00,
      status: "En ejecución"
    }
  ],

  // Escenario 2: Solo servicios (empleadoId SÍ requerido)
  soloServicios: [
    {
      serviceClientId: 2,
      productId: null,
      serviceId: 1,      // Corte de cabello
      empleadoId: 1,     // SÍ requerido
      quantity: 1,
      unitPrice: 35.00,
      status: "En ejecución"
    },
    {
      serviceClientId: 2,
      productId: null,
      serviceId: 2,      // Peinado
      empleadoId: 4,     // SÍ requerido
      quantity: 1,
      unitPrice: 45.00,
      status: "En ejecución"
    }
  ],

  // Escenario 3: Productos y servicios (empleadoId SÍ requerido)
  productosYServicios: [
    {
      serviceClientId: 3,
      productId: 7,      // Tinte
      serviceId: 3,      // Coloración
      empleadoId: 6,     // SÍ requerido porque hay servicio
      quantity: 1,
      unitPrice: 240.00,
      status: "En ejecución"
    },
    {
      serviceClientId: 3,
      productId: 8,      // Decolorante
      serviceId: null,
      empleadoId: null,  // NO requerido porque solo es producto
      quantity: 1,
      unitPrice: 85.00,
      status: "En ejecución"
    }
  ],

  // Escenario 4: Tratamiento facial
  tratamientoFacial: [
    {
      serviceClientId: 4,
      productId: null,
      serviceId: 8,      // Tratamiento Facial
      empleadoId: 2,     // SÍ requerido
      quantity: 1,
      unitPrice: 90.00,
      status: "En ejecución"
    }
  ],

  // Escenario 5: Corte masculino con producto
  corteMasculino: [
    {
      serviceClientId: 5,
      productId: 5,      // Gel Fijador
      serviceId: 1,      // Corte de Cabello
      empleadoId: 7,     // SÍ requerido porque hay servicio
      quantity: 1,
      unitPrice: 60.00,  // 25 + 35
      status: "En ejecución"
    }
  ]
};

// ===== EJEMPLOS DE USO POR ESPECIALIDAD =====

const ejemplosPorEspecialidad = {
  
  // María González - Corte y coloración
  mariaGonzalez: {
    empleadoId: 1,
    especialidad: "Corte y coloración",
    serviciosRecomendados: [
      {
        serviceClientId: 1,
        productId: 1,      // Shampoo
        serviceId: 1,      // Corte
        empleadoId: 1,     // SÍ requerido
        quantity: 1,
        unitPrice: 80.00,  // 45 + 35
        status: "En ejecución"
      },
      {
        serviceClientId: 2,
        productId: 7,      // Tinte
        serviceId: 3,      // Coloración
        empleadoId: 1,     // SÍ requerido
        quantity: 1,
        unitPrice: 240.00, // 120 + 120
        status: "En ejecución"
      }
    ]
  },

  // Ana Rodríguez - Tratamientos faciales
  anaRodriguez: {
    empleadoId: 2,
    especialidad: "Tratamientos faciales",
    serviciosRecomendados: [
      {
        serviceClientId: 3,
        productId: null,
        serviceId: 8,      // Tratamiento Facial
        empleadoId: 2,     // SÍ requerido
        quantity: 1,
        unitPrice: 90.00,
        status: "En ejecución"
      }
    ]
  },

  // Carlos López - Manicure y pedicure
  carlosLopez: {
    empleadoId: 3,
    especialidad: "Manicure y pedicure",
    serviciosRecomendados: [
      {
        serviceClientId: 4,
        productId: null,
        serviceId: 6,      // Manicure
        empleadoId: 3,     // SÍ requerido
        quantity: 1,
        unitPrice: 25.00,
        status: "En ejecución"
      },
      {
        serviceClientId: 4,
        productId: null,
        serviceId: 7,      // Pedicure
        empleadoId: 3,     // SÍ requerido
        quantity: 1,
        unitPrice: 30.00,
        status: "En ejecución"
      }
    ]
  }
};

// ===== INFORMACIÓN ADICIONAL =====

const informacionAdicional = {
  
  // Estados válidos para detalles de servicio
  estadosValidos: [
    "En ejecución",
    "Pagada",
    "Anulada"
  ],

  // Estados válidos para servicios cliente
  estadosServicioCliente: [
    "Agendada",
    "Confirmada", 
    "Reprogramada",
    "En proceso",
    "Finalizada",
    "Pagada",
    "Cancelada por el cliente",
    "No asistio"
  ],

  // Campos requeridos según criterios de aceptación
  camposRequeridos: [
    "serviceClientId - Cliente asociado (OBLIGATORIO)",
    "productId o serviceId - Al menos uno debe estar presente",
    "empleadoId - Empleado asociado al servicio (OBLIGATORIO SOLO si hay servicio)",
    "quantity - Cantidad del producto/servicio",
    "unitPrice - Precio unitario"
  ],

  // Campos automáticos
  camposAutomaticos: [
    "subtotal - Se calcula automáticamente (unitPrice * quantity)",
    "status - Por defecto 'En ejecución'"
  ],

  // Reglas de empleadoId
  reglasEmpleadoId: [
    "empleadoId es OBLIGATORIO cuando hay serviceId (servicio)",
    "empleadoId es OPCIONAL cuando solo hay productId (producto)",
    "empleadoId se asigna automáticamente como null para productos",
    "empleadoId debe existir en la tabla empleados si se proporciona"
  ],

  // Datos anidados en respuestas
  datosAnidados: [
    "producto - Datos completos del producto (id, nombre, precio, descripcion)",
    "servicio - Datos completos del servicio (id, nombre, precio, descripcion)",
    "empleado - Datos completos del empleado (id, nombre, especialidad, telefono, email)",
    "Los datos anidados aparecen en todas las respuestas GET y POST"
  ],

  // Nuevas rutas organizadas
  rutasOrganizadas: [
    "GET /api/detalles-servicio/service-client/:id - Detalles originales",
    "GET /api/detalles-servicio/service-client/:id/organized - Detalles organizados",
    "Las respuestas organizadas incluyen resumen y listas separadas de servicios y productos"
  ],

  // Estructura de respuesta organizada
  estructuraRespuestaOrganizada: [
    "serviceClientId - ID del servicio cliente",
    "resumen - Resumen con totales y conteos",
    "servicios - Array con todos los servicios del cliente",
    "productos - Array con todos los productos del cliente",
    "Cada servicio incluye: id, serviceId, nombre, descripcion, precioOriginal, empleadoId, empleado, cantidad, precioUnitario, subtotal, estado, fechas",
    "Cada producto incluye: id, productId, nombre, descripcion, precioOriginal, cantidad, precioUnitario, subtotal, estado, fechas"
  ],

  // Empleados disponibles
  empleadosDisponibles: [
    "ID 1 - María González (Corte y coloración)",
    "ID 2 - Ana Rodríguez (Tratamientos faciales)",
    "ID 3 - Carlos López (Manicure y pedicure)",
    "ID 4 - Laura Martínez (Peinados y eventos)",
    "ID 5 - Pedro Sánchez (Tratamientos capilares)",
    "ID 6 - Carmen Vega (Coloración y mechas)",
    "ID 7 - Roberto Díaz (Corte masculino)",
    "ID 8 - Sofia Herrera (Tratamientos corporales)"
  ],

  // Notas importantes
  notas: [
    "El sistema NO permite crear venta sin cliente asociado",
    "El sistema NO permite crear venta sin al menos un servicio o producto",
    "El empleadoId es OBLIGATORIO SOLO cuando hay servicio",
    "Para productos solos, empleadoId es OPCIONAL",
    "Los IDs de serviceClientId deben existir en la tabla servicios_clientes",
    "Los IDs de productId deben existir en la tabla productos",
    "Los IDs de serviceId deben existir en la tabla servicios",
    "Los IDs de empleadoId deben existir en la tabla empleados (si se proporciona)",
    "Todos los endpoints requieren autenticación JWT",
    "Todas las respuestas incluyen datos anidados de productos, servicios y empleados",
    "Las respuestas organizadas facilitan la visualización de servicios y productos por separado"
  ]
};

// Exportar todos los datos para uso en pruebas
module.exports = {
  serviciosClientes,
  empleados,
  productos,
  servicios,
  ejemplosRespuestasOrganizadas,
  ejemplosRespuestasPostman,
  ejemplosPostman,
  escenariosPrueba,
  ejemplosPorEspecialidad,
  informacionAdicional
};

console.log("📋 Datos de prueba cargados correctamente");
console.log("🎯 Usa estos datos para probar el módulo ServiceDetail en Postman");
console.log("📝 Recuerda reemplazar <tu_token_jwt> con un token válido");
console.log("✅ Validaciones implementadas según criterios de aceptación");
console.log("👥 Campo empleadoId opcional para productos, obligatorio para servicios");
console.log("🔗 Respuestas incluyen datos anidados de productos, servicios y empleados");
console.log("📊 Nuevas respuestas organizadas con listas separadas de servicios y productos");
console.log("🚫 Estados válidos: En ejecución, Pagada, Anulada");
