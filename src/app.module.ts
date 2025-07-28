import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Módulo principal de la aplicación
 * Importa todos los módulos funcionales del sistema
 */
@Module({
  imports: [
    // Conexión a la base de datos MongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/solistica'),
    AuthModule, // Módulo de autenticación y registro
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
