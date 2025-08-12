/*se encarga de cargar los libros a la base de datos*/
import fs from 'fs'; // es la que me permite leer archivos
import path from 'path'; // esta muestra la ruta actual
import csv from 'csv-parser';
import { pool } from "../conexion_db.js"


export async function cargarFacturasAlaBaseDeDatos() {

    const rutaArchivo = path.resolve('server/data/facturas.csv');
    const libros = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on("data", (fila) => {
                libros.push([
                    fila.numero_factura,
                    fila.fecha_factura,
                    fila.monto_facturado,
                    fila.monto_pagado
                ]);
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO facturas (numero_factura,fecha_factura,monto_facturado,monto_pagado) VALUES ?';
                    const [result] = await pool.query(sql, [libros]);

                    console.log(`✅ Se insertaron ${result.affectedRows} facturas.`);
                    resolve(); // Termina exitosamente
                } catch (error) {
                    console.error('❌ Error al insertar factura:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('❌ Error al leer el archivo CSV de libros:', err.message);
                reject(err);
            });
    });
}