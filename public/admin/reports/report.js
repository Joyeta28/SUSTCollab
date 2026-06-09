const token = localStorage.getItem("token");

let loggedInUserID;

document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        window.location.href = "/login/login.html";
        return;
    }
    try {
        const res = await fetch("/api/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            window.location.href = "/login/login.html";
            return;
        }

        

        const data = await res.json();

        document.getElementById("UserName").innerText =  data.user.full_name;

        const fullName = data.user.full_name;

        const nameParts = fullName.trim().split(" ");

        let initials = "";

        nameParts.forEach(part => {
            initials += part[0];
        });

        document.getElementById("sidebarAvatar").innerText = initials.toUpperCase();

        loggedInUserID = data.user.id;

        loadReports();

    }catch (err) {
        console.log(err);
    }
});

document.getElementById("logout-btn")
.addEventListener("click", () => {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");

    window.location.href = "/login/login.html";
});





async function loadReports(){
    try{
        const res = await fetch("http://localhost:3001/api/reports", {
            headers: {"Authorization": `Bearer ${token}`}
        });
        const reports = await res.json();

        const tableBody = document.getElementById("reportBody");
        tableBody.innerHTML = "";

        if(reports.length === 0){
            tableBody.innerHTML = `<tr>
                                        <td colspan="6">
                                            No reports found
                                        </td>
                                    </tr>`;

            return;
        }

        reports.forEach(report => {
            tableBody.innerHTML += `<tr>
                                        <td>${report.reporter_name}</td>
                                        <td>${report.reported_user_name}</td>
                                        <td>
                                            <a href="/admin/userDetails/userDetails.html?id=${report.reported_user_id}" class="profile-link">View Profile</a>
                                        </td>
                                        <td>${report.reason}</td>
                                        <td><span class="status ${report.status.toLowerCase()}">${report.status}</span></td>
                                        <td><button class="details-btn" onclick="viewReport(${report.id})">View Detail</button></td>
                                    </tr>`;
        });

    } catch (err) {
        console.log(err);
    }
}




function viewReport(reportId) {
    window.location.href = `/admin/reportDetails/reportDetails.html?id=${reportId}`;
}