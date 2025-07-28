import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) para el registro de usuarios
 * Define la estructura y validaciones para los datos de registro
 */
export class RegisterDto {
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'El usuario no puede tener más de 20 caracteres' })
  usuario: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
  contrasena: string;
}
