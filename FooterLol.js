 
/* PLEASE NOTE: 


THANK YOU:

"Trenton Sanders" - TheSpectralBoombox,
"Cory Knicely" - InfinitlyDumb

FOR THE MATH AND LOGIC USED ON THIS PAGE/SCRIPT!
I AM BIG DUMB WHEN IT COMES TO MATH, AND THEY ARE BIG BRAIN, SO THANK YOU SO MUCH!



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

        // Hide the cookie consent popup
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


// Debug to log current cookies
function logCookies() {
    console.log("Current cookies: " + document.cookie);
}

// Call to log cookies on page load
logCookies();

var motionReduced = getCookie("motionReduced");



// Simulation constants
const NUM_POINTS = 20;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SPRING_CONSTANT = 0.005;
const SPRING_CONSTANT_BASELINE = 0.005;
const Y_OFFSET = 500;  
const DAMPING = 0.95;  // Lowered damping for a more fluid motion
const MOUSE_FORCE_MULTIPLIER = 0.2;

const MOUSE_EFFECT_RANGE_X = 50;  // Reduced horizontal range
const MOUSE_EFFECT_RANGE_Y = 25;  // Reduced vertical range

let canvas = document.getElementById("waveCanvas");
let ctx = canvas.getContext("2d");
let scaleFactor = window.devicePixelRatio || 1;
canvas.width = WIDTH * scaleFactor;
canvas.height = HEIGHT * scaleFactor;
ctx.scale(scaleFactor, scaleFactor);

let wavePoints = [];
let img = new Image();
img.src = 'assets/images/line.png';  
let imageLoaded = false;
img.onload = () => {
    imageLoaded = true;
};

let lastMouseX = null;
let lastMouseY = null;
let mouseSpeedY = 0;

const MAX_SPLASHES = 15;  // Maximum number of splash particles

class Splash {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 5; // Size variability for more realism
        this.originalSize = this.size; // Keep track of the original size for scaling
        this.alpha = 1;
        this.speedX = speedX;
        this.speedY = speedY;
        this.gravity = 0.8; // Gravity to pull down the splash
        this.friction = 0.95; // Slightly lower friction for smoother movement
        this.stretchFactor = 1; // Factor to stretch the splash shape
        this.rotation = Math.random() * Math.PI * 2; // Random starting rotation
        this.rotationSpeed = (Math.random() - 0.5) * 0.1; // Random rotational speed
    }

    update() {
        this.x += this.speedX; // Move horizontally
        this.y -= this.speedY; // Move vertically
        this.speedY -= this.gravity; // Apply gravity
        this.speedX *= this.friction; // Slow down horizontally
        this.speedY *= this.friction; // Slow down vertically

        // Apply rotation
        this.rotation += this.rotationSpeed;

        // Apply gravity effect to the splash size and shape (stretch)
        if (this.speedY > 0) {
            // Splash is moving upward, stretch vertically
            this.stretchFactor = 1 + this.speedY / 10; // Increase stretch based on speed
        } else {
            // Splash is falling, flatten horizontally
            this.stretchFactor = 1 - Math.abs(this.speedY) / 10; // Decrease stretch based on speed
        }

        // Make the splash shrink over time due to air resistance
        this.size = this.originalSize * (1 - Math.abs(this.speedY) / 15); // Shrink more when falling faster

        // Fade out the splash over time
        this.alpha -= 0.02;
    }

    draw() {
        ctx.save(); // Save the current canvas state
        ctx.translate(this.x, this.y); // Move the canvas to the splash position
        ctx.rotate(this.rotation); // Apply rotation
        ctx.scale(1, this.stretchFactor); // Apply vertical stretch or flatten

        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`; // Blue for water effect
        ctx.fill();
        ctx.closePath();

        ctx.restore(); // Restore the canvas state to prevent affecting other elements
        ctx.globalAlpha = 1; // Reset global alpha
    }

    hasTouchedWave(wavePoints) {
        let closestPoint = wavePoints.reduce((closest, point) => {
            return Math.abs(this.x - point.x) < Math.abs(this.x - closest.x) ? point : closest;
        }, wavePoints[0]);

        return this.y >= closestPoint.y; // Returns true if splash touches wave
    }

    applyForceToWave(wavePoints) {
        let closestPoint = wavePoints.reduce((closest, point) => {
            return Math.abs(this.x - point.x) < Math.abs(this.x - closest.x) ? point : closest;
        }, wavePoints[0]);

        // Apply vertical force to the wave point
        closestPoint.spd.y += this.speedY * 0.3; // Add splash's vertical speed as force to wave
    }
}


let splashes = [];

function makeWavePoints(numPoints) {
    let points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: (i / (numPoints - 3)) * WIDTH,  // Ensure points span the full width
            y: Y_OFFSET,
            spd: { y: 0 },
            mass: 1,
        });
    }
    return points;
}


function updateWavePoints(points, dt) {
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        let force = 0;

        // Calculate spring forces
        let forceFromLeft = i === 0 ? SPRING_CONSTANT * (points[points.length - 1].y - p.y) : SPRING_CONSTANT * (points[i - 1].y - p.y);
        let forceFromRight = i === points.length - 1 ? SPRING_CONSTANT * (points[0].y - p.y) : SPRING_CONSTANT * (points[i + 1].y - p.y);
        let forceToBaseline = SPRING_CONSTANT_BASELINE * (Y_OFFSET - p.y);

        // Sum all the forces
        force += forceFromLeft + forceFromRight + forceToBaseline;

        // Update speed and position with damping
        let acceleration = force / p.mass;
        p.spd.y = DAMPING * p.spd.y + acceleration;  // Apply damping
        p.y += p.spd.y;  // Update position

        // Calculate wave height deviation from baseline
        let waveHeight = Math.abs(Y_OFFSET - p.y);  // Deviation from baseline

        // Create more splashes when the wave moves upward (negative speed)
        if (p.spd.y < -5 && splashes.length < MAX_SPLASHES) {  // Check for upward movement (negative speed)
            let horizontalSpeed = (Math.random() - 0.5) * 10;
            let upwardSpeed = Math.random() * 5 + 3;  // Generate moderate splashes
            let splashYOffset = 10;  // Offset to make splashes spawn slightly below the wave

            // Scale splash size based on wave height, with a minimum size of 5 and a maximum of 15
            let splashSize = Math.min(Math.max(waveHeight / 10, 5), 15);

            // Pass splash size to the constructor for scaling
            splashes.push(new Splash(p.x, p.y + 2, horizontalSpeed, upwardSpeed, splashSize));
        }
    }
}





function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!imageLoaded) return;

    // Draw the wave
    ctx.beginPath();
    ctx.moveTo(wavePoints[0].x, wavePoints[0].y);

    for (let i = 1; i < wavePoints.length; i++) {
        let p = wavePoints[i];
        let prevP = wavePoints[i - 1];
        let controlX = (prevP.x + p.x) / 2;
        let controlY = (prevP.y + p.y) / 2;
        ctx.quadraticCurveTo(prevP.x, prevP.y, controlX, controlY);
    }

    // Ensure the path closes down to the bottom of the canvas
    ctx.lineTo(WIDTH, HEIGHT);  // Draw from the last wave point to the bottom-right corner
    ctx.lineTo(0, HEIGHT);  // Draw from bottom-right to bottom-left corner
    ctx.closePath();  // Close the path

    // Fill the area beneath the wave with black
    ctx.fillStyle = 'black';
    ctx.fill();

    // Draw the wave line
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw the wave image (same as before)
    let segmentWidth = canvas.width / NUM_POINTS;

    for (let i = 0; i < wavePoints.length - 1; i++) {
        let p = wavePoints[i];
        let nextP = wavePoints[i + 1];

        ctx.drawImage(
            img,
            0, 0, img.width, img.height,
            p.x, p.y - img.height,
            segmentWidth, img.height
        );
    }

    // Ensure splashes are drawn last, on top of the wave
    drawSplashes();
}


function drawSplashes() {
    for (let i = splashes.length - 1; i >= 0; i--) {
        let splash = splashes[i];
        splash.update();

        // Check if splash has touched the wave or if it has completely faded
        if (splash.hasTouchedWave(wavePoints) || splash.alpha <= 0) {
            splashes.splice(i, 1); // Remove splash after interacting with the wave or fading
        } else {
            splash.draw(); // Draw the splash
        }
    }
}


let lastWaveDirection = null;  // Track the last direction of wave movement
const SPLASH_CREATION_INTERVAL = 100000; // Slightly faster splash creation
let lastSplashTime = 0;

function applyMouseForce(mouseX, mouseY) {
    let currentTime = Date.now(); // Get the current time
    let closestPoint = wavePoints.reduce((closest, point) => {
        return Math.abs(mouseX - point.x) < Math.abs(mouseX - closest.x) ? point : closest;
    }, wavePoints[0]);

    // Apply vertical force to the wave
    closestPoint.spd.y += mouseSpeedY * MOUSE_FORCE_MULTIPLIER;

    // Prevent excessive splash creation using rate limiting
    if (currentTime - lastSplashTime < SPLASH_CREATION_INTERVAL || splashes.length >= MAX_SPLASHES) {
        return;  // Skip splash creation if too soon or max splashes reached
    }

    // Ensure splashes are only created if the mouse is moving fast enough
    if (Math.abs(mouseSpeedY) > 10) {
        // Create a splash
        let horizontalSpeed = (Math.random() - 0.5) * 10;
        let upwardSpeed = Math.random() * 10 + 5;  // Moderate upward velocity
        splashes.push(new Splash(closestPoint.x, closestPoint.y, horizontalSpeed, upwardSpeed));
        lastSplashTime = currentTime;  // Update the last splash time
    }
}




function animate() {
	
    updateWavePoints(wavePoints, 0.016);
    drawWave();
    requestAnimationFrame(animate);
}

function isMouseInRange(mouseX, mouseY) {
    const imageLeft = wavePoints[0].x;
    const imageRight = wavePoints[wavePoints.length - 1].x;
    const imageTop = Y_OFFSET - img.naturalHeight / 2;
    const imageBottom = Y_OFFSET + 10; 

    return (
        mouseX >= imageLeft - (MOUSE_EFFECT_RANGE_X / 8) &&  // Decreased range
        mouseX <= imageRight + (MOUSE_EFFECT_RANGE_X / 8) && // Decreased range
        mouseY >= imageTop - (MOUSE_EFFECT_RANGE_Y / 8) &&   // Decreased range
        mouseY <= imageBottom + (MOUSE_EFFECT_RANGE_Y / 8)   // Decreased range
    );
}

canvas.addEventListener('mousemove', (event) => {
	if(motionReduced == "false"){
		
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (lastMouseX !== null && lastMouseY !== null) {
        mouseSpeedY = mouseY - lastMouseY; // Calculate vertical speed
    }

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    if (isMouseInRange(mouseX - 20, mouseY - 20)) {
        applyMouseForce(mouseX, mouseY);
    }
	}
});


wavePoints = makeWavePoints(NUM_POINTS);
animate();
