const API = "/api/auth"

document.getElementById("loginForm").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const res = await fetch(`${API}/login`,{
        method : "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    const data = await res.json()
    
    if(data.token){
        localStorage.setItem(
            "token",
            data.token
        )

        localStorage.setItem("user",JSON.stringify(data.user));

        if(data.user.role === "admin")
            window.location.href = "/admin/dashboard/dashboard.html";

        else window.location.href ="/homepage/home.html";
    }
    else{
        alert(data.message)
    }
})