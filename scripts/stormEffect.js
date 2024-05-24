document.addEventListener('DOMContentLoaded', (event) => {
    const stormImage = document.querySelector('img[alt="Storm"]');
    const thunderAudio = document.getElementById('thunder-audio');

    stormImage.addEventListener('click', () => {
        thunderAudio.play();
        stormImage.classList.add('rumble-effect');
        setTimeout(() => {
            stormImage.classList.remove('rumble-effect');
        }, 1500); // Ensure the duration is long enough for the rumble effect to complete
    });
});
