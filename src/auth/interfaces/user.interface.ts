/**
 * Interface que define la estructura de un usuario en el sistema
 * Especifica los tipos de datos para cada propiedad del usuario
 */
export interface User {
  id: number;           // Identificador único del usuario
  usuario: string;      // Nombre de usuario único
  contrasena: string;   // Contraseña encriptada del usuario
  fechaCreacion: Date;  // Fecha y hora de registro del usuario
}
