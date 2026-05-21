document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login/login.html";
        return;
    }
    try {
        const res = await fetch("/api/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = "/login/login.html";
            return;
        }

        const data = await res.json();

        document.getElementById("UserName").innerText =  data.user.full_name;

        const fullName = data.user.full_name;

        const nameParts = fullName.trim().split(" ");

        let initials = "";

        nameParts.forEach(part => {
            initials += part[0];
        });

        document.getElementById("sidebarAvatar").innerText = initials.toUpperCase();

        document.getElementById("profile-link").addEventListener("click", () => {
                window.location.href ="/profile/profile.html";
        });

    }catch (err) {
        console.log(err);
    }
});