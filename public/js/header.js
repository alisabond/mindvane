const themeSwitch = document.getElementById("theme-switch");
const themeIcon = document.querySelector("#theme-icon i");
const avatarBlock = document.querySelector('.avatar');
const avatarIcon = document.getElementById('avatar-icon');
const avatar = document.querySelector('.avatar');
const avatarMenu = document.getElementById('avatar-menu');

// switch themes
themeSwitch.addEventListener("change", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
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

