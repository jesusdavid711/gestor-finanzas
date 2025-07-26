

const formCategoria = document.getElementById("form-categoria");
const inputNombre = document.getElementById("nombre-categoria");
const listaCategorias = document.getElementById("lista-categorias"); //el get es para trar unir al html por los id

const API_URL = "http://localhost:3000/categories";



let categoriaEditando = null ;// ID si estamos en modo edición

document.addEventListener('DOMContentLoaded', cargarCategorias); //casptura la pagina al momento de la funcion se inserte


async function cargarCategorias() {
    listaCategorias.innerHTML = '';

    try {
        const res = await fetch(API_URL);
        const categorias = await res.json();

        categorias.forEach(categoria => {

            const li = document.createElement('li');
            li.innerHTML = `
                <span>${categoria.nombre}</span>
                <div>
                    <button class="btn-editar" data-id="${categoria.id}" data-nombre="${categoria.nombre}">Editar</button>
                    <button class="btn-eliminar" data-id="${categoria.id}">Eliminar</button>
                </div>`;
            listaCategorias.appendChild(li);
        });
    } catch (err) {
        console.error('Error al cargar categorías', err);
    }
}

// 2. Agregar o actualizar categoría
formCategoria.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = inputNombre.value.trim();

  if (!nombre) return alert('El nombre no puede estar vacío');

  try {
    if (categoriaEditando) {
      // Actualizar
      await fetch(`${API_URL}/${categoriaEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
      categoriaEditando = null;
    } else {
      // Crear
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
    }

    formCategoria.reset();
    cargarCategorias();
  } catch (err) {
    console.error('Error al guardar categoría', err);
  }
});

// 3. Delegación de eventos para Editar y Eliminar
listaCategorias.addEventListener('click', async (event) => {

  if (event.target.classList.contains('btn-editar')) {

    const id = event.target.dataset.id;
    const nombre = event.target.dataset.nombre;
    inputNombre.value = nombre;
    categoriaEditando = id;
  }

  if (event.target.classList.contains('btn-eliminar')) {
    const id = event.target.dataset.id;

    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarCategorias();
      } catch (err) {
        console.error('Error al eliminar', err);
      }
    }
  }

  console.log("la cajita esta:",categoriaEditando);
});