import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO (Data Transfer Object) para el inicio de sesión
 * Define la estructura y validaciones para las credenciales de acceso
 */
export class LoginDto {
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  usuario: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contrasena: string;
}
