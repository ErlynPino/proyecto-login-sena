import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user.schema';

/**
 * Servicio para la gestión de usuarios
 * Maneja el almacenamiento y consulta de usuarios en MongoDB
 */
@Injectable()
export class UsersService {
  // Tiempo de inicio del servicio
  private readonly startTime = new Date();

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Busca un usuario por su nombre de usuario
   * @param usuario - Nombre de usuario a buscar
   * @returns Usuario encontrado o undefined si no existe
   */
  async findByUsername(usuario: string): Promise<User | undefined> {
    return this.userModel.findOne({ usuario }).exec();
  }

  /**
   * Crea un nuevo usuario en el sistema
   * @param usuario - Nombre de usuario único
   * @param contrasena - Contraseña en texto plano
   * @returns Usuario creado sin la contraseña
   * @throws ConflictException si el usuario ya existe
   */
  async createUser(usuario: string, contrasena: string): Promise<any> {
    // Verificar si el usuario ya existe
    const existingUser = await this.findByUsername(usuario);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe en el sistema');
    }

    // Encriptar la contraseña usando bcrypt con salt de 10 rondas
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Crear el nuevo usuario en MongoDB
    const newUser = new this.userModel({
      usuario,
      contrasena: hashedPassword,
      fechaCreacion: new Date(),
    });

    // Guardar en la base de datos
    await newUser.save();

    // Retornar el usuario sin la contraseña por seguridad
    const result = newUser.toObject();
    delete result.contrasena;
    return result;
  }

  /**
   * Valida las credenciales de un usuario
   * @param usuario - Nombre de usuario
   * @param contrasena - Contraseña en texto plano
   * @returns Usuario sin contraseña si las credenciales son válidas, null si no
   */
  async validateUser(usuario: string, contrasena: string): Promise<any | null> {
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
    const result = user.toObject();
    delete result.contrasena;
    return result;
  }

  /**
   * Obtiene todos los usuarios registrados (sin contraseñas)
   * @returns Lista de usuarios sin contraseñas
   */
  async getAllUsers(): Promise<any[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => {
      const result = user.toObject();
      delete result.contrasena;
      return result;
    });
  }

  /**
   * Valida el estado de la conexión con la base de datos
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
      // Verificación real de conexión a la base de datos
      await this.userModel.db.collection('users').stats();
      
      // Obtener el número total de usuarios
      const totalUsers = await this.userModel.countDocuments();
      
      // Obtener el último usuario creado
      const lastUser = await this.userModel.findOne().sort({ fechaCreacion: -1 }).exec();
      
      // Calcular tiempo de actividad del servicio
      const uptime = this.calculateUptime();
      
      return {
        status: 'CONECTADO',
        connected: true,
        totalUsers,
        uptime,
        lastUserCreated: lastUser?.fechaCreacion,
        memoryUsage: this.calculateMemoryUsage(),
      };
    } catch (error) {
      console.error('Error validando conexión a la base de datos:', error);
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
    const memoryUsage = process.memoryUsage();
    const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    return `${heapUsed} MB`;
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
    
    // Obtener usuarios registrados hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usersToday = await this.userModel.countDocuments({
      fechaCreacion: { $gte: today }
    });

    return {
      totalUsers: dbStatus.totalUsers,
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
      // Prueba de lectura real en la base de datos
      await this.userModel.findOne().exec();
      
      // Prueba de escritura (con inserción y eliminación temporal)
      const testUser = new this.userModel({
        usuario: `test_${Date.now()}`,
        contrasena: 'test_password',
        fechaCreacion: new Date()
      });
      
      await testUser.save();
      await this.userModel.deleteOne({ _id: testUser._id });
      
      const responseTime = Date.now() - startTime;

      return {
        canRead: true,
        canWrite: true,
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
