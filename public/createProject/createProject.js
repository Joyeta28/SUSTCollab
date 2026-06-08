const token = localStorage.getItem("token");

document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const tech_stack = document.getElementById("techStack").value
    const github_link = document.getElementById("githubLink").value
    try {
        const res = await fetch("/api/projects/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    title,
                    description,
                    tech_stack,
                    github_link
                })
            }
        );

        const data = await res.json();
        alert(data.message);
        window.location.href = "/profile/profile.html";
    } catch(err){
        console.log(err);
    }
});