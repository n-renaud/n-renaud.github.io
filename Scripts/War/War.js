
var resultRow

$(function () {

    initSideBar();

});

function fight() {

    var white = $($(".whiteAgent")[0].options[$(".whiteAgent")[0].options.selectedIndex]).attr("value");

    var black = $($(".blackAgent")[0].options[$(".blackAgent")[0].options.selectedIndex]).attr("value");

    var board = newBoard(white, black);

    while (board.GameResult == null) {
        board.tryPerformNextMove();
    }

    outputFightResult(board);

}

function outputFightResult(board) {

    var results = $(".fightResults");

    results.append(getResultRow(board));

}

function getResultRow(board) {

    return '<div class="row"><div class="col-lg-2">' +
        $(".whiteAgent")[0].options[$(".whiteAgent")[0].options.selectedIndex].label +
        '</div><div class="col-lg-2"> VS </div><div class="col-lg-2">' +
        $(".blackAgent")[0].options[$(".blackAgent")[0].options.selectedIndex].label +
        '</div><div class="col-lg-6">' +
        board.GameResult +
        '</div></div>';

}