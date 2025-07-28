import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Servicio principal de autenticación
 * Maneja el registro, login y generación de tokens JWT
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, // Servicio de gestión de usuarios
        private readonly jwtService: JwtService,     // Servicio para manejo de JWT
    ) { }

    /**
     * Registra un nuevo usuario en el sistema
     * @param registerDto - Datos de registro del usuario
     * @returns Mensaje de éxito y datos del usuario creado
     */
    async register(registerDto: RegisterDto) {
        const { usuario, contrasena } = registerDto;

        // Crear el usuario usando el servicio de usuarios
        const newUser = await this.usersService.createUser(usuario, contrasena);

        return {
            mensaje: 'Usuario registrado exitosamente',
            usuario: newUser,
        };
    }

    /**
     * Autentica un usuario y genera un token de acceso
     * @param loginDto - Credenciales de inicio de sesión
     * @returns Token de acceso y mensaje de éxito
     * @throws UnauthorizedException si las credenciales son inválidas
     */
    async login(loginDto: LoginDto) {
        const { usuario, contrasena } = loginDto;

        // Validar las credenciales del usuario
        const validatedUser = await this.usersService.validateUser(usuario, contrasena);

        if (!validatedUser) {
            throw new UnauthorizedException('Error en la autenticación. Usuario o contraseña incorrectos');
        }

        // Crear el payload para el token JWT
        const payload = {
            sub: validatedUser.id,      // ID del usuario
            username: validatedUser.usuario, // Nombre de usuario
        };

        // Generar el token de acceso
        const accessToken = this.jwtService.sign(payload);

        return {
            mensaje: 'Autenticación satisfactoria',
            usuario: validatedUser,
            access_token: accessToken,
        };
    }
}
