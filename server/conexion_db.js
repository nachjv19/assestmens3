import dotenv from "dotenv";
import PG from "pg";

dotenv.config();  // Cargar variables de .env

export const pool = PG.createPool({
    host: localhost,
    database: biblioteca,
    port: 5432,
    user: coder,
    password: clave123,
    connectionLimit: 10,        // Máximo número de conexiones activas al mismo tiempo
    waitForConnections: true,   // Si se alcanza el límite, las nuevas peticiones esperan su turno
    queueLimit: 0               // Número máximo de peticiones en espera (0 = sin límite)
})


async function probarConexionConLaBaseDeDatos() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos exitosa');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
}