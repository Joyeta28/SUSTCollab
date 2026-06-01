async function loadPost(){
    const params = new URLSearchParams(window.location.search);

    const post_id = params.get("id");

    try{
        const res = await fetch(`/api/posts/${post_id}`);
        const post = await res.json();

        document.getElementById("postDetails").innerHTML = `
                <div class="post-card">
                    <div class="post-header">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" class="profile-pic">

                        <div>
                            <h3 class="userName">${post.full_name}</h3>
                            <small>Status: ${post.status}</small>
                        </div>

                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p><b>Post Code:</b> ${post.post_code}</p>
                    <p class="description">${post.description}</p>

                    <p><b>Catagory: </b>${post.category}</p>
                    <p><b>Team Size: </b>${post.team_size}</p>
                    <p class="skills"><b>Skills: </b> ${post.required_skills}</p>

                </div>`;

    } catch(error){
        console.log(error);
    }
}

loadPost();