// check authorization
fetch('/api/protected', { credentials: 'include' })
    .then(res => {
        if (res.ok) {
            // Already logged in - redirect
            window.location.href = 'index.html';
        }
    });

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

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

        // if form is valid - do POST
        if (isValid) {
            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                })
            })
                .then(async res => {
                    if (res.ok) {
                        window.location.href = 'index.html';
                    } else {
                        const { message } = await res.json();
                        showError(password, message || 'Login failed.');
                    }
                })
                .catch(() => {
                    showError(password, 'Server error. Try again later.');
                });
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

        // if form is valid - do POST
        if (isValid) {
            fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value
                })
            })
                .then(async res => {
                    if (res.ok) {
                        alert('Registration successful! You can now log in.');
                        loginBtn.click(); // form toggle
                    } else {
                        const { message } = await res.json();
                        showError(password, message || 'Registration failed.');
                    }
                })
                .catch(() => {
                    showError(password, 'Server error. Try again later.');
                });
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
