# 🧪 Guía Visual: Configurar Postman para CAPEX Auth

## 📋 Paso 1: Crear Environment

### 1.1 Abrir Postman
- Abre Postman
- Ve a la esquina superior derecha donde dice "No Environment"

### 1.2 Crear Environment
```
1. Haz clic en "No Environment"
2. Haz clic en "Add" o el botón "+"
3. Llena los campos:
   - Name: CAPEX Local
   - Variable: base_url
   - Initial Value: http://localhost:3000
   - Current Value: http://localhost:3000
4. Haz clic en "Add" para agregar otra variable
5. Variable: token
6. Initial Value: (déjalo vacío)
7. Current Value: (déjalo vacío)
8. Haz clic en "Save"
```

### 1.3 Seleccionar Environment
- En la esquina superior derecha, selecciona "CAPEX Local"

## 🚀 Paso 2: Probar Registro

### 2.1 Crear Request
```
1. Haz clic en "+" para nueva request
2. Método: POST
3. URL: {{base_url}}/api/auth/register
4. Headers: Content-Type: application/json
5. Body: raw (JSON)
```

### 2.2 JSON para Registro
```json
{
  "nombre": "Juan Pérez",
  "tipo_documento": "Cedula de ciudadania",
  "documento": "1234567890",
  "telefono": "+573001234567",
  "correo": "juan.perez@email.com",
  "contrasena": "Password123!"
}
```

### 2.3 Enviar Request
- Haz clic en "Send"
- Deberías recibir Status 201 y un JSON con los datos del usuario

## 🔑 Paso 3: Probar Login (IMPORTANTE)

### 3.1 Crear Request de Login
```
1. Nueva request
2. Método: POST
3. URL: {{base_url}}/api/auth/login
4. Headers: Content-Type: application/json
5. Body: raw (JSON)
```

### 3.2 JSON para Login
```json
{
  "correo": "juan.perez@email.com",
  "contrasena": "Password123!"
}
```

### 3.3 Configurar Test Script (AUTOMÁTICO)
En la pestaña "Tests", pega este código:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        pm.environment.set('token', response.data.token);
        console.log('✅ Token guardado automáticamente');
    }
}
```

### 3.4 Enviar Login
- Haz clic en "Send"
- El token se guardará automáticamente en la variable `{{token}}`
- Verifica en la consola de Postman que aparezca "Token guardado automáticamente"

## 🔍 Paso 4: Verificar Token

### 4.1 Crear Request de Verificación
```
1. Nueva request
2. Método: POST
3. URL: {{base_url}}/api/auth/verify
4. Headers: Content-Type: application/json
5. Body: raw (JSON)
```

### 4.2 JSON para Verificar
```json
{
  "token": "{{token}}"
}
```

### 4.3 Enviar Verificación
- Haz clic en "Send"
- Deberías recibir Status 200 con los datos del token

## 👤 Paso 5: Obtener Usuario Actual

### 5.1 Crear Request Protegido
```
1. Nueva request
2. Método: GET
3. URL: {{base_url}}/api/auth/me
4. Headers: Authorization: Bearer {{token}}
```

### 5.2 Enviar Request
- Haz clic en "Send"
- Deberías recibir Status 200 con los datos del usuario

## 🚪 Paso 6: Logout

### 6.1 Crear Request de Logout
```
1. Nueva request
2. Método: POST
3. URL: {{base_url}}/api/auth/logout
4. Headers: Authorization: Bearer {{token}}
```

### 6.2 Enviar Logout
- Haz clic en "Send"
- Deberías recibir Status 200

## 🔧 Verificar Variables

### Verificar que el Token se Guardó
```
1. Ve a la esquina superior derecha
2. Haz clic en "CAPEX Local"
3. Deberías ver:
   - base_url: http://localhost:3000
   - token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (un string largo)
```

## ❌ Pruebas de Error

### Prueba 1: Acceso Sin Token
```
1. Nueva request GET
2. URL: {{base_url}}/api/auth/me
3. NO agregues header Authorization
4. Deberías recibir Status 401
```

### Prueba 2: Credenciales Incorrectas
```
1. Nueva request POST
2. URL: {{base_url}}/api/auth/login
3. Body: {"correo": "juan.perez@email.com", "contrasena": "Incorrecta123!"}
4. Deberías recibir Status 401
```

## 🎯 Resumen del Flujo

```
1. Registro → Status 201 (usuario creado)
2. Login → Status 200 (token generado y guardado automáticamente)
3. Verificar Token → Status 200 (token válido)
4. Obtener Usuario → Status 200 (datos del usuario)
5. Logout → Status 200 (sesión cerrada)
```

## 🔍 Debugging

### Si el Token no se Guarda
1. Verifica que el script de test esté en la pestaña "Tests"
2. Verifica que el login devuelva Status 200
3. Abre la consola de Postman (View → Show Postman Console)
4. Deberías ver "Token guardado automáticamente"

### Si las Variables no Funcionan
1. Verifica que "CAPEX Local" esté seleccionado
2. Verifica que las variables estén escritas como `{{variable}}`
3. Verifica que no haya espacios extra

### Si el Servidor no Responde
1. Verifica que `npm run dev` esté corriendo
2. Verifica que el puerto sea 3000
3. Verifica que la base de datos esté conectada
