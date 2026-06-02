const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login/login.html";
}

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const username = document.querySelector(".username");
const email = document.querySelector(".email");
const bio = document.querySelector(".about-text");
const regiNum = document.querySelector(".regi_num");
const dept = document.querySelector(".dept");
const skillsContainer = document.querySelector(".skills");
const avatar = document.querySelector(".profile-avatar");

if (!userId) {
    username.innerText = "User not found";
} else {
    loadUserProfile(userId);
}

async function loadUserProfile(id) {
    try {
        const res = await fetch(`/api/user/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            username.innerText = data.message || "User not found";
            return;
        }

        const user = data.user;

        username.innerText = user.full_name || "No Name";
        email.innerText = user.email || "No Email";
        bio.innerText = user.bio || "No description added";
        regiNum.innerText = user.regi_num || "None";
        dept.innerText = user.dept || "None";

        skillsContainer.innerHTML = "";

        if (user.skills && user.skills.trim() !== "") {
            user.skills.split(",").forEach(skill => {
                const span = document.createElement("span");
                span.innerText = skill.trim();
                skillsContainer.appendChild(span);
            });
        } else {
            skillsContainer.innerHTML = "<span>No skills added</span>";
        }

        avatar.innerText = getInitials(user.full_name);

    } catch (err) {
        console.log(err);
        username.innerText = "Failed to load profile";
    }
}

function getInitials(name) {
    if (!name) return "?";

    return name
        .trim()
        .split(" ")
        .map(part => part[0])
        .join("")
        .toUpperCase();
}