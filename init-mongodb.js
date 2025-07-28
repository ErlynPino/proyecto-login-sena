// Script para inicializar la base de datos MongoDB
// Para ejecutar: mongo init-mongodb.js

// Usar o crear la base de datos solistica
db = db.getSiblingDB('solistica');

// Eliminar la colección de usuarios si ya existe
db.users.drop();

// Crear la colección users explícitamente
db.createCollection('users');

// Crear un índice único en el campo 'usuario' para asegurar usuarios únicos
db.users.createIndex({ "usuario": 1 }, { unique: true });

// Insertar un usuario de prueba (opcional)
// Nota: la contraseña es 'admin123' pero debería estar hasheada en producción
db.users.insertOne({
  usuario: "admin",
  contrasena: "$2a$10$XgwO7tS5DPTQqtgJ.q4TJejcY1zqYaQ7U7BYIz1Kc7QVpH7D6JVRa", // 'admin123' hasheado
  fechaCreacion: new Date()
});

// Verificar que se haya creado el usuario
const usuariosCreados = db.users.find().toArray();
print("Usuarios creados: " + usuariosCreados.length);
print(JSON.stringify(usuariosCreados, null, 2));

print("Base de datos 'solistica' y colección 'users' inicializadas correctamente");
