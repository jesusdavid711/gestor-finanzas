const formCategoria = document.getElementById("form-categoria");
const inputNombre = document.getElementById("nombre-categoria");
const listaCategorias = document.getElementById("lista-categorias") //el get es para trar unir al html por los id

const API_URL = "http://localhost:3000/categorias" 

let categoriaEditando = null ;// ID si estamos en modo edición

document.addEventListener('DOMContentLoaded', cargarCategorias); //casptura la pagina al momento de la funcion se inserte


async function cargarCategorias() {


}