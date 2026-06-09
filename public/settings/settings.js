const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login/login.html";
}

document.getElementById("changePasswordBtn")
.addEventListener("click", async () => {
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill out all fields");
        return;
    }

    try {
        const res = await fetch("/api/settings/change-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword
            })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        }

    } catch (err) {
        console.log(err);
        alert("Failed to change password");
    }
});


const requestNotifications = document.getElementById("requestNotifications");
const projectNotifications = document.getElementById("projectNotifications");
const reportNotifications = document.getElementById("reportNotifications");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");

async function loadSettings() {
    try {
        const res = await fetch("/api/settings", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const settings = await res.json();

        requestNotifications.checked = Boolean(settings.request_notifications);
        projectNotifications.checked = Boolean(settings.project_notifications);
        reportNotifications.checked = Boolean(settings.report_notifications);

    } catch (err) {
        console.log(err);
    }
}

saveSettingsBtn.addEventListener("click", async () => {
    try {
        const res = await fetch("/api/settings", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                request_notifications: requestNotifications.checked,
                project_notifications: projectNotifications.checked,
                report_notifications: reportNotifications.checked
            })
        });

        const data = await res.json();
        alert(data.message);

    } catch (err) {
        console.log(err);
        alert("Failed to update settings");
    }
});

loadSettings();
