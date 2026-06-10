async function loadMostUsedCategories() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/analytics/most-used-categories", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();

    const container = document.getElementById("categoryContainer");

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<h3>No category data found</h3>";
        return;
    }

    data.forEach(item => {
        container.innerHTML += `
            <div class="analytics-card">
                <h3>${item.category}</h3>
                <p>${item.total_posts}</p>
            </div>
        `;
    });
}

loadMostUsedCategories();