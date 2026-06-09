const token = localStorage.getItem("token");

let reportedUserId;

document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        window.location.href = "/login/login.html";
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");
    reportedUserId = user_id;

    if (!user_id) {
        alert("User not found");
        return;
    }

    try {
        const user_res = await fetch(`/api/user/${user_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const user = await user_res.json();


        document.querySelector(".username").innerText = user.full_name;
        document.querySelector(".email").innerText = user.email;
        document.querySelector(".about-text").innerText = user.bio || "No bio available";
        document.querySelector(".regi_num").innerText = user.regi_num;
        document.querySelector(".dept").innerText = user.dept;
        document.querySelector(".skill-text").innerText = user.skills || "No skills added";


        const post_res = await fetch(`/api/posts/user/${user_id}`);
        const posts = await post_res.json();

        const container = document.getElementById("post-container");
        container.innerHTML = "";

        if (posts.length === 0) {
            container.innerHTML = "<h3>No posts available</h3>";
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

                </div>
            `;
        });

    } catch (err) {
        console.log(err);
    }

});

document.getElementById("openReportForm").addEventListener("click", () => {
    document.getElementById("reportForm").classList.toggle("hidden");
});

document.getElementById("submitReportBtn").addEventListener("click", async () => {
    const reason = document.getElementById("reportReason").value.trim();
    const description = document.getElementById("reportDescription").value.trim();

    if (!reason || !description) {
        alert("Please fill out all report fields");
        return;
    }

    try {
        const res = await fetch("/api/reports/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                reported_user_id: reportedUserId,
                reason: reason,
                description: description
            })
        });

        const data = await res.json();

        alert(data.message);

        if (res.ok) {
            document.getElementById("reportReason").value = "";
            document.getElementById("reportDescription").value = "";
            document.getElementById("reportForm").classList.add("hidden");
        }

    } catch (err) {
        console.log(err);
        alert("Failed to submit report");
    }
});





const myProjectsBtn = document.getElementById("myProjectsBtn");
const projectModal = document.getElementById("projectModal");
const closeProjectBtn = document.getElementById("closeProjectBtn");
const projectContainer = document.getElementById("projectContainer");

myProjectsBtn.addEventListener("click",loadProjects);

closeProjectBtn.addEventListener("click", () => {
        projectModal.classList.add("hidden");
    }
);



async function loadProjects(){

    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");

    projectModal.classList.remove("hidden");

    try {
        const res = await fetch(`/api/projects/user/${user_id}`,
            {
                headers: {
                    Authorization:
                    `Bearer ${token}`
                }
            }
        );

        const projects = await res.json();
        projectContainer.innerHTML = "";
        projects.forEach(project => {
            projectContainer.innerHTML += `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <p><b>Tech Stack:</b> ${project.tech_stack}</p>
                <a href="${project.github_link}" target="_blank" class="github-btn"> GitHub Repo</a>
            </div>
            `;
        });
    } catch(err){
        console.log(err);
    }
}