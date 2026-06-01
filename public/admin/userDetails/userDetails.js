const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        window.location.href = "/login/login.html";
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");

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