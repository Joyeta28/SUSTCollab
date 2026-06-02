const token = localStorage.getItem("token");
const userSearchInput = document.getElementById("userSearchInput");
const userList = document.getElementById("userList");

if (!token) {
    window.location.href = "/login/login.html";
}

async function searchUsers() {
    const searchText = userSearchInput.value.trim();

    if (!searchText) {
        userList.innerHTML = `<p class="empty-message">Type a name to search users.</p>`;
        return;
    }

    try {
        const res = await fetch(`/api/user/search?search=${encodeURIComponent(searchText)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = "/login/login.html";
            return;
        }

        const users = await res.json();

        displayUsers(users);

    } catch (err) {
        console.log(err);
    }
}

function displayUsers(users) {
    userList.innerHTML = "";

    if (users.length === 0) {
        userList.innerHTML = `<p class="empty-message">No users found.</p>`;
        return;
    }

    users.forEach(user => {
        userList.innerHTML += `
            <div class="user-card"onclick="openUserProfile(${user.id})">
                <div class="avatar">
                    ${getInitials(user.full_name)}
                </div>

                <div class="user-info">
                    <h3>${user.full_name}</h3>
                    <p><b>Email:</b> ${user.email}</p>
                    <p><b>Department:</b> ${user.dept || "Not added"}</p>
                    <p><b>Registration:</b> ${user.regi_num || "Not added"}</p>
                    <p><b>Skills:</b> ${user.skills || "No skills added"}</p>
                    <p><b>Bio:</b> ${user.bio || "No bio added"}</p>
                </div>
            </div>
        `;
    });
}

function openUserProfile(userId) {
    window.location.href = `/user/userProfile.html?id=${userId}`;
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

userSearchInput.addEventListener("input", searchUsers);

searchUsers();