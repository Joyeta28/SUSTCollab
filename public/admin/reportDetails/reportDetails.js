const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async()=>{
    const params =new URLSearchParams(window.location.search);
    const reportId = params.get("id");

    if (!reportId) {
        alert("Report not found");
        return;
    }

    try{
        const res = await fetch(`/api/reports/${reportId}`,{
                headers: {"Authorization": `Bearer ${token}`}
            }
        );

        const report = await res.json();

        document.getElementById("reporterName").innerText = report.reporter_name;
        document.getElementById("reportedUser").innerText = report.reported_user_name;
        document.getElementById("reason").innerText = report.reason;
        document.getElementById("createdAt").innerText = new Date(report.created_at).toLocaleString();
        document.getElementById("description").innerText = report.description;
        document.getElementById("statusSelect").value = report.status;
        document.getElementById("profileLink").href = `/admin/userDetails/userDetails.html?id=${report.reported_user_id}`;

    }catch(err){
        console.log(err);
    }

});


document.getElementById("updateBtn").addEventListener("click", async()=>{
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("id");

    const status = document.getElementById("statusSelect").value;

    try{
        const res = await fetch(`/api/reports/${reportId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({status})
            }
        );

        const data = await res.json();
        alert(data.message);
        location.reload();

    }catch(err){
        console.log(err);
    }

});