
Sound = {
    on: true,
    sounds: "Content/Sounds/",
    moveSounds: 12
};

Sound.getSrc = function () {
    return $(".soundSrc");
};

Sound.moveComplete = function () {

    if (!Sound.on)
        return;

    var audio;

    if (GameBoard.ColorMoving == White) //meaning black just moved
        audio = new Audio(Sound.sounds + "moveBlack.wav");
    else if (GameBoard.ColorMoving == Black) //meaning white just moved
        audio = new Audio(Sound.sounds + "moveWhite.wav");

    audio.play();

};

Sound.check = function () {

    if (!Sound.on)
        return;

    var audio = new Audio(Sound.sounds + "check.wav");
    audio.play();

};

Sound.stalemate = function () {

    if (!Sound.on)
        return;

    var audio = new Audio(Sound.sounds + "stalemate.wav");
    audio.play();

};

Sound.checkmate = function () {

    if (!Sound.on)
        return;

    var audio = new Audio(Sound.sounds + "checkmate.wav");
    audio.play();

};