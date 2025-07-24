const formLogin = document.getElementById("loginForm")


formLogin.addEventListener("submit", function (event){
    
    const inputUsername = formLogin.username.value;
    const inputPassword = formLogin.password.value;

    event.preventDefault()
})

async function login (inputUsername,inputPassword) { // se encarga de usar el login 
    let response =  await fetch(`http://localhost:3000/users?username=${inputUsername}`,)
    let data = response.json()

    if (data.length === 0){
        alert("credenciales incorrectas , revisa el usuario o la contraseña")
    }else{
        const userFound = data[0]
        
        if(userFound.password === inputPassword){

            localStorage.setItem("currentUser", JSON.stringify(userFound)) // el local storage la llave
            window.location.href ="dasboard.html"
            alert("login correcto")
        }else{
            alert("credenciales incorrectas , revisa el usuario o la contraseña")
        }
    }
}
