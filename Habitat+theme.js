document.addEventListener('DOMContentLoaded', () => {
  const raindropCount = 100; // Number of raindrops
  const container = document.createElement('div');
  container.className = 'rain-container';
  document.body.appendChild(container);

  for (let i = 0; i < raindropCount; i++) {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';

    // Randomize size, position, and animation duration
    const size = Math.random() * 10 + 5; // Random size between 5px and 15px
    const xPosition = Math.random() * 100; // Random horizontal position
    const delay = Math.random() * 2; // Random animation delay
    const duration = Math.random() * 2 + 3; // Random animation duration (3-5s)

    raindrop.style.width = `${size}px`;
    raindrop.style.height = `${size * 1.5}px`; // Stretch raindrop vertically
    raindrop.style.left = `${xPosition}vw`;
    raindrop.style.animationDuration = `${duration}s`;
    raindrop.style.animationDelay = `${delay}s`;

    container.appendChild(raindrop);
  }
});
