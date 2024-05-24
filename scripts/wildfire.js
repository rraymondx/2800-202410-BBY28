var clicks = 0;
document.addEventListener("DOMContentLoaded", function() {
    var image = document.getElementById("myHero");
    var audio = document.getElementById("myAudio");

    if (image && audio) {
        image.addEventListener("click", function() {
            clicks++;
            if (clicks == 3) {
                audio.play();
                clicks = 0;
            }
        });
    } else {
        console.error("Image, audio, or flood effect element not found");
    }
});
