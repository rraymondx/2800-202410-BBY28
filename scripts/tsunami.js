// Tsunami Easter Egg
document.getElementById("myImage").addEventListener("click", function () {
    var audio = document.getElementById("myAudio");
    audio.play();
    const image = document.getElementById('myImage');

    // Remove the class if it's already present to restart the animation
    image.classList.remove('wave-effect');

    // Use setTimeout to ensure the class removal is processed
    setTimeout(() => {
        image.classList.add('wave-effect');
    });
});

