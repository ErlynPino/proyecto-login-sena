import { Controller, Post, Body, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Controlador de autenticación
 * Define los endpoints para registro, login y consulta de usuarios
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,   // Servicio de autenticación
    private readonly usersService: UsersService, // Servicio de usuarios
  ) {}

  /**
   * Endpoint para registrar un nuevo usuario
   * POST /auth/register
   * @param registerDto - Datos del usuario a registrar
   * @returns Respuesta con el usuario creado
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * Endpoint para iniciar sesión
   * POST /auth/login
   * @param loginDto - Credenciales de inicio de sesión
   * @returns Token de acceso y datos del usuario autenticado
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Retorna 200 en lugar de 201 para login
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * Endpoint para obtener todos los usuarios registrados
   * GET /auth/users
   * @returns Lista de usuarios sin contraseñas
   */
  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return {
      mensaje: 'Lista de usuarios registrados',
      total: users.length,
      usuarios: users,
    };
  }

  /**
   * Endpoint de prueba para verificar que el servicio está funcionando
   * GET /auth/status
   * @returns Estado del servicio
   */
  @Get('status')
  getStatus() {
    return {
      mensaje: 'Servicio de autenticación activo',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Endpoint para verificar la conexión con la base de datos
   * GET /auth/database/status
   * @returns Estado detallado de la conexión a base de datos
   */
  @Get('database/status')
  async getDatabaseStatus() {
    const dbStatus = await this.usersService.validateDatabaseConnection();
    
    return {
      mensaje: 'Estado de la base de datos',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    };
  }

  /**
   * Endpoint para realizar un chequeo completo de salud del sistema
   * GET /auth/health
   * @returns Estado completo del sistema y servicios
   */
  @Get('health')
  async getHealthCheck() {
    const [dbStatus, systemStats, healthCheck] = await Promise.all([
      this.usersService.validateDatabaseConnection(),
      this.usersService.getSystemStats(),
      this.usersService.performHealthCheck(),
    ]);

    const overallStatus = dbStatus.connected && healthCheck.canRead && healthCheck.canWrite
      ? 'SALUDABLE'
      : 'DEGRADADO';

    return {
      mensaje: 'Chequeo de salud del sistema',
      timestamp: new Date().toISOString(),
      status: overallStatus,
      services: {
        database: {
          status: dbStatus.status,
          connected: dbStatus.connected,
          responseTime: `${healthCheck.responseTime}ms`,
          canRead: healthCheck.canRead,
          canWrite: healthCheck.canWrite,
          error: healthCheck.error || null,
        },
        authentication: {
          status: 'ACTIVO',
          uptime: systemStats.serviceUptime,
        },
        userManagement: {
          status: 'ACTIVO',
          totalUsers: systemStats.totalUsers,
          registeredToday: systemStats.usersRegisteredToday,
          memoryUsage: systemStats.memoryFootprint,
        },
      },
      lastActivity: systemStats.lastActivity,
    };
  }

  /**
   * Endpoint para obtener estadísticas del sistema
   * GET /auth/stats
   * @returns Estadísticas detalladas del servicio
   */
  @Get('stats')
  async getSystemStats() {
    const stats = await this.usersService.getSystemStats();
    
    return {
      mensaje: 'Estadísticas del sistema',
      timestamp: new Date().toISOString(),
      statistics: stats,
    };
  }

  /**
   * Endpoint para verificar la conectividad básica del servicio
   * GET /auth/ping
   * @returns Respuesta simple para verificar que el servicio responde
   */
  @Get('ping')
  ping() {
    return {
      mensaje: 'pong',
      timestamp: new Date().toISOString(),
      service: 'SENA Auth Service',
      version: '1.0.0',
    };
  }

  /**
   * Endpoint de ayuda para pruebas en Postman
   * GET /auth/test-guide
   * @returns Guía rápida de endpoints disponibles
   */
  @Get('test-guide')
  getTestGuide() {
    return {
      mensaje: 'Guía de pruebas para Postman',
      endpoints: {
        conectividad: {
          ping: 'GET /auth/ping',
          status: 'GET /auth/status',
          health: 'GET /auth/health'
        },
        baseDatos: {
          estado: 'GET /auth/database/status',
          estadisticas: 'GET /auth/stats'
        },
        autenticacion: {
          registro: 'POST /auth/register',
          login: 'POST /auth/login',
          usuarios: 'GET /auth/users'
        }
      },
      ejemplos: {
        registro: {
          url: 'POST /auth/register',
          body: {
            usuario: 'testuser123',
            contrasena: 'password123'
          }
        },
        login: {
          url: 'POST /auth/login',
          body: {
            usuario: 'testuser123',
            contrasena: 'password123'
          }
        }
      },
      baseUrl: 'http://localhost:3001'
    };
  }
}
