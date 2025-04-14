const SPRITESHEET_IMAGE = "assets/images/coolFlames.png";
const SPRITESHEET_XML = "assets/images/coolFlames.xml";

const lolCanvas = document.getElementById("lolFUCK");
const context = lolCanvas.getContext("2d");

lolCanvas.width = 200; // Adjust canvas size as needed
lolCanvas.height = 200;

let frames = [];
let currentFrameIndex = 0;
let spritesheetImage = new Image();

// Load the spritesheet image
function loadSpritesheet() {
    return new Promise((resolve) => {
        spritesheetImage.src = SPRITESHEET_IMAGE;
        spritesheetImage.onload = resolve;
    });
}

// Load and parse the XML file
function loadXML() {
    return fetch(SPRITESHEET_XML)
        .then((response) => response.text())
        .then((xmlText) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            const subTextures = xmlDoc.getElementsByTagName("SubTexture");

            for (let subTexture of subTextures) {
                const x = parseInt(subTexture.getAttribute("x"));
                const y = parseInt(subTexture.getAttribute("y"));
                const width = parseInt(subTexture.getAttribute("width"));
                const height = parseInt(subTexture.getAttribute("height"));
                const frameX = parseInt(subTexture.getAttribute("frameX"));
                const frameY = parseInt(subTexture.getAttribute("frameY"));
                const frameWidth = parseInt(subTexture.getAttribute("frameWidth"));
                const frameHeight = parseInt(subTexture.getAttribute("frameHeight"));
                const name = parseInt(subTexture.getAttribute("name"));

                frames.push({ name, x, y, width, height, frameX, frameY, frameWidth, frameHeight });
            }
        });
}

// Animate the frames
function animate() {
    context.clearRect(0, 0, lolCanvas.width, lolCanvas.height);

    if (frames.length > 0) {
        const frame = frames[currentFrameIndex];
        const destX = (lolCanvas.width - frame.frameWidth) / 2 + frame.frameX;
        const destY = (lolCanvas.height - frame.frameHeight) / 2 + frame.frameY;

        // Draw the current frame
        context.drawImage(
            spritesheetImage,
            frame.x, // Source X
            frame.y, // Source Y
            frame.width, // Source Width
            frame.height, // Source Height
            destX, // Destination X
            destY, // Destination Y
            frame.width, // Destination Width
            frame.height // Destination Height
        );
		console.log(String(frame));

        // Move to the next frame
        currentFrameIndex = (currentFrameIndex + 1) % frames.length;
    }

    requestAnimationFrame(animate);
}

// Initialize the animation
async function init() {
    try {
		console.log("FUCK")
        await loadSpritesheet(); // Load the spritesheet image
        await loadXML(); // Load and parse the XML file
		console.log("SHIT")
        animate(); // Start the animation
		console.log("HOLYSHIT")
    } catch (error) {
        console.error("Error initializing animation:", error);
    }
}


    init();