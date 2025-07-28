import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../interfaces/user.interface';

/**
 * Servicio para la gestión de usuarios
 * Maneja el almacenamiento y consulta de usuarios en memoria
 */
@Injectable()
export class UsersService {
  // Base de datos simulada en memoria para almacenar usuarios
  private readonly users: User[] = [];
  private nextId = 1; // Contador para generar IDs únicos
  private readonly startTime = new Date(); // Tiempo de inicio del servicio

  /**
   * Busca un usuario por su nombre de usuario
   * @param usuario - Nombre de usuario a buscar
   * @returns Usuario encontrado o undefined si no existe
   */
  async findByUsername(usuario: string): Promise<User | undefined> {
    return this.users.find(user => user.usuario === usuario);
  }

  /**
   * Crea un nuevo usuario en el sistema
   * @param usuario - Nombre de usuario único
   * @param contrasena - Contraseña en texto plano
   * @returns Usuario creado sin la contraseña
   * @throws ConflictException si el usuario ya existe
   */
  async createUser(usuario: string, contrasena: string): Promise<Omit<User, 'contrasena'>> {
    // Verificar si el usuario ya existe
    const existingUser = await this.findByUsername(usuario);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe en el sistema');
    }

    // Encriptar la contraseña usando bcrypt con salt de 10 rondas
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Crear el nuevo usuario
    const newUser: User = {
      id: this.nextId++,
      usuario,
      contrasena: hashedPassword,
      fechaCreacion: new Date(),
    };

    // Guardar el usuario en la base de datos simulada
    this.users.push(newUser);

    // Retornar el usuario sin la contraseña por seguridad
    const { contrasena: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Valida las credenciales de un usuario
   * @param usuario - Nombre de usuario
   * @param contrasena - Contraseña en texto plano
   * @returns Usuario sin contraseña si las credenciales son válidas, null si no
   */
  async validateUser(usuario: string, contrasena: string): Promise<Omit<User, 'contrasena'> | null> {
    // Buscar el usuario en la base de datos
    const user = await this.findByUsername(usuario);
    if (!user) {
      return null; // Usuario no encontrado
    }

    // Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
      return null; // Contraseña incorrecta
    }

    // Retornar el usuario sin la contraseña por seguridad
    const { contrasena: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Obtiene todos los usuarios registrados (sin contraseñas)
   * @returns Lista de usuarios sin contraseñas
   */
  async getAllUsers(): Promise<Omit<User, 'contrasena'>[]> {
    return this.users.map(({ contrasena, ...user }) => user);
  }

  /**
   * Valida el estado de la conexión con la base de datos simulada
   * @returns Estado de la conexión y estadísticas del sistema
   */
  async validateDatabaseConnection(): Promise<{
    status: string;
    connected: boolean;
    totalUsers: number;
    uptime: string;
    lastUserCreated?: Date;
    memoryUsage: string;
  }> {
    try {
      // Simular una verificación de conexión a base de datos
      const isConnected = this.users !== undefined && Array.isArray(this.users);
      
      // Calcular tiempo de actividad del servicio
      const uptime = this.calculateUptime();
      
      // Obtener el último usuario creado
      const lastUser = this.users.length > 0 
        ? this.users[this.users.length - 1] 
        : null;

      // Calcular uso de memoria aproximado
      const memoryUsage = this.calculateMemoryUsage();

      return {
        status: isConnected ? 'CONECTADO' : 'DESCONECTADO',
        connected: isConnected,
        totalUsers: this.users.length,
        uptime,
        lastUserCreated: lastUser?.fechaCreacion,
        memoryUsage,
      };
    } catch (error) {
      return {
        status: 'ERROR',
        connected: false,
        totalUsers: 0,
        uptime: '0s',
        memoryUsage: 'N/A',
      };
    }
  }

  /**
   * Calcula el tiempo de actividad del servicio
   * @returns Tiempo de actividad en formato legible
   */
  private calculateUptime(): string {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startTime.getTime();
    
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Calcula el uso aproximado de memoria
   * @returns Uso de memoria en formato legible
   */
  private calculateMemoryUsage(): string {
    const userDataSize = JSON.stringify(this.users).length;
    const sizeInKB = (userDataSize / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  }

  /**
   * Obtiene estadísticas detalladas del sistema
   * @returns Estadísticas completas del servicio de usuarios
   */
  async getSystemStats(): Promise<{
    totalUsers: number;
    serviceUptime: string;
    databaseStatus: string;
    lastActivity: Date | null;
    usersRegisteredToday: number;
    memoryFootprint: string;
  }> {
    const dbStatus = await this.validateDatabaseConnection();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usersToday = this.users.filter(user => 
      user.fechaCreacion >= today
    ).length;

    return {
      totalUsers: this.users.length,
      serviceUptime: dbStatus.uptime,
      databaseStatus: dbStatus.status,
      lastActivity: dbStatus.lastUserCreated || null,
      usersRegisteredToday: usersToday,
      memoryFootprint: dbStatus.memoryUsage,
    };
  }

  /**
   * Método para realizar una prueba de escritura/lectura en la base de datos
   * @returns Resultado de la prueba de conectividad
   */
  async performHealthCheck(): Promise<{
    canWrite: boolean;
    canRead: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      // Prueba de lectura
      const canRead = this.users.length >= 0;
      
      // Prueba de escritura (simulada)
      const testArray = [...this.users];
      const canWrite = testArray.push && testArray.pop ? true : false;
      
      const responseTime = Date.now() - startTime;

      return {
        canRead,
        canWrite,
        responseTime,
      };
    } catch (error) {
      return {
        canRead: false,
        canWrite: false,
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }
}
