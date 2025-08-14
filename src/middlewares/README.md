 # Middlewares de la API CAPEX

Este directorio contiene todos los middlewares necesarios para la API, diseñados para ser reutilizables y fáciles de implementar por otros desarrolladores.

## 📁 Estructura de Archivos

```
middlewares/
├── ErrorMiddleware.js          # Manejo global de errores
├── ValidationMiddleware.js     # Validación de datos de entrada
├── ResponseMiddleware.js       # Estandarización de respuestas
├── SecurityMiddleware.js       # Protecciones de seguridad
├── index.js                   # Archivo índice con exports
└── README.md                  # Esta documentación
```

## 🚀 Uso Rápido

### Importar todos los middlewares

```javascript
const { 
  ErrorMiddleware, 
  ValidationMiddleware, 
  ResponseMiddleware,
  commonMiddleware,
  configureMiddleware 
} = require('./middlewares');
```

### Usar middlewares preconfigurados

```javascript
// Middleware básico para todas las rutas
app.use(commonMiddleware.basic);

// Middleware completo para rutas públicas
app.use('/api/public', commonMiddleware.public);

// Middleware para rutas que requieren validación
app.use('/api/secure', commonMiddleware.withValidation);
```

## 🔧 Middlewares Individuales

### 1. ErrorMiddleware

Maneja todos los errores de la API de manera consistente.

```javascript
// Aplicar globalmente
app.use(ErrorMiddleware.handleValidationError);
app.use(ErrorMiddleware.handleDatabaseError);
app.use(ErrorMiddleware.handleGeneralError);

// Para rutas específicas
app.use('/api/users', ErrorMiddleware.handleValidationError);
```

**Métodos disponibles:**
- `handleValidationError` - Errores de validación
- `handleDatabaseError` - Errores de base de datos
- `handleJsonError` - Errores de sintaxis JSON
- `handleNotFound` - Rutas no encontradas (404)
- `handleGeneralError` - Errores generales
- `handleTimeout` - Timeouts de requests

### 2. ValidationMiddleware

Valida datos de entrada usando express-validator.

```javascript
const { body } = require('express-validator');

// Crear reglas de validación
const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  ValidationMiddleware.validate
];

// Aplicar a ruta
app.post('/api/users', userValidation, userController.create);
```

**Métodos disponibles:**
- `validate` - Valida resultados de express-validator
- `validateId` - Valida IDs numéricos
- `validatePagination` - Valida parámetros de paginación
- `validateRequiredFields` - Valida campos requeridos
- `validateFileType` - Valida tipos de archivo
- `validateFileSize` - Valida tamaño de archivo

### 3. ResponseMiddleware

Estandariza todas las respuestas de la API.

```javascript
// Aplicar globalmente
app.use(ResponseMiddleware.standardizeResponse);

// Usar en controladores
app.get('/api/users', (req, res) => {
  res.success(users, 'Usuarios obtenidos exitosamente');
  res.created(newUser, 'Usuario creado exitosamente');
  res.updated(updatedUser, 'Usuario actualizado exitosamente');
  res.deleted('Usuario eliminado exitosamente');
  res.paginated(users, page, limit, total, 'Lista paginada');
});
```

**Métodos disponibles:**
- `res.success()` - Respuesta exitosa
- `res.created()` - Recurso creado (201)
- `res.updated()` - Recurso actualizado
- `res.deleted()` - Recurso eliminado
- `res.paginated()` - Lista paginada
- `res.error()` - Respuesta de error
- `res.validationError()` - Error de validación
- `res.unauthorized()` - No autorizado (401)
- `res.forbidden()` - Acceso prohibido (403)
- `res.notFound()` - No encontrado (404)
- `res.conflict()` - Conflicto (409)
- `res.internalError()` - Error interno (500)

### 4. SecurityMiddleware

Implementa protecciones de seguridad básicas.

```javascript
// Aplicar globalmente
app.use(SecurityMiddleware.preventContentInjection);
app.use(SecurityMiddleware.sanitizeQueryParams);
app.use(SecurityMiddleware.sanitizeUrlParams);

// Para rutas específicas
app.use('/api/admin', SecurityMiddleware.addSecurityHeaders);
app.use('/api/upload', SecurityMiddleware.validatePayloadSize(5 * 1024 * 1024)); // 5MB
```

**Métodos disponibles:**
- `preventContentInjection` - Previene inyección de scripts
- `sanitizeQueryParams` - Sanitiza parámetros de query
- `sanitizeUrlParams` - Sanitiza parámetros de URL
- `preventEnumeration` - Previene ataques de enumeración
- `validatePayloadSize` - Valida tamaño de payload
- `preventBruteForce` - Previene ataques de fuerza bruta
- `addSecurityHeaders` - Agrega headers de seguridad



## 🎯 Configuraciones Predefinidas

### commonMiddleware.basic
Middleware básico para todas las rutas:
- Respuestas estandarizadas
- Headers estándar
- Prevención de inyección de contenido
- Sanitización de parámetros

### commonMiddleware.public
Middleware completo para rutas públicas:
- Todo lo de basic
- Headers de seguridad

### commonMiddleware.withValidation
Middleware para rutas que requieren validación:
- Todo lo de basic
- Validación de payload

### commonMiddleware.security
Middleware de seguridad para rutas sensibles:
- Headers de seguridad
- Validación de tamaño de payload
- Prevención de fuerza bruta

## ⚙️ Configuración Personalizada

```javascript
// Validación personalizada
const customValidation = configureMiddleware.validation([
  body('email').isEmail(),
  body('name').isLength({ min: 2 })
]);

// Seguridad personalizada
const customSecurity = configureMiddleware.security({
  maxPayload: 2 * 1024 * 1024, // 2MB
  bruteForce: {
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000
  }
});
```

## 🔍 Ejemplos de Uso

### Ruta básica con validación

```javascript
const { body } = require('express-validator');

app.post('/api/users', [
  ...commonMiddleware.withValidation,
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], userController.create);
```



## 📝 Notas Importantes

1. **Orden de los middlewares**: Los middlewares de error deben ir al final
2. **Validación**: Siempre usar después de parsear el body
3. **Seguridad**: Aplicar lo más temprano posible en el pipeline

## 🚨 Troubleshooting

### Error: "res.success is not a function"
- Asegúrate de haber aplicado `ResponseMiddleware.standardizeResponse`

### Error: "Validation failed"
- Verifica que estés usando `ValidationMiddleware.validate` después de las reglas de express-validator



## 🔮 Futuras Implementaciones

- **Autenticación**: Middleware de JWT y sesiones
- **Autorización**: Control de acceso basado en roles
- **Logging**: Sistema de logging estructurado
- **Rate Limiting**: Limitación de velocidad para prevenir abuso
- **Cache**: Sistema de cache para mejorar rendimiento
- **Compresión**: Compresión de respuestas para optimizar ancho de banda
- **Métricas**: Integración con sistemas de monitoreo

## 📞 Soporte

Para dudas sobre el uso de estos middlewares, consulta:
1. Esta documentación
2. Los comentarios en el código
3. Los ejemplos de uso
4. El equipo de desarrollo
