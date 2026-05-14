const API = "/api/auth"

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const full_name = document.getElementById("full_name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPass = document.getElementById("con_password").value

    if (password !== confirmPass) {
        alert("Password do not match");
        return
    }
    const res = await fetch(`${API}/register`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            full_name,
            email,
            password
        })
    })
    const data = await res.json()
    alert(data.message)
}
)

