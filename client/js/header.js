const themeSwitch = document.getElementById("theme-switch");
const themeIcon = document.querySelector("#theme-icon i");
const avatarBlock = document.querySelector('.avatar');
const avatarIcon = document.getElementById('avatar-icon');
const avatar = document.querySelector('.avatar');
const avatarMenu = document.getElementById('avatar-menu');
const logoutBtn = document.getElementById("logoutBtn");

// set theme
const savedTheme = localStorage.getItem("theme");
const isDark = savedTheme === "dark";
document.documentElement.classList.toggle("dark-theme", isDark);
themeIcon.classList.replace('fa-moon', isDark ? 'fa-sun' : 'fa-moon');

// switch themes
themeSwitch.checked = isDark;
themeSwitch.addEventListener("change", () => {
    const isDark = themeSwitch.checked;
    document.documentElement.classList.toggle("dark-theme", isDark);
    themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// hide avatar
if (window.location.pathname.includes('auth.html')) {
    avatarBlock.classList.add('hide');
} else {
    avatarBlock.classList.remove('hide');
}

// show/hide avatar menu
avatarIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarMenu.classList.toggle('show');
    avatar.classList.toggle('menu-open');

});

// close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!avatarMenu.contains(e.target) && !avatarIcon.contains(e.target)) {
        avatarMenu.classList.remove('show');
    }
});

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
}
