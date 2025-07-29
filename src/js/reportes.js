// Definimos los endpoints de la API local para obtener datos de categorías y movimientos
let endpointCategories = "http://localhost:3000/categories";
let endpointMovimientos = "http://localhost:3000/movimientos";

// Seleccionamos los elementos HTML donde mostraremos los reportes
const categoriaMasVendida = document.getElementById("categoria-mas-vendida");
const categoriaMasComprada = document.getElementById("categoria-mas-compras");
const productoMasVendido = document.getElementById("producto-mas-vendido");
const productoMasComprado = document.getElementById("producto-comprado");
const mesMasVentas = document.getElementById("mas-ventas");
const mesMasCompras = document.getElementById("mes-mas-compra");
const tablaTotalesCategoria = document.getElementById("totales-categoria");
const tablaTotalesMes = document.getElementById("totales-mes");

// Cuando la página carga completamente, ejecutamos las funciones de reportes
document.addEventListener("DOMContentLoaded", async () => {
    const movimientos = await obtener(endpointMovimientos);
    const categorias = await obtener(endpointCategories);

    pintarCategoriaMasVendida(movimientos, categorias);
    pintarCategoriaMasComprada(movimientos, categorias);
    pintarProductoMasVendido(movimientos);
    pintarProductoMasComprado(movimientos);
    pintarMesMasVentas(movimientos);
    pintarMesMasCompras(movimientos);
    pintarTablaTotalesPorCategoria(movimientos, categorias);
    pintarTablaTotalesPorMes(movimientos);
});

// Función reutilizable para hacer peticiones GET y obtener datos JSON
async function obtener(endpoint) {
    const response = await fetch(endpoint);
    return await response.json();
}

// Mostrar la categoría con mayor importe de ventas
function pintarCategoriaMasVendida(movs, categorias) {
    // Filtramos los movimientos que sean ventas
    const ventas = movs.filter(m => m.tipo === "venta");
    // Agrupamos por ID de categoría y sumamos importes
    const totales = agruparPor(ventas, "categoryId", "importe");

    // Buscamos la categoría con mayor total
    const idMax = obtenerIdConMayorValor(totales);
    const categoria = categorias.find(cat => cat.id === idMax);

    // Mostramos el nombre de la categoría (o "-" si no se encuentra)
    categoriaMasVendida.textContent = categoria ? categoria.nombre : "-";
}

// Mostrar la categoría con mayor importe de compras
function pintarCategoriaMasComprada(movs, categorias) {
    const compras = movs.filter(m => m.tipo === "compra");
    const totales = agruparPor(compras, "categoryId", "importe");

    const idMax = obtenerIdConMayorValor(totales);
    const categoria = categorias.find(cat => cat.id === idMax);

    categoriaMasComprada.textContent = categoria ? categoria.nombre : "-";
}

// Mostrar el producto (descripción) más vendido por mayor importe
function pintarProductoMasVendido(movs) {
    const ventas = movs.filter(m => m.tipo === "venta");
    const totales = agruparPor(ventas, "descripcion", "importe");

    const descripcionMax = obtenerIdConMayorValor(totales);
    productoMasVendido.textContent = descripcionMax || "-";
}

// Mostrar el producto (descripción) más comprado por mayor importe
function pintarProductoMasComprado(movs) {
    const compras = movs.filter(m => m.tipo === "compra");
    const totales = agruparPor(compras, "descripcion", "importe");

    const descripcionMax = obtenerIdConMayorValor(totales);
    productoMasComprado.textContent = descripcionMax || "-";
}

// Mostrar el mes con mayor suma de ventas
function pintarMesMasVentas(movs) {
    const ventas = movs.filter(m => m.tipo === "venta");
    const totales = agruparPor(ventas, "mes", "importe");

    const mesMax = obtenerIdConMayorValor(totales);
    mesMasVentas.textContent = mesMax || "-";
}

// Mostrar el mes con mayor suma de compras
function pintarMesMasCompras(movs) {
    const compras = movs.filter(m => m.tipo === "compra");
    const totales = agruparPor(compras, "mes", "importe");

    const mesMax = obtenerIdConMayorValor(totales);
    mesMasCompras.textContent = mesMax || "-";
}

// Pintar tabla con totales por categoría (ventas y compras)
function pintarTablaTotalesPorCategoria(movs, categorias) {
    // Agrupamos todos los movimientos por categoría
    const resumen = {};

    movs.forEach(m => {
        if (!m.categoryId) return;

        if (!resumen[m.categoryId]) {
            resumen[m.categoryId] = { ventas: 0, compras: 0 };
        }

        if (m.tipo === "venta") {
            resumen[m.categoryId].ventas += Number(m.importe);
        } else if (m.tipo === "compra") {
            resumen[m.categoryId].compras += Number(m.importe);
        }
    });

    // Construimos tabla HTML
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Total Ventas</th>
                    <th>Total Compras</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let id in resumen) {
        const categoria = categorias.find(cat => cat.id === id);
        const nombre = categoria ? categoria.nombre : "(Eliminada)";
        html += `
            <tr>
                <td>${nombre}</td>
                <td>$${resumen[id].ventas}</td>
                <td>$${resumen[id].compras}</td>
            </tr>
        `;
    }

    html += "</tbody></table>";
    tablaTotalesCategoria.innerHTML = html;
}

// Pintar tabla con totales por mes (ventas y compras)
function pintarTablaTotalesPorMes(movs) {
    // Agrupamos por mes y tipo
    const resumen = {};

    movs.forEach(m => {
        const mes = m.fecha.slice(0, 7); // "2025-07"
        if (!resumen[mes]) {
            resumen[mes] = { ventas: 0, compras: 0 };
        }

        if (m.tipo === "venta") {
            resumen[mes].ventas += Number(m.importe);
        } else if (m.tipo === "compra") {
            resumen[mes].compras += Number(m.importe);
        }
    });

    // Construimos tabla
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Total Ventas</th>
                    <th>Total Compras</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let mes in resumen) {
        html += `
            <tr>
                <td>${mes}</td>
                <td>$${resumen[mes].ventas}</td>
                <td>$${resumen[mes].compras}</td>
            </tr>
        `;
    }

    html += "</tbody></table>";
    tablaTotalesMes.innerHTML = html;
}

// Función utilitaria para agrupar elementos por una propiedad y sumar otra
function agruparPor(arr, propiedad, sumarCampo) {
    const resultado = {};

    for (const item of arr) {
        let clave = propiedad === "mes"
            ? item.fecha.slice(0, 7) // extrae YYYY-MM si es por mes
            : item[propiedad];

        if (!clave) continue;

        if (!resultado[clave]) {
            resultado[clave] = 0;
        }

        resultado[clave] += Number(item[sumarCampo]);
    }

    return resultado;
}

// Devuelve el ID o clave con el valor más alto
function obtenerIdConMayorValor(obj) {
    let max = 0;
    let idMax = null;

    for (const id in obj) {
        if (obj[id] > max) {
            max = obj[id];
            idMax = id;
        }
    }

    return idMax;
}
