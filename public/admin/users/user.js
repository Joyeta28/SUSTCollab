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

        loggedInUserID = data.user.id;
        getAllUsers();

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





async function getAllUsers() {
    try {
        const res = await fetch("http://localhost:3001/api/user/users",{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        
        const users = await res.json();


        const container = document.getElementById("user-container");

        container.innerHTML = "";


        users.forEach(user => {
            container.innerHTML += `
                <div class="user-card">
                    <div class="user-header">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" class="profile-pic">

                        <div>
                            <h3>${user.full_name}</h3>
                            <small id="email-${user.email}">Email: ${user.email}</small>
                        </div>

                    </div>

                    <h3 class="bio">Bio</h3>
                    <p class="description">${user.bio || "No bio available"}</p>
                    

                    <div class="buttons">
                        <a href="/admin/userDetails/userDetails.html?id=${user.id}" class="profile-btn">View Profile</a>
                        
                    </div>

                </div>`;
        });

    } catch (error) {
        console.log(error);
    }
}

getAllUsers();
