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

        const res = await fetch("/api/user/profile", {
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
        bioInput.value ="";
    });

    editSkillBtn.addEventListener("click", () => {
        skillEditBox.classList.toggle("hidden");
        skillInput.value = user.skills || "";
    });


saveBioBtn.addEventListener("click", async () => {

    user.bio = bioInput.value;

    await fetch("/api/user/profile", {
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

    await fetch("/api/user/profile", {
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
});