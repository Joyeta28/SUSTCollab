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

        loadPosts();

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


async function loadPosts() {
    try {
        const res = await fetch("http://localhost:3001/api/posts");
        const posts = await res.json();
        const container = document.getElementById("post-container");

        container.innerHTML = "";

        posts.forEach(post => {
            container.innerHTML += `
                <div class="post-card">
                    <div class="post-header">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" class="profile-pic">

                        <div>
                            <h3>${post.full_name}</h3>
                            <small id="status-${post.id}">Status: ${post.status}</small>
                        </div>
                        ${showMenu(post)}

                    </div>

                    <h3 class="post-title">${post.title}</h3>
                    <p class="description">${post.description}</p>

                    <p><b>Catagory: </b>${post.category}</p>
                    <p><b>Team Size: </b>${post.team_size}</p>
                    <p class="skills"><b>Skills: </b> ${post.required_skills}</p>

                    <div class="buttons">
                        <a href="/postDetails/postDetails.html?id=${post.id}" class="details-btn">View Details</a>
                        ${
                            post.user_id === loggedInUserID ? `<button class="request-btn">See Requests</button>` : 
                            `<button class="request-btn" id="requestbtn-${post.id}">Send Request</button>`
                        }
                    </div>

                </div>`;
        });

    } catch (error) {
        console.log(error);
    }
}

loadPosts();



function showMenu(post){
    if(post.user_id
        !== loggedInUserID){
        return "";
    }
    return `<div class="menu-container">
                <button class="menu-btn" onclick="toggleMenu(${post.id})"><i class="fa-solid fa-ellipsis-vertical"></i></button>

                <div id="menu-${post.id}" class="dropdown-menu">

                    <button onclick="updatePost(${post.id})">Update</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                    <button onclick="changeStatus(${post.id}, '${post.status}')">Change Status</button>

                </div>
            </div>`;
}


function toggleMenu(id) {
    const menu = document.getElementById(`menu-${id}`);
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}




async function changeStatus(id, currentStatus) {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
        const res = await fetch(`http://localhost:3001/api/posts/${id}/status`, {
            method: "PUT",
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            body: JSON.stringify({status: newStatus})
        });
        if(res.ok){
            document.getElementById(`status-${id}`).innerText = `Status: ${newStatus}`;
        }

    } catch(error){
        console.log(error);
    }
}