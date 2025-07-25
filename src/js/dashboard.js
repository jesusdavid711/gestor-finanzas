const btnLogout = document.getElementById("logout-btn")

btnLogout.addEventListener("click", function(){

    localStorage.removeItem("currentUser")
    window.location.href = "/"

})