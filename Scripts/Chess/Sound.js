
Sound = {
    on: true,
    sounds: "Content/Sounds/",
    moveSounds: 12
};

Sound.getSrc = function () {
    return $(".soundSrc");
};

Sound.move = function () {

    if (!Sound.on)
        return;

    var audio;

    if (Board.ColorMoving == White)
        audio = new Audio(Sound.sounds + "moveWhite.wav");
    else if(Board.ColorMoving == Black)
       audio = new Audio(Sound.sounds + "moveBlack.wav");
    audio.play();

};

Sound.check = function () {

    if (!Sound.on)
        return;

    var audio = new Audio(Sound.sounds + "check.wav");
    audio.play();

};

Sound.checkmate = function () {

    if (!Sound.on)
        return;

    var audio = new Audio(Sound.sounds + "checkmate.wav");
    audio.play();

};