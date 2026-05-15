document.addEventListener("DOMContentLoaded", async ()=> {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/user", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = "/login/login.html";
        return;
    }

    const data = await res.json();

    document.getElementById("UserName").innerText =
        data.user.full_name;
});