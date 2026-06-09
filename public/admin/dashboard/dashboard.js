const token = localStorage.getItem("token");

let loggedInUserID;
let allPosts = [];

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




/*async function loadPosts() {
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
                        

                    </div>

                    <p><b>Post Code:</b> ${post.post_code}</p>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="description">${post.description}</p>
                    <p><b>Catagory: </b>${post.category}</p>
                    <p><b>Team Size: </b>${post.team_size}</p>
                    <p class="skills"><b>Skills: </b> ${post.required_skills}</p>

                    <div class="buttons">
                        <a href="/postDetails/postDetails.html?id=${post.id}" class="details-btn">View Details</a>
                       
                    </div>

                </div>`;
        });

    } catch (error) {
        console.log(error);
    }
}*/

async function loadPosts() {
    try {
        const res = await fetch("http://localhost:3001/api/posts");
        const posts = await res.json();
        allPosts = posts;
        renderPosts(allPosts);

    } catch (error) {
        console.log(error);
    }
}




function renderPosts(posts) {        
        const container = document.getElementById("post-container");

        container.innerHTML = "";

        if (posts.length === 0) {
            container.innerHTML = "<h3>No posts found</h3>";
            return;
        }

        posts.forEach(post => {
            container.innerHTML += `
                <div class="post-card">
                    <div class="post-header">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" class="profile-pic">

                        <div>
                            <h3>${post.full_name}</h3>
                            <small id="status-${post.id}">Status: ${post.status}</small>
                        </div>
                        

                    </div>

                    <p><b>Post Code:</b> ${post.post_code}</p>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="description">${post.description}</p>
                    <p><b>Catagory: </b>${post.category}</p>
                    <p><b>Team Size: </b>${post.team_size}</p>
                    <p class="skills"><b>Skills: </b> ${post.required_skills}</p>

                    <div class="buttons">
                        <a href="/postDetails/postDetails.html?id=${post.id}" class="details-btn">View Details</a>
                    </div>

                </div>`;
        });
}







function applyPostFilters() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;

    const filteredPosts = allPosts.filter(post => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchText) ||
            post.description.toLowerCase().includes(searchText) ||
            post.required_skills.toLowerCase().includes(searchText) ||
            post.full_name.toLowerCase().includes(searchText) ||
            post.post_code.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "" || post.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderPosts(filteredPosts);
}

document.getElementById("searchInput").addEventListener("input", applyPostFilters);
document.getElementById("categoryFilter").addEventListener("change", applyPostFilters);

loadPosts();



