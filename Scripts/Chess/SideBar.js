
function initSideBar() {

    $(".playAs").on("click", function () {
        newGame(+$(this).attr("data-color"));
    });

}
function getSelectedOpponent() {

    return $($(".playAgainst")[0].options[$(".playAgainst")[0].options.selectedIndex]).attr("value");

}