# 🚀 Guía Completa para Pruebas en Postman

## 📋 Preparación Inicial

### 1. Descargar e Instalar Postman
- Ve a https://www.postman.com/downloads/
- Descarga la versión para tu sistema operativo
- Instala y crea una cuenta (opcional)

### 2. Iniciar tu Servidor NestJS
```bash
cd "c:\Users\pino2\OneDrive\Escritorio\proyecto login sena"
npm install
npm run start:dev
```
- Verifica que veas: "🚀 Servidor iniciado en http://localhost:3001"

## 🎯 Configuración en Postman

### 1. Crear una Nueva Colección
1. Abre Postman
2. Clic en "Collections" en la barra lateral
3. Clic en "Create Collection"
4. Nombra la colección: "SENA Auth Service"
5. Agregar descripción: "Pruebas del servicio de autenticación"

### 2. Configurar Variables de Entorno
1. Clic en el ícono de "Environments" (🌍)
2. Clic en "Create Environment"
3. Nombre: "SENA Local"
4. Agregar variables:
   - Variable: `baseUrl` | Valor: `http://localhost:3001`
   - Variable: `token` | Valor: (dejar vacío)

## 🧪 Pruebas Paso a Paso

### PASO 1: Verificar Conectividad

#### 1.1 Ping Test
- **Método**: GET
- **URL**: `{{baseUrl}}/auth/ping`
- **Resultado esperado**: Status 200, mensaje "pong"

#### 1.2 Estado del Sistema
- **Método**: GET  
- **URL**: `{{baseUrl}}/auth/status`
- **Resultado esperado**: Status 200, servicio "activo"

#### 1.3 Guía de Pruebas
- **Método**: GET
- **URL**: `{{baseUrl}}/auth/test-guide`
- **Resultado esperado**: Lista de todos los endpoints disponibles

### PASO 2: Verificar Base de Datos

#### 2.1 Estado de Base de Datos
- **Método**: GET
- **URL**: `{{baseUrl}}/auth/database/status`
- **Resultado esperado**: Status "CONECTADO", connected: true

#### 2.2 Health Check Completo
- **Método**: GET
- **URL**: `{{baseUrl}}/auth/health`
- **Resultado esperado**: Status "SALUDABLE", todos los servicios activos

#### 2.3 Estadísticas del Sistema
- **Método**: GET
- **URL**: `{{baseUrl}}/auth/stats`
- **Resultado esperado**: Estadísticas detalladas del sistema

### PASO 3: Pruebas de Registro

#### 3.1 Registro Exitoso
- **Método**: POST
- **URL**: `{{baseUrl}}/auth/register`
- **Headers**: 
  - Content-Type: `application/json`
- **Body** (raw JSON):
```json
{
  "usuario": "testuser123",
  "contrasena": "password123"
}
```
- **Resultado esperado**: Status 201, usuario creado

#### 3.2 Registro con Usuario Duplicado
- **Método**: POST
- **URL**: `{{baseUrl}}/auth/register`
- **Body** (mismo usuario anterior):
```json
{
  "usuario": "testuser123",
  "contrasena": "password456"
}
```
- **Resultado esperado**: Status 409, error "usuario ya existe"

#### 3.3 Validación de Datos
- **Método**: POST
- **URL**: `{{baseUrl}}/auth/register`
- **Body** (datos inválidos):
```json
{
  "usuario": "ab",
  "contrasena": "123"
}
```
- **Resultado esperado**: Status 400, errores de validación

### PASO 4: Pruebas de Login

#### 4.1 Login Exitoso
- **Método**: POST
- **URL**: `{{baseUrl}}/auth/login`
- **Headers**: 
  - Content-Type: `application/json`
- **Body** (raw JSON):
```json
{
  "usuario": "testuser123",
  "contrasena": "password123"
}
```
- **Resultado esperado**: Status 200, mensaje "satisfactoria", token JWT

#### 4.2 Login con Credenciales Incorrectas
- **Método**: POST
- **URL**: `{{baseUrl}}/auth/login`
- **Body**:
```json
{
  "usuario": "testuser123",
  "contrasena": "passwordincorrecto"
}
```
- **Resultado esperado**: Status 401, error de autenticación

