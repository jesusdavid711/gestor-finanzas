document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Credenciales de ejemplo (reemplazar por validación real)
  const user = "admin";
  const pass = "1234";

  if (username === user && password === pass) {
    alert("¡Bienvenido!");
    // Redirigir o continuar
  } else {
    document.getElementById("errorMsg").textContent = "Usuario o contraseña incorrectos";
  }
});
async function capturarBaseDatos() {
    const nameAdmin = await fetch("http://localhost:3000/users",{
      method:"GET",
      headers: {
        "content-type":"application/json"
      },
    })
}
//se debe ver o cambiar si todavia sirve para agregar