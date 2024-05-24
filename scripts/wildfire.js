var clicks = 0;

$(function () {
    $('#myHero').click(function () {
        const fireElement = $("<div class='fire'></div>").text('');
        clicks++;
        if (clicks == 3) {
            $('#myAudio')[0].play();
            clicks = 0;
            $('.content')[0].after(fireElement[0]);
            setTimeout(function(){
                $('.fire').remove();
                $('#myAudio')[0].pause();
            }, 3000);
        }
    });
});
