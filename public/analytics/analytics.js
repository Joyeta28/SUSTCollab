const token = localStorage.getItem("token");

let loggedInUserID;

document.addEventListener("DOMContentLoaded", async () => {
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

        loggedInUserID = data.user.id;

        loadAnalytics();

    }catch (err) {
        console.log(err);
    }
});

document.getElementById("logout-btn")
.addEventListener("click", () => {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");

    window.location.href = "/login/login.html";
});


document.getElementById("delete-account")
.addEventListener("click", async () => {

    const confirmDelete = confirm(
        "Are you sure you want to delete your account?"
    );

    if(!confirmDelete) return;
    try {
        const res = await fetch("/api/user/delete", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        alert(data.message);
        localStorage.removeItem("token");
        window.location.href = "/login/login.html";

    }catch (err) {
        console.log(err);
    }
    document.getElementById("UserName").innerText =
        data.user.full_name;
});




async function loadAnalytics() {
    try {
        const res = await fetch(
            "/api/analytics/postCount",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        document.getElementById("total-posts").innerText =
            data.totalPosts;

    } catch (err) {
        console.log(err);
    }
}

