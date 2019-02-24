
function initSideBar() {

    $(".newGame").on("click", function () {

        var white = $($(".whiteList")[0].options[$(".whiteList")[0].options.selectedIndex]).attr("value");

        var black = $($(".blackList")[0].options[$(".blackList")[0].options.selectedIndex]).attr("value");

        createAndStartNewGame(white, black);

    });

    $(".view").on("click", function () {
        var view = +$(this).attr("data-color");
        updateColorViewing(view);
    });

    $('.thinkingTime').on('change', function () {
        updateThinkingTime(+$(this).val());
    });

    $(".goToWar").on("click", function () {
        window.location = "War.html";
    });

}