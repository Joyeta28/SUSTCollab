const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {



    if (!token) {
        window.location.href = "/login/login.html";
        return;
    }

    const username = document.querySelector(".username");
    const email = document.querySelector(".email");
    const bio = document.querySelector(".about-text");
    const regi_num = document.querySelector(".regi_num");
    const dept = document.querySelector(".dept");
    const skillsContainer = document.querySelector(".skills");
    const avatar = document.querySelector(".profile-avatar");

    const editBioBtn = document.querySelector(".edit-bio-btn");
    const editSkillBtn = document.querySelector(".edit-skill-btn");

    const bioEditBox = document.querySelector(".bio-edit-box");
    const skillEditBox = document.querySelector(".skill-edit-box");

    const bioInput = document.querySelector(".bio-input");
    const skillInput = document.querySelector(".skill-input");

    const saveBioBtn = document.querySelector(".save-bio-btn");
    const saveSkillBtn = document.querySelector(".save-skill-btn");



    let user = {};

    try {

        const res = await fetch("http://localhost:3001/api/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        user = data.user;

        username.innerText = user.full_name || "No Name";
        email.innerText = user.email || "No Email";
        regi_num.innerText = user.regi_num || "None";
        dept.innerText = user.dept || "None";
        bio.innerText = user.bio ? user.bio : "+ Add Description";
        skillsContainer.innerHTML = "";

        if (user.skills && user.skills.trim() !== "") {
            user.skills.split(",").forEach(skill => {
                const span = document.createElement("span");
                span.innerText = skill.trim();
                skillsContainer.appendChild(span);

            });
        } else {
            skillsContainer.innerHTML = "<span>+ Add Skills</span>";
        }

        if (user.full_name) {
            const nameParts = user.full_name.trim().split(" ");
            let initials = "";

            nameParts.forEach(part => {
                initials += part[0];
            });

            avatar.innerText = initials.toUpperCase();
        }

    } catch (err) {
        console.log(err);
    }


    editBioBtn.addEventListener("click", () => {
        bioEditBox.classList.toggle("hidden");
        bioInput.value = "";
    });

    editSkillBtn.addEventListener("click", () => {
        skillEditBox.classList.toggle("hidden");
        skillInput.value = user.skills || "";
    });


    saveBioBtn.addEventListener("click", async () => {

        user.bio = bioInput.value;

        await fetch("http://localhost:3001/api/user/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                full_name: user.full_name || "",
                bio: user.bio || "",
                skills: user.skills || ""
            })
        });

        bio.innerText = user.bio;

        bioEditBox.classList.add("hidden");
    });



    saveSkillBtn.addEventListener("click", async () => {

        user.skills = skillInput.value;

        await fetch("http://localhost:3001/api/user/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                full_name: user.full_name || "",
                bio: user.bio || "",
                skills: user.skills || ""
            })
        });

        skillsContainer.innerHTML = "";

        user.skills.split(",").forEach(skill => {

            const span = document.createElement("span");

            span.innerText = skill.trim();

            skillsContainer.appendChild(span);
        });

        skillEditBox.classList.add("hidden");
    });

    async function loadPosts() {
        try {
            const res = await fetch(
                "http://localhost:3001/api/posts/my-posts",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
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
                    <p class="description">
                        ${post.description}
                    </p>
                    <p><b>Category:</b> ${post.category}</p>
                    <p><b>Team Size:</b> ${post.team_size}</p>
                    <p class="skills">
                        <b>Skills:</b> ${post.required_skills}
                    </p>

                    <div class="buttons">
                        <a href="/postDetails/postDetails.html?id=${post.id}" class="details-btn">View Details</a>
                        <!--<button class="request-btn">See Requests</button>-->
                    </div>
                </div>
            `;
            });

        } catch (error) {
            console.log(error);
        }
    }

    loadPosts();
});





function showMenu(post) {
    /*if(post.user_id
        !== loggedInUserID){
        return "";
    }*/
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
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
            document.getElementById(`status-${id}`).innerText = `Status: ${newStatus}`;
        }

    } catch (error) {
        console.log(error);
    }
}

const viewRequestsBtn =
    document.getElementById("viewRequestsBtn");
    const requestModal = document.getElementById("requestModal");
    const closeRequestBtn = document.getElementById("closeRequestBtn");

    viewRequestsBtn.addEventListener("click",loadRequests);

    closeRequestBtn.addEventListener("click", () => {
        requestModal.classList.add("hidden");
    }
);


async function loadRequests() {
    requestModal.classList.remove("hidden");
    try {
        const res = await fetch("/api/requests/my-requests",{
                headers: {
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const requests = await res.json();
        requestTableBody.innerHTML = "";

        requests.forEach(req => {
            requestTableBody.innerHTML += `
            <tr>
                <td>${req.post_code}</td>
                <td>${req.full_name}</td>
                <td>
                    <a href="/profile/userProfile.html?id=${req.user_id}" class="profile-link-btn">View Profile</a>
                </td>
                <td>${req.status}</td>
                <td>
                    <button class="accept-btn" onclick="acceptRequest(${req.id})"> Accept </button>
                </td>
            </tr>`;
        });

    } catch (error) {
        console.log(error);
    }
}

async function acceptRequest(requestId) {
    try {
        const res = await fetch(`/api/requests/accept/${requestId}`,{
                method: "PUT", 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await res.json();
        alert(data.message);
        loadRequests();
    } catch (error) {
        console.log(error);
    }
}