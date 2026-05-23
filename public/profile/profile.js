document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

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
    const editBtn = document.querySelector(".edit-btn");

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


    editBtn.addEventListener("click", async () => {

        const newName = prompt("Full Name:", user.full_name);
        const newBio = prompt("Bio:", user.bio || "");
        const newSkills = prompt("Skills (comma separated):", user.skills || "");

        if (newName) user.full_name = newName;
        user.bio = newBio;
        user.skills = newSkills;

        await fetch("http://localhost:3001/api/user/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                full_name: user.full_name,
                bio: user.bio,
                skills: user.skills
            })
        });

        alert("Profile Updated!");
        location.reload();
    });

});