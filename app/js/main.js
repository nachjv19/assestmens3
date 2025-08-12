const API_URL = "http://localhost:3000/prestamos";
const tablatransacciones = document.getElementById("tablaPrestamos");
const prestamoForm = document.getElementById("prestamoForm");

// Cargar lista
async function cargarTransaccion() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tablatransacciones.innerHTML = "";
    data.forEach(p => {
        tablatransacciones.innerHTML += `
            <tr>
                <td>${p.id_transaccion}</td>
                <td>${p.fecha_transaccion}</td>
                <td>${p.monto_transaccion}</td>
                <td>${p.estado}</td>
                <td>${p.plataforma}</td>
                <td>${p.id_usuario}</td>
                <td>${p.num_factura}</td>

                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPrestamo(${p.id_transaccion})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPrestamo(${p.id_transaccion})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Guardar / Actualizar
transaccionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const transaccion = {
        id_transaccion: document.getElementById("id_transaccion").value,
        fecha_transaccion: document.getElementById("fecha_transaccion").value,
        monto_transaccion: document.getElementById("monto_transaccion").value,
        estado: document.getElementById("estado").value,
        plataforma: document.getElementById("plataforma").value,
        id_usuario: document.getElementById("id_usuario").value,
        num_factura: document.getElementById("num_factura")
    };

    const id_transaccion = document.getElementById("id_transaccion").value;

    if (id_transaccion) {
        // UPDATE
        await fetch(`${API_URL}/${id_transaccion}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaccion)
        });
    } else {
        // CREATE
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaccion)
        });
    }

    transaccionForm.reset();
    cargarTransaccion();
});

// Editar
window.editarTransaccion = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    document.getElementById("id_transaccion").value = p.id_transaccion;
    document.getElementById("fecha_transaccion").value = p.fecha_transaccion;
    document.getElementById("monto_transaccion").value = p.monto_transaccion;
    document.getElementById("estado").value = p.estado
    document.getElementById("plataforma").value = p.plataforma
    document.getElementById("id_usuario").value = p.id_usuario;
    document.getElementById("num_factura").value = p.num_factura;
};

// Eliminar
window.eliminarTransaccion = async (id) => {
    if (confirm("¿Seguro que quieres eliminar esta transaccion?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        cargarTransaccion();
    }
};

// Inicializar
cargarTransaccion();
