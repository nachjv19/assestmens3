/*se encarga de cargar los prestamos a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"


export async function cargarTransaccionesAlaBaseDeDatos() {

    const rutaArchivo = path.resolve('server/data/transaccion.csv');
    const prestamos = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                prestamos.push([
                    fila.id_transaccion,
                    fila.fecha_transaccion,
                    fila.monto_transaccion,
                    fila.estado,
                    fila.id_usuario,
                    fila.num_factura
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO transaccion (id_transaccion,fecha_transaccion, monto_transaccion,estado,id_usuario,num_factura) VALUES ?';
                    const [result] = await pool.query(sql, [prestamos]);

                    console.log(`✅ Se insertaron ${result.affectedRows} transacciones.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error al insertar transacciones:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de prestamos:', err.message);
                reject(err);
            });
    });
}