document.addEventListener('DOMContentLoaded', (event) => {
    const avalancheImage = document.querySelector('img[alt="Avalanche"]');
    const avalancheAudio = document.getElementById('avalanche-audio');

    // Play audio and trigger snow effect on image click
    avalancheImage.addEventListener('click', () => {
        avalancheAudio.play();
        avalancheImage.classList.add('snow-effect');
        setTimeout(() => {
            avalancheImage.classList.remove('snow-effect');
        }, 1500); // Ensure the duration is long enough for the snow effect to complete

        createSnowflakes(); // Create snowflakes
    });
});

// Function to create snowflakes and add them to the document
function createSnowflakes() {
    const snowflakeContainer = document.createElement('div');
    snowflakeContainer.classList.add('snowflake-container');
    document.body.appendChild(snowflakeContainer);

    for (let i = 0; i < 500; i++) { 
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // between 2 and 5 seconds
        snowflake.style.opacity = `${Math.random()}`;
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`; // between 10 and 20px
        snowflakeContainer.appendChild(snowflake);
    }

    // Remove snowflakes after some time
    setTimeout(() => {
        snowflakeContainer.remove(); 
    }, 10000); // Snowflakes last for 10 seconds
}
