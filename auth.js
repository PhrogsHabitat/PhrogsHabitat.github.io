// Cookie Consent
document.addEventListener("DOMContentLoaded", function () {
    const cookieConsent = document.getElementById("cookie-consent");
    const acceptCookies = document.getElementById("accept-cookies");

    if (!getCookie("cookiesAccepted")) {
        cookieConsent.style.display = "block";
    }

    acceptCookies.addEventListener("click", function () {
        setCookie("cookiesAccepted", "true", 365);
        cookieConsent.style.display = "none";
    });
});

// Helper Functions for Cookies
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookieArr = document.cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0]) {
            return cookiePair[1];
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Toggle between Login and Signup
const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const toggleAuthLink = document.getElementById("toggle-auth-link");
const authBtn = document.getElementById("auth-btn");
const toggleAuthText = document.getElementById("toggle-auth");
let isLoginMode = true;

toggleAuthLink.addEventListener("click", function () {
    if (isLoginMode) {
        formTitle.textContent = "Sign Up";
        authBtn.textContent = "Sign Up";
        toggleAuthText.innerHTML = 'Already have an account? <a href="#" id="toggle-auth-link">Sign In</a>';
    } else {
        formTitle.textContent = "Sign In";
        authBtn.textContent = "Sign In";
        toggleAuthText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-auth-link">Sign Up</a>';
    }
    isLoginMode = !isLoginMode;
});

// Handle Authentication
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (isLoginMode) {
        // Handle Login
        if (username === "user" && password === "password") {
            setCookie("loggedInUser", username, 7); // Store user login for 7 days
            window.location.href = "PhrogMainLol.html"; // Redirect to main page
        } else {
            alert("Invalid username or password. Try again.");
        }
    } else {
        // Handle Signup (for demo purposes, this just logs the user in)
        setCookie("loggedInUser", username, 7);
        window.location.href = "PhrogMainLol.html";
    }
});

// Check Login Status on Page Load
document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = getCookie("loggedInUser");
    const profileSection = document.getElementById("profile-section");
    const profileUsername = document.getElementById("profile-username");
    const profileUsernameDetail = document.getElementById("profile-username-detail");
    const authForm = document.getElementById("auth-form");
    const logoutButton = document.getElementById("logout-button");


    // Check if user is logged in
    if (loggedInUser) {
        authForm.style.display = "none";
        profileSection.style.display = "block";
        profileUsername.textContent = loggedInUser;
        profileUsernameDetail.textContent = loggedInUser;
    } else {
        authForm.style.display = "block";
        profileSection.style.display = "none";
    }

    // Handle Logout
    logoutButton.addEventListener("click", function () {
        deleteCookie("loggedInUser");
        window.location.href = "PhrogMainLol.html"; // Redirect to main page
    });
});

// Close Auth Form
document.getElementById("close-auth-form").addEventListener("click", function () {
    authForm.style.display = "none";
});
