async function loadAnalytics() {

    const token = localStorage.getItem("token");

    const sentRes = await fetch(
        "/api/analytics/total-sent",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const sentData = await sentRes.json();

    document.getElementById("totalSent").innerText =
        sentData.total_sent;


    const acceptedRes = await fetch(
        "/api/analytics/total-accepted",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const acceptedData = await acceptedRes.json();

    document.getElementById("totalAccepted").innerText =
        acceptedData.total_accepted;
}

loadAnalytics();