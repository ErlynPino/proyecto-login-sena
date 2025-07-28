import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Función principal para inicializar la aplicación
 * Configura el servidor web y las validaciones
 */
async function bootstrap() {
  // Crear la instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Solo permite propiedades definidas en los DTOs
    forbidNonWhitelisted: true, // Rechaza propiedades no definidas
    transform: true, // Transforma automáticamente los tipos de datos
  }));

  // Configurar CORS para permitir peticiones desde el frontend
  app.enableCors();

  // Iniciar el servidor en el puerto 3001
  await app.listen(3001);
  console.log('🚀 Servidor iniciado en http://localhost:3001');
}

bootstrap();
