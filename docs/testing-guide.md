# Guía de Pruebas - Servicio de Autenticación SENA

## 📋 Índice
1. [Verificación de Conectividad](#verificación-de-conectividad)
2. [Pruebas de Base de Datos](#pruebas-de-base-de-datos)
3. [Pruebas con Postman](#pruebas-con-postman)
4. [Pruebas Manuales](#pruebas-manuales)
5. [Casos de Error](#casos-de-error)

## 🔌 Verificación de Conectividad

### 1. Verificar que el servicio está activo
```http
GET http://localhost:3000/auth/ping
```

**Respuesta esperada:**
```json
{
  "mensaje": "pong",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "SENA Auth Service",
  "version": "1.0.0"
}
```

### 2. Estado general del sistema
```http
GET http://localhost:3000/auth/status
```

**Respuesta esperada:**
```json
{
  "mensaje": "Servicio de autenticación activo",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🗄️ Pruebas de Base de Datos

### 1. Estado de la conexión a base de datos
```http
GET http://localhost:3000/auth/database/status
```

**Respuesta esperada:**
```json
{
  "mensaje": "Estado de la base de datos",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "status": "CONECTADO",
    "connected": true,
    "totalUsers": 5,
    "uptime": "2h 15m 30s",
    "lastUserCreated": "2024-01-15T08:45:00.000Z",
    "memoryUsage": "2.45 KB"
  }
}
```

### 2. Chequeo de salud completo
```http
GET http://localhost:3000/auth/health
```

**Respuesta esperada:**
```json
{
  "mensaje": "Chequeo de salud del sistema",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "SALUDABLE",
  "services": {
    "database": {
      "status": "CONECTADO",
      "connected": true,
      "responseTime": "2ms",
      "canRead": true,
      "canWrite": true,
      "error": null
    },
    "authentication": {
      "status": "ACTIVO",
      "uptime": "2h 15m 30s"
    },
    "userManagement": {
      "status": "ACTIVO",
      "totalUsers": 5,
      "registeredToday": 2,
      "memoryUsage": "2.45 KB"
    }
  },
  "lastActivity": "2024-01-15T08:45:00.000Z"
}
```

### 3. Estadísticas del sistema
```http
GET http://localhost:3000/auth/stats
```

## 📮 Pruebas con Postman

### Importar la colección
1. Abrir Postman
2. Hacer clic en "Import"
3. Seleccionar el archivo `postman-collection/SENA-Auth-Service.postman_collection.json`
4. La colección se importará automáticamente

### Ejecutar pruebas automatizadas
1. Seleccionar la colección "SENA Auth Service"
2. Hacer clic en "Run"
3. Seleccionar todas las carpetas
4. Hacer clic en "Run SENA Auth Service"

### Variables de entorno
- `baseUrl`: http://localhost:3000
- `authToken`: Se llena automáticamente después del login

## 🧪 Pruebas Manuales

### 1. Registro de Usuario

**Endpoint:** `POST /auth/register`

**Casos de prueba:**

#### ✅ Registro exitoso
```json
{
  "usuario": "testuser123",
  "contrasena": "password123"
}
```

#### ❌ Usuario muy corto
```json
{
  "usuario": "ab",
  "contrasena": "password123"
}
```

#### ❌ Contraseña muy corta
```json
{
  "usuario": "testuser123",
  "contrasena": "123"
}
```

#### ❌ Usuario duplicado
```json
{
  "usuario": "testuser123",
  "contrasena": "password456"
}
```

### 2. Inicio de Sesión

**Endpoint:** `POST /auth/login`

#### ✅ Login exitoso
```json
{
  "usuario": "testuser123",
  "contrasena": "password123"
}
```

#### ❌ Usuario inexistente
```json
{
  "usuario": "usuarionoexiste",
  "contrasena": "password123"
}
```

#### ❌ Contraseña incorrecta
```json
{
  "usuario": "testuser123",
  "contrasena": "passwordincorrecto"
}
```

### 3. Consulta de Usuarios

**Endpoint:** `GET /auth/users`

Debe retornar lista de usuarios sin contraseñas.

## ⚠️ Casos de Error

### Errores de Validación (400)
- Campos obligatorios faltantes
- Usuario menor a 3 caracteres
- Contraseña menor a 6 caracteres
- Datos en formato incorrecto

### Errores de Autenticación (401)
- Credenciales incorrectas
- Usuario no existe
- Contraseña incorrecta

### Errores de Conflicto (409)
- Usuario ya existe

### Errores del Servidor (500)
- Problemas de conectividad
- Errores internos del sistema

## 📊 Métricas de Prueba

### Criterios de Aceptación
- ✅ Todos los endpoints responden correctamente
- ✅ Base de datos simula conexión exitosa
- ✅ Validaciones funcionan correctamente
- ✅ Mensajes de error son descriptivos
- ✅ Contraseñas se encriptan correctamente
- ✅ Tokens JWT se generan correctamente

### Checklist de Pruebas
- [ ] Ping responde correctamente
- [ ] Estado del sistema es "activo"
- [ ] Base de datos reporta estado "CONECTADO"
- [ ] Health check retorna "SALUDABLE"
- [ ] Registro de usuario funciona
- [ ] Login exitoso retorna token
- [ ] Login fallido retorna error 401
- [ ] Validaciones de entrada funcionan
- [ ] Lista de usuarios no incluye contraseñas
- [ ] Estadísticas del sistema son precisas

## 🔧 Comandos de Prueba Rápida

### cURL Commands

```bash
# Ping
curl -X GET http://localhost:3000/auth/ping

# Estado de base de datos
curl -X GET http://localhost:3000/auth/database/status

# Health check
curl -X GET http://localhost:3000/auth/health

# Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"usuario":"testuser","contrasena":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"testuser","contrasena":"password123"}'
```

## 📝 Log de Pruebas

Para llevar registro de las pruebas realizadas, documenta:

1. **Fecha y hora de la prueba**
2. **Endpoint probado**
3. **Datos de entrada**
4. **Respuesta obtenida**
5. **Estado: PASS/FAIL**
6. **Observaciones**

**Ejemplo:**
```
Fecha: 2024-01-15 10:30
Endpoint: POST /auth/register
Entrada: {"usuario":"test","contrasena":"123456"}
Respuesta: 201 - Usuario registrado exitosamente
Estado: PASS
Observaciones: Funciona correctamente
```
