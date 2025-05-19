document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");
    const themeLabel = document.querySelector(".theme-toggle label");

    // activate saved theme
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    document.body.classList.toggle("dark", isDark);
    if (themeSwitch) themeSwitch.checked = isDark;
    if (themeLabel) themeLabel.textContent = isDark ? "☀️" : "🌙";

    // switch theme
    if (themeSwitch) {
        themeSwitch.addEventListener("change", () => {
            const isDarkMode = themeSwitch.checked;
            document.body.classList.toggle("dark", isDarkMode);
            themeLabel.textContent = isDarkMode ? "☀️" : "🌙";
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        });
    }
});
