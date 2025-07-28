import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { User, UserSchema } from './schemas/user.schema';

/**
 * Módulo de autenticación
 * Configura todos los componentes relacionados con el registro y login
 */
@Module({
  imports: [
    // Registro del esquema de usuario para MongoDB
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Configuración del módulo JWT para manejo de tokens
    JwtModule.register({
      secret: 'clave-secreta-sena-2024', // Clave secreta para firmar tokens (en producción usar variable de entorno)
      signOptions: { 
        expiresIn: '1h',  // Los tokens expiran en 1 hora
        issuer: 'sena-auth-service', // Identificador del emisor del token
      },
    }),
  ],
  controllers: [
    AuthController, // Controlador que maneja las rutas de autenticación
  ],
  providers: [
    AuthService,  // Servicio principal de autenticación
    UsersService, // Servicio de gestión de usuarios
  ],
  exports: [
    AuthService,  // Exportar el servicio para uso en otros módulos
    UsersService, // Exportar el servicio de usuarios
  ],
})
export class AuthModule {}
