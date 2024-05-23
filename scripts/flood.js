document.addEventListener("DOMContentLoaded", function() {
    var image = document.getElementById("myHero");
    var audio = document.getElementById("myAudio");

    if (image && audio) {
        image.addEventListener("click", function() {
            audio.play();

            // Remove the class if it's already present to restart the animation
            image.classList.remove('earthquake-effect');

            // Use setTimeout to ensure the class removal is processed before adding it back
            setTimeout(function() {
                image.classList.add('earthquake-effect');
            }, 10);
        });
    } else {
        console.error("Image or audio element not found");
    }
});