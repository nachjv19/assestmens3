import { cargarFacturasAlaBaseDeDatos } from "./load_facturas.js";
import { cargarTransaccionesAlaBaseDeDatos } from "./load_transaccion.js";
import { cargarUsuariosAlaBaseDeDatos } from "./load_usuarios.js";

(async () => {
    try {
        console.log('🚀 Iniciando seeders...');

        await cargarUsuariosAlaBaseDeDatos()
        await cargarFacturasAlaBaseDeDatos()
        await cargarTransaccionesAlaBaseDeDatos()

        console.log('✅ Todos los seeders ejecutados correctamente.');
    } catch (error) {
        console.error('❌ Error ejecutando los seeders:', error.message);
    } finally {
        process.exit();
    }
})()