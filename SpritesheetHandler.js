// SpritesheetHandler.js
class SpritesheetHandler {
    constructor(imagePath, xmlPath) {
        this.imagePath = imagePath;
        this.xmlPath = xmlPath;
        this.spriteSheet = new Image();
        this.frames = {};
    }

    load(callback) {
        this.spriteSheet.src = this.imagePath;
        this.spriteSheet.onload = () => {
            this.loadXML(this.xmlPath, (xml) => {
                const frameElements = xml.getElementsByTagName('SubTexture');
                for (let i = 0; i < frameElements.length; i++) {
                    const frame = frameElements[i];
                    this.frames[frame.getAttribute('name')] = {
                        x: parseInt(frame.getAttribute('x')),
                        y: parseInt(frame.getAttribute('y')),
                        width: parseInt(frame.getAttribute('width')),
                        height: parseInt(frame.getAttribute('height')),
                        frameX: parseInt(frame.getAttribute('frameX')),
                        frameY: parseInt(frame.getAttribute('frameY')),
                        frameWidth: parseInt(frame.getAttribute('frameWidth')),
                        frameHeight: parseInt(frame.getAttribute('frameHeight'))
                    };
                }
                callback();
            });
        };
    }

    loadXML(filePath, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseXML);
            }
        };
        xhr.send(null);
    }

    drawFrame(context, frameName, x, y) {
        const frame = this.frames[frameName];
        if (frame) {
        context.drawImage(
                this.spriteSheet,
                frame.x, frame.y, frame.width, frame.height,
                x + frame.frameX, y + frame.frameY, frame.frameWidth, frame.frameHeight
            );
        } else {
            console.error(`Frame ${frameName} not found`);
        }
    }

    animate(context, frameNames, x, y, frameRate, loop = true) {
        let currentFrame = 0;
        const drawNextFrame = () => {
            context.clearRect(x, y, this.frames[frameNames[0]].frameWidth, this.frames[frameNames[0]].frameHeight);
            this.drawFrame(context, frameNames[currentFrame], x, y);
            currentFrame = (currentFrame + 1) % frameNames.length;
            if (loop || currentFrame !== 0) {
                setTimeout(drawNextFrame, 1000 / frameRate);
    }
        };
        drawNextFrame();
    }
}
