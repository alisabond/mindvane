document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    //const themeSwitch = document.getElementById("theme-switch");
    //const themeIcon = document.querySelector("#theme-icon i");

    // form toggle
    loginBtn.addEventListener("click", () => {
        loginForm.classList.add("active");
        registerForm.classList.remove("active");
        loginBtn.classList.add("active");
        registerBtn.classList.remove("active");
        clearErrors();
    });

    registerBtn.addEventListener("click", () => {
        registerForm.classList.add("active");
        loginForm.classList.remove("active");
        registerBtn.classList.add("active");
        loginBtn.classList.remove("active");
        clearErrors();
    });

    // // switch themes
    // themeSwitch.addEventListener("change", () => {
    //     // document.body.classList.toggle("dark-theme");
    //     // themeIcon.classList.toggle("fa-sun");
    //     // themeIcon.classList.toggle("fa-moon");
    //     const isDark = document.body.classList.toggle("dark-theme");
    //     themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    // });

    // validation login form
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();

        const [username, password] = loginForm.querySelectorAll("input");
        let isValid = true;

        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.value)) {
            showError(username, "Login must contain from 3 to 20 characters (letters, numbers, _).");
            isValid = false;
        }

        if (!/^.{6,}$/.test(password.value)) {
            showError(password, "Password must be at least 6 characters long.");
            isValid = false;
        }

        if (isValid) {
            window.location.href = "index.html";
        }
    });

    // validation registration form
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();

        const [username, email, password] = registerForm.querySelectorAll("input");
        let isValid = true;

        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.value)) {
            showError(username, "Login must contain from 3 to 20 characters (letters, numbers, _).");
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, "Please enter a valid email!");
            isValid = false;
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.value)) {
            showError(password, "Password must contain letters and numbers, minimum 6 characters.");
            isValid = false;
        }

        if (isValid) {
            window.location.href = "index.html";
        }
    });

    // show error messages
    function showError(input, message) {
        const error = document.createElement("div");
        error.className = "error-message";
        error.textContent = message;
        input.classList.add("input-error");
        input.parentNode.insertBefore(error, input.nextSibling);
    }

    // delete error messages
    function clearErrors() {
        document.querySelectorAll(".error-message").forEach(e => e.remove());
        document.querySelectorAll(".input-error").forEach(i => i.classList.remove("input-error"));
    }
});
