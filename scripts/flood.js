document.addEventListener("DOMContentLoaded", function() {
    var image = document.getElementById("myHero");
    var audio = document.getElementById("myAudio");
    var floodEffect = document.getElementById("floodEffect");

    if (image && audio && floodEffect) {
        image.addEventListener("click", function() {
            audio.play();

            // Reset the flood effect animation
            floodEffect.style.animation = 'none';
            // Trigger reflow to reset animation
            floodEffect.offsetHeight;
            // Restart the animation
            floodEffect.style.animation = 'floodAnimation 5s ease-in-out';

            // Optionally, reset the effect after some time
            setTimeout(function() {
                floodEffect.style.animationPlayState = 'paused';
            }, 5000); // 5 seconds duration
        });
    } else {
        console.error("Image, audio, or flood effect element not found");
    }
});
