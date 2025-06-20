// protects against logout reinitialization
let logoutInitialized = false;

function initSidebarMenu(skipRestore = false) {
    const menuButtons = document.querySelectorAll('.sidebar .menu li button');
    if (!menuButtons.length) return;

    // Assign click handlers to menu items
    menuButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if(button.id === 'logoutBtn') return;
            document.querySelectorAll('.sidebar .menu li').forEach(li => li.classList.remove('active'));
            button.parentElement.classList.add('active');
            localStorage.setItem('activeSidebarIndex', index);
        });
    });

    // Assign logout only once
    if (!logoutInitialized) {
        document.addEventListener('click', function (e) {
            const btn = e.target.closest('#logoutBtn');
            if (!btn) return;

            e.preventDefault();

            // Delete the saved tab
            // localStorage.removeItem('activeSidebarIndex');

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

        logoutInitialized = true;
    }

    // Restore the active menu item during loading
    if (!skipRestore) {
        const savedIndex = localStorage.getItem('activeSidebarIndex');

        if (savedIndex !== null && menuButtons[savedIndex]) {
            const targetButton = menuButtons[savedIndex];
            targetButton.parentElement.classList.add('active');

            // click to open previous active tab
            setTimeout(() => {
                targetButton.dispatchEvent(new Event('click'));
            }, 50);
        }
    }
}

initSidebarMenu();

// Looking at DOM changes
const observer = new MutationObserver(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        initSidebarMenu(true); // Do not download content again
    }
});

observer.observe(document.body, { childList: true, subtree: true });
