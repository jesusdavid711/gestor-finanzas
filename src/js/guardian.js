function checkSession (){
    let existUser = localStorage.getItem("currentUser")

    if ( checkUser === null){
        window.location.href="/"
    }

    
}
// es un guardian que hace que las listas sen privadas, y si solo si , me muestre el resto solo si ya esta iniciado 