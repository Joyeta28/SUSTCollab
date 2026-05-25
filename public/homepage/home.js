document.addEventListener("DOMContentLoaded", async ()=> {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/user", {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    });

    if (res.status === 401) {
        window.location.href = "/login/login.html";
        return;
    }

    const data = await res.json();

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
                            <small> Status: ${post.status}</small>
                        </div>

                    </div>

                    <h3 class="post-title">${post.title}</h3>
                    <p class="description">${post.description}</p>

                    <p><b>Catagory: </b>${post.category}</p>
                    <p><b>Team Size: </b>${post.team_size}</p>
                    <p class="skills"><b>Skills: </b> ${post.required_skills}</p>

                    <div class="buttons">
                        <button class="details-btn">View Details</button>
                        <button class="request-btn">Send Request</button>
                    </div>

                </div>`;
        });

    } catch (error) {
        console.log(error);
    }
}

loadPosts();