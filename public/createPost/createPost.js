document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const teamSize = parseInt(document.getElementById("teamSize").value);

    if(teamSize <= 0) {
        alert("Team Size must be greater than zero!");

        return;
    }

    const postData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        required_skills: document.getElementById("skills").value,
        team_size: teamSize,
        course_title: document.getElementById("course").value,
        semester: document.getElementById("semester").value
    
    };

    try {
        const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        const data = await res.json();

        if (res.ok) {
            alert("Post created successfully!");
            window.location.href = "/homepage/home.html";
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.log(err);
        alert("Error creating post");
    }
});