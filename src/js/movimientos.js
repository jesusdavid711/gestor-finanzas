// URLs de las APIs de json-server
let endpointCategories = "http://localhost:3000/categories";
let endpointMovimientos = "http://localhost:3000/movimientos";

// Referencias al formulario y a la tabla
const formMovimientos = document.getElementById("form-movimiento");
const tbodyMovimientos = document.getElementById("tbody-movimientos");
const selectCategorias = formMovimientos.categoria;

// Referencias a los filtros
const filtroTipo = document.getElementById("filtro-tipo");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroFechaInicio = document.getElementById("filtro-fecha-inicio");
const filtroFechaFin = document.getElementById("filtro-fecha-fin");
const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");

// Ejecutar funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    pintarCategorias(); // Cargar categorías
    pintarMovimientos(); // Mostrar movimientos
});

// Manejo del envío del formulario
formMovimientos.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita recargar la página

    // Obtener valores del formulario
    const movimiento = {
        tipo: formMovimientos.tipo.value,
        descripcion: formMovimientos.descripcion.value,
        importe: Number(formMovimientos.importe.value),
        fecha: formMovimientos.fecha.value,
        categoryId: formMovimientos.categoria.value,
    };

    // Verificar si es edición
    const idAEditar = formMovimientos.getAttribute("data-edit-id");

    if (idAEditar) {
        // Editar movimiento existente
        await fetch(`${endpointMovimientos}/${idAEditar}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movimiento),
        });
        alert("Movimiento actualizado correctamente");
        formMovimientos.removeAttribute("data-edit-id");
        formMovimientos.querySelector("button[type='submit']").textContent = "+ Agregar Movimiento";
    } else {
        // Crear nuevo movimiento
        await crearUnNuevoMovimiento(movimiento);
    }

    // Limpiar formulario y recargar tabla
    formMovimientos.reset();
    pintarMovimientos();
});

// Trae las categorías desde el servidor y las coloca en los select
async function pintarCategorias() {
    const response = await fetch(endpointCategories);
    const categorias = await response.json();

    // Inicializar los select con opción por defecto
    selectCategorias.innerHTML = `<option value="">-- Selecciona --</option>`;
    filtroCategoria.innerHTML = `<option value="">Categoría</option>`;

    // Agregar las opciones de categorías
    categorias.forEach(cat => {
        const option = `<option value="${cat.id}">${cat.nombre}</option>`;
        selectCategorias.innerHTML += option;
        filtroCategoria.innerHTML += option;
    });
}

// Trae los movimientos y los muestra aplicando filtros
async function pintarMovimientos() {
    const response = await fetch(endpointMovimientos);
    let movimientos = await response.json();

    // Obtener todas las categorías para relacionar los IDs
    const categorias = await (await fetch(endpointCategories)).json();

    // Relacionar cada movimiento con su nombre de categoría
    movimientos = movimientos.map(mov => {
        const categoria = categorias.find(cat => cat.id === mov.categoryId);
        return { ...mov, categoriaNombre: categoria ? categoria.nombre : "La categoría fue eliminada" };
    });

    // Obtener los valores de los filtros
    const tipo = filtroTipo.value;
    const categoriaId = filtroCategoria.value;
    const fechaInicio = filtroFechaInicio.value;
    const fechaFin = filtroFechaFin.value;

    // Aplicar filtros al array
    const filtrados = movimientos.filter(mov => {
        if (tipo && mov.tipo !== tipo) return false;
        if (categoriaId && mov.categoryId !== categoriaId) return false;
        if (fechaInicio && mov.fecha < fechaInicio) return false;
        if (fechaFin && mov.fecha > fechaFin) return false;
        return true;
    });

    // Mostrar los movimientos filtrados en la tabla
    tbodyMovimientos.innerHTML = "";

    filtrados.forEach(mov => {
        tbodyMovimientos.innerHTML += `
        <tr>
            <td>${mov.tipo}</td>
            <td>${mov.descripcion}</td>
            <td>$${mov.importe}</td>
            <td>${mov.fecha}</td>
            <td>${mov.categoriaNombre}</td>
            <td>
                <button class="btn-editar" data-id="${mov.id}">Editar</button>
                <button class="btn-eliminar" data-id="${mov.id}">Eliminar</button>
            </td>
        </tr>`;
    });
}

// Crea un nuevo movimiento
async function crearUnNuevoMovimiento(mov) {
    const response = await fetch(endpointMovimientos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mov),
    });

    if (response.ok) {
        alert("Movimiento guardado con éxito");
    }

    pintarMovimientos();
}

// Manejar clicks en la tabla para editar o eliminar
tbodyMovimientos.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.classList.contains("btn-eliminar")) {
        const id = target.dataset.id;
        if (confirm("¿Eliminar este movimiento?")) {
            await eliminarMovimiento(id);
            pintarMovimientos();
        }
    }

    if (target.classList.contains("btn-editar")) {
        const id = target.dataset.id;
        cargarMovimientoEnFormulario(id);
    }
});

// Elimina un movimiento por ID
async function eliminarMovimiento(id) {
    await fetch(`${endpointMovimientos}/${id}`, { method: "DELETE" });
}

// Cargar datos al formulario para editar un movimiento existente
async function cargarMovimientoEnFormulario(id) {
    const response = await fetch(`${endpointMovimientos}/${id}`);
    const mov = await response.json();

    // Llenar el formulario con los datos
    formMovimientos.tipo.value = mov.tipo;
    formMovimientos.descripcion.value = mov.descripcion;
    formMovimientos.importe.value = mov.importe;
    formMovimientos.fecha.value = mov.fecha;
    formMovimientos.categoria.value = mov.categoryId;

    // Marcar que estamos editando
    formMovimientos.setAttribute("data-edit-id", mov.id);
    formMovimientos.querySelector("button[type='submit']").textContent = "Guardar Cambios";
}

// Botón para limpiar filtros y recargar movimientos sin filtro
btnLimpiarFiltros.addEventListener("click", () => {
    filtroTipo.value = "";
    filtroCategoria.value = "";
    filtroFechaInicio.value = "";
    filtroFechaFin.value = "";
    pintarMovimientos();
});

// Cada vez que cambia un filtro, se recargan los movimientos
[filtroTipo, filtroCategoria, filtroFechaInicio, filtroFechaFin].forEach(input =>
    input.addEventListener("change", pintarMovimientos)
);
