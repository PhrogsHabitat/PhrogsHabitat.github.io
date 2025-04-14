const element3 = document.getElementById('motionBound');

var count = 0;
var color = "rem rgb(255, 217, 0)";
var opacity = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Check if cookies have been accepted
    if (!getCookie('cookiesAccepted')) {
        document.getElementById('cookie-consent').style.display = 'block';
    }

    // Event listener for "Accept" button
    document.getElementById('accept-cookies').addEventListener('click', function() {
        setCookie('cookiesAccepted', 'true', 365);
        document.getElementById('cookie-consent').style.display = 'none';
        initializeMotionReducedCookie();
    });

    // Initialize motion reduced setting
    initializeMotionReducedCookie();
});

function initializeMotionReducedCookie() {
    if (!getCookie("motionReduced")) {
        setCookie("motionReduced", "false", 365);
    } else {
        if (getCookie("motionReduced") === "true") {
            document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotionSel.png`);
        } else {
            document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotion.png`);
        }
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); 
    document.cookie = `${cname}=${cvalue}; expires=${d.toUTCString()}; path=/; SameSite=Lax;`;
}

function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}

// Reduced motion toggle
document.getElementById('motionBound').addEventListener('mousedown', function() {
    if (getCookie("motionReduced") === "true") {
        setCookie("motionReduced", "false", 365);
        document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotion.png`);
    } else {
        setCookie("motionReduced", "true", 365);
        document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotionSel.png`);
    }

    showPopupMessage();
});

function showPopupMessage() {
    const popup = document.getElementById('popup-message');
    popup.style.display = 'block';
    popup.style.opacity = '0';
    setTimeout(() => {
        popup.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 3000);
}


element3.addEventListener('mouseenter', () => {
    glowAnim("inc", motionTick);
});

element3.addEventListener('mouseleave', () => {
    glowAnim("dec", motionTick);
});

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


