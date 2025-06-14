/*const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                alert("You are logged out.");
                window.location.href = "auth.html";
            })
            .catch(err => {
                console.error("Logout error:", err);
                alert("Logout failed.");
            });
    });
}*/
