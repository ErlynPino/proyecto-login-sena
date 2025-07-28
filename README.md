# Proyecto Login SENA - Servicio Web de Autenticación

## Descripción

Este proyecto implementa un servicio web RESTful desarrollado en NestJS para el manejo de registro e inicio de sesión de usuarios. Fue creado como evidencia de desempeño para el SENA.

## Características

- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión con validación de credenciales
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Generación de tokens JWT
- ✅ Validación de datos con class-validator
- ✅ Manejo de errores personalizado
- ✅ Documentación completa con comentarios

## Tecnologías Utilizadas

- **NestJS**: Framework de Node.js para APIs escalables
- **JWT**: Para autenticación basada en tokens
- **bcryptjs**: Para encriptación de contraseñas
- **class-validator**: Para validación de datos de entrada
- **TypeScript**: Lenguaje de programación tipado

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd "proyecto login sena"
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run start:dev
```

El servidor estará disponible en: http://localhost:3001

## Endpoints Disponibles

### 1. Registro de Usuario
- **URL**: `POST /auth/register`
- **Descripción**: Registra un nuevo usuario en el sistema
- **Body**:
```json
{
  "usuario": "nombreusuario",
  "contrasena": "contraseña123"
}
```
- **Respuesta exitosa**:
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "usuario": "nombreusuario",
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Inicio de Sesión
- **URL**: `POST /auth/login`
- **Descripción**: Autentica un usuario y devuelve un token de acceso
- **Body**:
```json
{
  "usuario": "nombreusuario",
  "contrasena": "contraseña123"
}
```
- **Respuesta exitosa**:
```json
{
  "mensaje": "Autenticación satisfactoria",
  "usuario": {
    "id": 1,
    "usuario": "nombreusuario",
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Listar Usuarios
- **URL**: `GET /auth/users`
- **Descripción**: Obtiene la lista de todos los usuarios registrados

### 4. Estado del Servicio
- **URL**: `GET /auth/status`
- **Descripción**: Verifica que el servicio esté funcionando correctamente

## Validaciones Implementadas

- **Usuario**: 
  - Mínimo 3 caracteres
  - Máximo 20 caracteres
  - Campo obligatorio
  - Debe ser único

- **Contraseña**:
  - Mínimo 6 caracteres
  - Máximo 50 caracteres
  - Campo obligatorio
  - Encriptación automática

## Manejo de Errores

- **409 Conflict**: Usuario ya existe
- **401 Unauthorized**: Credenciales incorrectas
- **400 Bad Request**: Datos de entrada inválidos

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Construcción del proyecto
npm run build

# Inicio en producción
npm run start:prod
```

## Estructura del Proyecto

```
src/
├── auth/
│   ├── controllers/        # Controladores REST
│   ├── services/          # Lógica de negocio
│   ├── dto/              # Objetos de transferencia de datos
│   ├── interfaces/       # Definiciones de tipos
│   └── auth.module.ts    # Configuración del módulo
├── app.module.ts         # Módulo principal
└── main.ts              # Punto de entrada
```

## Autor

Proyecto desarrollado para el SENA - Evidencia GA7-220501096-AA5-EV01

## Licencia

Este proyecto es de uso educativo para el SENA.
```
