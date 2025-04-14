/* PLEASE NOTE: 

THANK YOU:

"Cory Knicely" - InfinitlyDumb

FOR SOME OF THE LOGIC USED ON THIS SCRIPT!

*/



document.addEventListener('DOMContentLoaded', function() {
    // Check if cookies have been accepted
    
    if (!getCookie('cookiesAccepted')) {
        // Show the cookie consent popup
        document.getElementById('cookie-consent').style.display = 'block';
    }

    // Event listener for the "Accept" button
    document.getElementById('accept-cookies').addEventListener('click', function() {
        // Set a cookie to indicate that cookies are accepted
        setCookie('cookiesAccepted', 'true', 365);

        // Hide the cookie consent popup lmfao, nobody wants to keep seeing this XD
        document.getElementById('cookie-consent').style.display = 'none';

        // Now set the 'motionReduced' cookie or check the previous state
        initializeMotionReducedCookie();
    });
});

function initializeMotionReducedCookie() {
    // Check if the "motionReduced" cookie exists; if not, set it to "false"
    if (!getCookie("motionReduced")) {
        console.log("No 'motionReduced' cookie found, setting it to 'false'");
        setCookie("motionReduced", "false", 365);
    } else {
        console.log("Found 'motionReduced' cookie: " + getCookie("motionReduced"));
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); // Expire in days
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/; SameSite=Lax;`;
    console.log(`Set cookie: ${cname}=${cvalue}; Expires in ${exdays} days`);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Debug to log current cookies
function logCookies() {
    console.log("Current cookies: " + document.cookie);
}

// Call to log cookies on page load
logCookies();


const animation_elements = document.querySelectorAll('.semiMid');
const vidNext = document.querySelectorAll('.vidNext');
const vidPrev = document.querySelectorAll('.vidPrev');
const element = document.getElementById('bound');
const element2 = document.getElementById('bound2');
const element3 = document.getElementById('motionBound');
const maddie = document.getElementById('maddie');

var count = 0;
var color = "rem rgb(255, 217, 0)";
var opacity = 0;

const videos = ["FridayPhrog", "SplatPhrog", "ScrollingPlaceHolder"];
var curSelected = 0;
var isDone = false;
var isHoverLeft = false;
var isHoverRight = false;

if (getCookie("motionReduced") == "true") {
    var reducedMotion = true;
    color = "rem rgb(255, 217, 0)";
    document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotionSel.png`);
    console.log("True");
} else if (getCookie("motionReduced") == "false") {
    var reducedMotion = false;
    color = "rem rgb(0, 255, 0)";
    document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotion.png`);
    console.log("False");
} else {
    setCookie("motionReduced", "false");
    var reducedMotion = false;
    color = "rem rgb(0, 255, 0)";
    document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotion.png`);
    console.log("False");
}

var velocity = 100;

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        } else {
            if (isDone == false) {
                entry.target.classList.remove('animate');
                isDone = true;
            }
        }
    })
}, {
    threshold: 0.5
});

for (let i = 0; i < animation_elements.length; i++) {
    const el = animation_elements[i];
    observer.observe(el);
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

element.addEventListener('mouseenter', () => {
    document.getElementById('prev').style.opacity = "1"; 
});

element.addEventListener('mouseleave', () => {
    document.getElementById('prev').style.opacity = "0.5";
});

element.addEventListener('mousedown', () => {
    console.log(curSelected);
    curSelected = curSelected - 1;
    if (curSelected < 0) {
        curSelected = videos.length - 1;
    }
    changeVideo(videos[curSelected]);
});

element2.addEventListener('mouseenter', () => {
    document.getElementById('next').style.opacity = "1"; 
});

element2.addEventListener('mouseleave', () => {
    document.getElementById('next').style.opacity = "0.5";
});

element2.addEventListener('mousedown', () => {
    console.log(curSelected);
    curSelected = curSelected + 1;
    if (curSelected > videos.length - 1) {
        curSelected = 0;
    }
    changeVideo(videos[curSelected]);
});

element3.addEventListener('mouseenter', () => {
    glowAnim("inc", motionTick);
});

element3.addEventListener('mouseleave', () => {
    glowAnim("dec", motionTick);
});

// Event listener for toggling reduced motion setting
element3.addEventListener('mousedown', () => {
    if (reducedMotion) {
        reducedMotion = false;
        color = "rem rgb(255, 217, 0)";
        document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotion.png`);
        setCookie("motionReduced", "false", 365); // Save to cookie with expiration
        console.log("Reduced motion set to false");
    } else {
        reducedMotion = true;
        color = "rem rgb(0, 255, 0)";
        document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotionSel.png`);
        setCookie("motionReduced", "true", 365); // Save to cookie with expiration
        console.log("Reduced motion set to true");
    }

    showPopupMessage(); // Trigger popup on toggle
});
function showPopupMessage() {
    const popup = document.getElementById('popup-message');
    clearTimeout(popup.hideTimeout);
    clearTimeout(popup.fadeOutTimeout);
    popup.style.display = 'block';
    popup.style.opacity = '0';
    popup.style.top = '0px';
    popup.style.left = '103vh';

    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.top = '190px';
    }, 50);

    popup.hideTimeout = setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.top = '0px';

        popup.fadeOutTimeout = setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 3000);
}

