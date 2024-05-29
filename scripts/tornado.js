// Tornado Easter Egg
document.addEventListener("DOMContentLoaded", function() {

    var image = document.getElementById("myImage");
    var audio = document.getElementById("myAudio");

    if (image && audio) {
        image.addEventListener("click", function() {

            audio.play();

            // Remove the class if it's already present to restart the animation
            image.classList.remove('tornado-effect');

            // Use setTimeout to ensure the class removal is processed
            setTimeout(() => {
                image.classList.add('tornado-effect');
            }, 50);
        });
    } else {
        console.error("Image or audio element not found");
    }
});