#### 4.3 Login con Usuario Inexistente
- **Método**: POST
- **URL**: `{{baseUrl}}/auth/login`
- **Body**:
```json
{
  "usuario": "usuarionoexiste",
  "contrasena": "password123"
}
```
- **Resultado esperado**: Status 401, error de autenticación

### PASO 5: Consultar Usuarios

#### 5.1 Listar Todos los Usuarios
- **Método**: GET
- **URL**: `{{baseUrl}}/auth/users`
- **Resultado esperado**: Lista de usuarios sin contraseñas

## 🛠️ Configuración Avanzada en Postman

### 1. Scripts de Prueba Automática

#### Para el Login Exitoso, agregar en "Tests":
```javascript
pm.test("Login exitoso", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.mensaje).to.include("satisfactoria");
    pm.expect(response).to.have.property("access_token");
    
    // Guardar token para usar en otras pruebas
    pm.environment.set("token", response.access_token);
});
```

#### Para Health Check, agregar en "Tests":
```javascript
pm.test("Sistema saludable", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.status).to.equal("SALUDABLE");
    pm.expect(response.services.database.connected).to.be.true;
});
```

### 2. Organizar Requests en Carpetas

Crear carpetas dentro de la colección:
- 📁 **1. Conectividad** (ping, status, test-guide)
- 📁 **2. Base de Datos** (database/status, health, stats)
- 📁 **3. Registro** (register exitoso, register errores)
- 📁 **4. Login** (login exitoso, login errores)
- 📁 **5. Consultas** (users)

### 3. Ejecutar Colección Completa

1. Clic derecho en la colección "SENA Auth Service"
2. Seleccionar "Run collection"
3. Configurar:
   - Environment: "SENA Local"
   - Iterations: 1
   - Delay: 500ms entre requests
4. Clic en "Run SENA Auth Service"

## 📊 Resultados Esperados

### ✅ Pruebas que Deben PASAR
- ✅ Ping responde con "pong"
- ✅ Status muestra servicio "activo"
- ✅ Database status muestra "CONECTADO"
- ✅ Health check muestra "SALUDABLE"
- ✅ Registro de usuario nuevo funciona
- ✅ Login con credenciales correctas funciona
- ✅ Lista de usuarios se obtiene correctamente

### ❌ Pruebas que Deben FALLAR (Comportamiento Esperado)
- ❌ Registro con usuario duplicado (409)
- ❌ Registro con datos inválidos (400)
- ❌ Login con credenciales incorrectas (401)
- ❌ Login con usuario inexistente (401)

## 🔧 Solución de Problemas

### Error: "Could not get response"
- **Causa**: Servidor no está ejecutándose
- **Solución**: Ejecutar `npm run start:dev`

### Error: "Connection refused"
- **Causa**: Puerto 3001 ocupado
- **Solución**: Cambiar puerto en main.ts o liberar puerto 3001

### Error: 404 Not Found
- **Causa**: URL incorrecta
- **Solución**: Verificar que la URL sea exactamente como se muestra

### Error: 400 Bad Request
- **Causa**: Body del request incorrecto
- **Solución**: Verificar JSON y headers Content-Type

## 📝 Checklist de Pruebas

```
□ Servidor NestJS iniciado correctamente
□ Postman instalado y configurado
□ Environment creado con baseUrl
□ Ping test exitoso
□ Health check exitoso
□ Registro de usuario exitoso
□ Login exitoso con token generado
□ Errores de validación funcionan correctamente
□ Lista de usuarios sin contraseñas
□ Todos los endpoints documentados probados
```

## 🎥 Secuencia de Pruebas Recomendada

1. **Conectividad** → ping, status
2. **Base de Datos** → database/status, health
3. **Registro** → crear usuario de prueba
4. **Login** → autenticar usuario creado
5. **Consultas** → listar usuarios
6. **Errores** → probar casos de fallo
7. **Estadísticas** → verificar métricas del sistema

¡Con esta guía podrás probar completamente tu servicio de autenticación en Postman! 🚀
