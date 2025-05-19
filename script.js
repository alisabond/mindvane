document.getElementById("switchToRegister").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.add("active");
});

document.getElementById("switchToLogin").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("registerForm").classList.remove("active");
    document.getElementById("loginForm").classList.add("active");
});

document.getElementById("themeSwitcher").addEventListener("change", function () {
    document.body.classList.toggle("dark");
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "index.html";
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "index.html";
});
