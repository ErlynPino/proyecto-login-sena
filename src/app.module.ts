import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

/**
 * Módulo principal de la aplicación
 * Importa todos los módulos funcionales del sistema
 */
@Module({
  imports: [
    AuthModule, // Módulo de autenticación y registro
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
