const token = localStorage.getItem("token");
const userSearchInput = document.getElementById("userSearchInput");
const userList = document.getElementById("userList");

let allUsers = [];

function normalizeName(name) {
    return (name || "").toLowerCase().trim().replace(/\s+/g, " ");
}

if (!token) {
    window.location.href = "/login/login.html";
}

async function loadUsers() {
    try {
        const res = await fetch("/api/user/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = "/login/login.html";
            return;
        }

        allUsers = await res.json();
        displayUsers(allUsers);

    } catch (err) {
        console.log(err);
        userList.innerHTML = "<p>Failed to load users.</p>";
    }
}

function searchUsers() {
    const searchText = userSearchInput.value.toLowerCase().trim();

    if (searchText === "") {
        displayUsers(allUsers);
        return;
    }

    const exactMatches = allUsers.filter(user => {
        return normalizeName(user.full_name) === normalizeName(searchText);
    });

    displayUsers(exactMatches);
    return;
}

function displayUsers(users) {
    userList.innerHTML = "";

    if (userSearchInput.value.trim() === "") {
    userList.innerHTML = "<p>Type a full name to search.</p>";
    return;
}

    if (users.length === 0) {
        userList.innerHTML = "<p>No users found.</p>";
        return;
    }

    users.forEach(user => {
        userList.innerHTML += `
            <div class="user-card" onclick="openUserDetails(${user.id})">
                <div class="avatar">${getInitials(user.full_name)}</div>

                <div class="user-info">
                    <div class="user-header">
                        <h3 class="user-name">${user.full_name}</h3>
                    </div>
                    <p><b>Email:</b> ${user.email}</p>                    
                </div>
            </div>
        `;
    });
}

function openUserDetails(userId) {
    window.location.href = `/user/userDetails/userDetails.html?id=${userId}`;
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

loadUsers();