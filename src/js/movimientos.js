//CRUD
let endpointCategories = "http://localhost:3000/categories";
let endpointMovimientos = "http://localhost:3000/movimientos";

// crear un nuevo movimiento:
const formMovimientos = document.getElementById("form-movimiento");
const tbodyMovimientos = document.getElementById("tbody-movimientos");
let selectCategorias = formMovimientos.categoria;

document.addEventListener("DOMContentLoaded", function () {
    pintarCategorias();
    pintarMovimientos();
});

formMovimientos.addEventListener("submit", function (event) {
    event.preventDefault();

    const newMovimiento = {
        tipo: formMovimientos.tipo.value,
        descripcion: formMovimientos.descripcion.value,
        importe: formMovimientos.importe.value,
        fecha: formMovimientos.fecha.value,
        categoryId: formMovimientos.categoria.value,
    };

    crearUnNuevoMovimiento(newMovimiento);
    formMovimientos.reset();
});

// pintarCategorias
async function pintarCategorias() {
    selectCategorias.innerHTML = "";

    let response = await fetch(endpointCategories);
    let data = await response.json();

    if (data.length === 0) {
        selectCategorias.innerHTML += `
            <option disabled>Sin Categorias, por favor registre almenos una</option>
        `;
    }

    data.forEach((categoria) => {
        selectCategorias.innerHTML += `
            <option value="${categoria.id}">${categoria.nombre}</option>
        `;
    });
}
//pintar los moviminetos en la tabla
async function pintarMovimientos() {
    let movimientos = await traerMovimientos();

    tbodyMovimientos.innerHTML = "";

    for (const movimiento of movimientos) {
        tbodyMovimientos.innerHTML += `
        <tr>
            <td>${movimiento.tipo}</td>
            <td>${movimiento.descripcion}</td>
            <td>${movimiento.importe}</td>
            <td>${movimiento.fecha}</td>
            <td>${movimiento.category === undefined ? "la categoria fue eliminadad" : movimiento.category.nombre
            }
            </td>
            <td>
            <button class="btn-editar" data-id="${movimiento.id
            }">Editar</button>
            <button class="btn-eliminar" data-id="${movimiento.id
            }">Eliminar</button>
            </td>
        </tr>
        `;
    }
}

// crear un nuevo movimiento
async function crearUnNuevoMovimiento(newMovimiento) {
    let response = await fetch(endpointMovimientos, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(newMovimiento),
    });

    if (response.ok) {
        alert("movimiento guardado con exito");
    }

    pintarMovimientos();
}

// traer llamar a los movimiento de la base de datos
async function traerMovimientos() {
    let response = await fetch(`${endpointMovimientos}?_embed=category`);
    let data = await response.json();

    return data;
}
