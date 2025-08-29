# Modelo de Clientes

## Estado Actual: DESHABILITADO

Este modelo está actualmente **deshabilitado** y no está conectado a la base de datos.

### ¿Por qué está deshabilitado?
- La tabla `clientes` fue eliminada de la base de datos
- Las rutas de clientes están deshabilitadas en `app.js`
- No hay conexión activa con la base de datos

### Configuración Actual
- `freezeTableName: true` - Evita cambios automáticos en la tabla
- `sync: false` - No sincroniza automáticamente con la base de datos
- No está importado en `app.js`
- No está registrado en las rutas

### Para Reactivar (si es necesario en el futuro):

1. **Crear la tabla en la base de datos:**
```sql
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    direccion VARCHAR(200),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

2. **Habilitar en app.js:**
```javascript
// Descomentar estas líneas:
const clientRoutes = require('./routes/clients/ClienteRoutes');
app.use('/api/clientes', clientRoutes);
```

3. **Remover las opciones de deshabilitación del modelo:**
```javascript
// Remover estas líneas del modelo:
freezeTableName: true,
sync: false
```

### Archivos Relacionados
- `src/models/clients/Client.js` - Modelo principal
- `src/controllers/clients/ClientController.js` - Controlador (deshabilitado)
- `src/services/clients/ClientService.js` - Servicio (deshabilitado)
- `src/routes/clients/ClienteRoutes.js` - Rutas (deshabilitadas)
- `src/middlewares/clients/ClientValidationMiddleware.js` - Validaciones (deshabilitadas)

---
**Nota:** Este modelo se mantiene por si es necesario reactivarlo en el futuro.