// Utility function to log current cookies
function logCookies() {
    console.log("Current cookies: " + document.cookie);
}

// Log cookies to ensure they are set and read properly
logCookies();

function glowAnim(type, el) {
    const elem = document.getElementById(String(el));

    if (type == "dec") {
        countDown(el);
    }

    if (type == "inc") {
        countUp(el);
    }
}

function countDown(eLol) {
    var interval = setInterval(function() {
        if (count > 0) {
            count -= 0.1;
            eLol.style.filter =  "drop-shadow(0 0 " + String(count) + String(color);
        } else {
            clearInterval(interval);
        }
    }, 30);
}

function countUp(eLol) {
    var interval = setInterval(function() {
        if (count < 1) {
            count += 0.1;
            eLol.style.filter =  "drop-shadow(0 0 " + String(count) + String(color);
        } else {
            clearInterval(interval);
        }
    }, 5);
}

function changeVideo(name) {
    const video = document.getElementById('video');
    const source = document.getElementById('source');
    const videoContainer = document.getElementById('video-container');

    if (!reducedMotion) {
        video.style.transition = "all 0.01s ease-out";
        video.style.transform = "translateX(50vh)";
        video.style.opacity = "0";

        setTimeout(() => {
            var inter = setInterval(() => {
                if (parseFloat(video.style.opacity) < 1) {
                    video.style.opacity = parseFloat(video.style.opacity) + 0.1;
                } else {
                    clearInterval(inter);
                }
            }, "100");

            video.style.transition = "all 0.4s ease-out";
            video.style.transform = "translateX(0vh)";
            video.style.transform = "rotate(4deg)";
        }, "100");
    }

    source.setAttribute('src', `assets/videos/${name}.mp4`);
    video.load();
}

function coordinate(event) {
    if (!reducedMotion) {
        let x = event.clientX;
        let y = event.clientY;
        document.getElementById("X").value = x;
        document.getElementById("Y").value = y;
    }
}

var divs = Array.prototype.slice.call(document.querySelectorAll('[data-range]'));

document.addEventListener('mousemove', function(e) {
    var easedX = e.pageX / window.innerWidth;
    var easedY = e.pageY / window.innerHeight;

    divs.forEach(function(div) {
        if (!reducedMotion) {
            var range = div.getAttribute('data-range').split(',');
            var min = parseFloat(range[0]);
            var max = parseFloat(range[1]);

            var easeX = min + (easedX * (max - min));
            var easeY = min + (easedY * (max - min));

            div.style.webkitTransform = 'translate(' + easeX + '%,' + easeY + '%)';
            div.style.transform = 'translate(' + easeX + '%,' + easeY + '%)';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const contributors = document.querySelectorAll('.smallBoi li');

    contributors.forEach(item => {
        const text = item.textContent;
        item.innerHTML = '';

        text.split('').forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.classList.add('smallChar');
            item.appendChild(span);
        });
    });
});


// Simulated user authentication state (use actual login status in your app)

var isUserLoggedIn = getCookie("loggedInUser") == null || getCookie("loggedInUser") == false ? false : true;


// Function to update the auth button text
function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    
    if (isUserLoggedIn) {
        authButton.textContent = "PROFILE";
    } else {
        authButton.textContent = "LOGIN";
    }
}

// Function to handle login/logout actions
function handleAuthAction() {
    if (isUserLoggedIn) {
        // Handle logout action
        console.log("Logging out...");
        // Simulate actual logout logic (clear cookies, tokens, etc.)
        isUserLoggedIn = false;  // Update the login state

        // Redirect to home or login page after logout
        window.location.href = "InformationMainLol.html";  // Or your home/login page

    } else {
        // Handle login action
        console.log("Logging in...");
        // Simulate actual login logic (show login form, redirect to login page, etc.)
        isUserLoggedIn = true;   // Update the login state

        // Redirect to a dashboard or user profile after login
        window.location.href = "InformationMainLol.html";  // Or your dashboard/profile page
    }

    // Update the button text after the state change
    updateAuthButton();
}

// Set up the button click event listener
document.getElementById('auth-button').addEventListener('click', handleAuthAction);

// Initial page load: update the button text based on the current login state
updateAuthButton();



// Handle form submission for login/signup
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const formTitle = document.getElementById("form-title").innerText;

    const endpoint = formTitle === "Sign In" ? '/login' : '/signup';
    const method = formTitle === "Sign In" ? 'POST' : 'POST';

    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
        if (formTitle === "Sign In" && data.message === "Login successful") {
            window.location.reload(); // Reload to show profile if login is successful
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Check if user is logged in
fetch('profile')
    .then(response => response.json())
    .then(data => {
        if (data.username) {
            document.getElementById("user-name").innerText = data.username;
            document.getElementById("user-profile").style.display = "block";
        } else {
            document.getElementById("auth-form").style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Handle logout



document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = getCookie("loggedInUser");
    const userName = document.getElementById("user-name");


    // Check if user is logged in
    if (loggedInUser) {
       
        userName.textContent = loggedInUser;
    }
});