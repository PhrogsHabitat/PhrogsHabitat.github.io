




var motionReduced = localStorage.getItem("MotionReduced");

if (motionReduced == null)
{
	localStorage.setItem("MotionReduced", "false");
}


element3.addEventListener('mouseenter', () => {
	
	glowAnim("inc", motionTick);
  
});

element3.addEventListener('mouseleave', () => {
	
  glowAnim("dec", motionTick);
  
});

element3.addEventListener('mousedown', () => {

	if (reducedMotion == true) {
		reducedMotion = false;
		color = "rem rgb(255, 217, 0)";
		document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotion.png`);
		localStorage.setItem("MotionReduced", false);
		console.log(motionReduced);
	} else if (reducedMotion == false) {
		reducedMotion = true;
		color = "rem rgb(0, 255, 0)";
		document.getElementById('motionTick').setAttribute('src', `assets/images/questionMotionSel.png`);
		localStorage.setItem("MotionReduced", true);
		console.log(motionReduced);
	}
	
	showPopupMessage();  // Trigger the popup when toggling motion
});

function showPopupMessage() {
    const popup = document.getElementById('popup-message');

    // Clear existing timeouts to reset any ongoing animation
    clearTimeout(popup.hideTimeout);
    clearTimeout(popup.fadeOutTimeout);

    // Immediately reset popup state to ensure it can animate again from the start
    popup.style.display = 'block'; 
    popup.style.opacity = '0';  // Set opacity to 0 before the slide down animation
    popup.style.top = '0px';    // Set to initial position (above the screen)
	popup.style.left = '103vh';

    // Slide down and fade-in effect
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.top = '190px';  // Slide down to its visible position
    }, 50);  // Small delay to allow transition

    // Hide the popup after 3 seconds (fade-out and slide-up)
    popup.hideTimeout = setTimeout(() => {
        popup.style.opacity = '0';   // Fade-out effect
        popup.style.top = '0px';     // Slide back up after fading

        // Ensure the popup is hidden after the animation is complete
        popup.fadeOutTimeout = setTimeout(() => {
            popup.style.display = 'none';  // Hide the popup entirely after fade-out
        }, 500);  // Wait for the fade-out transition to finish
    }, 3000);  // Keep the popup visible for 3 seconds before hiding
}





		
	






function glowAnim(type, el)
{
	const elem = document.getElementById(String(el));
	
	
	
	if (type == "dec")
	{
		countDown(el);
	}
	
	if (type == "inc")
	{
		countUp(el);
	}
	
}

function countDown(eLol){
	

        var interval = setInterval(function() {
           if (count > 0) {
              count -= 0.1;
              eLol.style.filter =  "drop-shadow(0 0 " + String(count) + String(color);
           } else {
              clearInterval(interval); // Stop the interval when opacity reaches 0
           }
        }, 30);
}

function countUp(eLol){
	

            var interval = setInterval(function() {
               if (count < 1) {
                  count += 0.1;
                  eLol.style.filter =  "drop-shadow(0 0 " + String(count) + String(color);
               } else {
                  clearInterval(interval); // Stop the interval when opacity reaches 0
               }
            }, 5);
}