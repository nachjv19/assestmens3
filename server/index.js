import cors from "cors"
import express from "express"
import { pool } from "./conexion_db.js"

const app = express()
app.use(cors()) // esto permite que la aplicacion backend pueda ser consumida por una aplicacion frontend
app.use(express.json()) // permite que Express interprete automáticamente el body en JSON cuando recibes una petición POST o PUT.


app.get('/transacciones', async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT 
            t.id_transaccion,
            t.fecha_transaccion,
            t.monto_transaccion,
            t.estado,
            t.plataforma,
            u.nombre AS usuario,
            f.num_factura, 
            f.monto_facturado AS monto
        FROM transacciones t
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN libros l ON p.isbn = l.isbn
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.get('/transaccion/:id_transaccion', async (req, res) => {
    try {
        const { id_transaccion } = req.params

        const [rows] = await pool.query(`
        SELECT 
            t.id_transaccion,
            t.fecha_transaccion,
            t.monto_transaccion,
            t.estado,
            u.nombre_completo AS usuario,
            f.num_factura, 
            f.monto_facturado AS monto
        FROM transaccion t
        LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
        LEFT JOIN libros l ON p.isbn = l.isbn WHERE p.id_transaccion = ?
        `, [id_transaccion]);

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.post('/transaccion', async (req, res) => {
    try {
        const {
            id_transaccion,
            fecha_transaccion,
            monto_transaccion,
            estado,
            plataforma
        } = req.body

        const query = `
        INSERT INTO transaccion 
        (id_transaccion, fecha_transaccion, monto_transaccion, estado, plataforma)
        VALUES (?, ?, ?, ?, ?)
        `
        const values = [
            id_transaccion,
            fecha_transaccion,
            monto_transaccion,
            estado,
            plataforma
        ]

        const [result] = await pool.query(query, values)

        res.status(201).json({
            mensaje: "transaccion creada exitosamente"
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.put('/transaccion/:id_transaccion', async (req, res) => {
    try {
        const {id_transaccion} = req.params

        const {
            id_transaccion,
            fecha_transaccion,
            monto_transaccion,
            estado,
            plataforma
        } = req.body

        const query = `
        UPDATE transaccion SET 
            id_transaccion = ?,
            fecha_transaccion = ?,
            monto_transaccion = ?,
            estado = ?,
            plataforma = ?,
        WHERE id_transaccion = ?
        `
        const values = [
            id_transaccion,
            fecha_transaccion,
            monto_transaccion,
            estado,
            plataforma
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "transaccion actualizada" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

app.delete('/transaccion/:id_transaccion', async (req, res) => {
    try {
        const { id_transaccion } = req.params

        const query = `
        DELETE FROM transaccion WHERE id_transaccion = ?
        `
        const values = [
            id_transaccion
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return res.json({ mensaje: "transaccion eliminada" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }




})

// 1. Ver todas las transferencias de un usuario
app.get('/transaccion/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                t.id_transaccion,
                t.fecha_transaccion,
                t.monto_transaccion,
                t.estado,
                t.plataforma,
                f.num_factura,
                f.monto_facturado AS monto
            FROM transaccion t
            LEFT JOIN factura l ON p.num_factura = l.num_factura
            WHERE t.id_transaccion = ?
        `, [id]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

//Inicio del servidor cuando este todo listo
app.listen(3000, () => {
    console.log("servidor prepado correctamente en http://localhost:3000");
})