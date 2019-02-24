
function initSideBar() {

    $(".goToChess").on("click", function () {
        window.location = "Chess.html";
    });

    $(".fight").on("click", function () {
        window.location = "Chess.html";
    });
    
}

function getSelectedOpponent() {

    return $($(".playAgainst")[0].options[$(".playAgainst")[0].options.selectedIndex]).attr("value");

}