
var currentGameBoard;

$(function () {

    initSideBar();
    createAndStartNewGame(Self, Self);

});

function createAndStartNewGame(whiteId, blackId) {

    startNewGame(newBoard(whiteId, blackId));

}

function updateColorViewing(colorViewing) {
    currentGameBoard.ColorViewing = colorViewing;
    refreshBoard();
}

function updateThinkingTime(time) {
    ThinkingTime = time;
}

function startNewGame(newBoard) {

    currentGameBoard = newBoard;

    refreshBoard();

    if (currentGameBoard.tryPerformNextMove())
        resolveMove();

}

function refreshBoard() {

    $(".dot").remove();
    clearAllPieces();
    clearUiOfChecks();

    assignSquaresRowCol(currentGameBoard.ColorViewing);

    drawPieces();

    initTileDroppable();
    initAllPiecesDraggable();

}

function initTileDroppable() {

    $(".whiteTile, .blackTile").droppable({
        accept: ".piece",
        hoverClass: "hover",
        drop: function (event, ui) {

            var pieceBeingDragged = ui.draggable;

            var squareOn = getSquareOn(pieceBeingDragged);

            var destination = $(event.target);

            var squareTo = getSquareTo(destination);

            if (currentGameBoard.tryPerformMove(squareOn, squareTo))
                resolveMove();

        }
    });

}

function scrollToBottomOfDiv(div) {
    var scrollHeight;

    if (div.length > 0)
        scrollHeight = div[0].scrollHeight;
    else
        scrollHeight = div.scrollHeight;

    $(div).scrollTop(scrollHeight);
}

function updatePGN() {

    var newPGN = "";

    for (var i = 0; i < currentGameBoard.PGN.length; i++) {

        var move = currentGameBoard.PGN[i];

        var moveRow = "<div class='row'><div class='col-sm-2'>" + (i + 1) + ". </div>";

        var whitePly = move[0];
        var blackPly = move[1] || "";

        moveRow += "<div class='col-sm-3 ply'>" + whitePly + "</div>";
        moveRow += "<div class='col-sm-3 ply'>" + blackPly + "</div>"

        moveRow += "</div>";

        newPGN += moveRow;

    }

    var pgn = $(".PGN");

    pgn.html(newPGN);

    scrollToBottomOfDiv($(".PGNrow"));

}

function resolveMove() {

    refreshBoard();

    updateUiForChecks();

    updatePGN();

    if (currentGameBoard.GameResult == null)
        setTimeout(function () {
            if (currentGameBoard.tryPerformNextMove())
                resolveMove();
        }, ThinkingTime);
    else
        setTimeout(function () { // timeout to allow the board to redraw before alert is posted
            alert(currentGameBoard.GameResult);
        }, 500);

}

function getSquareOn(pieceBeingDragged) {

    var origin = $(pieceBeingDragged).parent();

    var squareOnRow = origin.attr("data-row");
    var squareOnCol = origin.attr("data-col");

    return currentGameBoard.GetSquares()[squareOnCol][squareOnRow];

}

function getSquareTo(destination) {

    var squareOnRow = destination.attr("data-row");
    var squareOnCol = destination.attr("data-col");

    return currentGameBoard.GetSquares()[squareOnCol][squareOnRow];

}

function initAllPiecesDraggable() {

    $(".piece").off('click').on('click', function () {

        showPieceAvailableMoves(this);

        showPieceAvailableDefenses(this);

    });

    $(".piece").draggable({
        revert: true,
        revertDuration: 0,
        zIndex: 9999,
        start: function (event, ui) {
            showPieceAvailableMoves(event.target);
            showPieceAvailableDefenses(event.target);
        }
    });

}

function showPieceAvailableMoves(piece) {

    $(".dot").remove();

    var squareOn = getSquareOn(piece);

    showAvailableMoves(squareOn);

}

function showPieceAvailableDefenses(piece) {

    $(".defense").removeClass("defense");

    var squareOn = getSquareOn(piece);

    showAvailableDefenses(squareOn);

}

function showAvailableMoves(square) {

    if (currentGameBoard.ColorMoving == White && currentGameBoard.White != Self)
        return;

    if (currentGameBoard.ColorMoving == Black && currentGameBoard.Black != Self)
        return;

    if (square.Piece.Color != currentGameBoard.ColorMoving)
        return;

    var legalMoves = currentGameBoard.Movement.getAllLegalMovesFromSquare(square);

    currentGameBoard.LastLegalMoves = legalMoves;

    for (var i = 0; i < legalMoves.length; i++) {
        var move = legalMoves[i];

        $(".square[data-row=" + move.SquareTo.Row + "][data-col=" + move.SquareTo.Col + "]").prepend("<div class='dot'></div>");

    }

};

function showAvailableDefenses(square) {

    var legalDefenses = currentGameBoard.Movement.getAllLegalDefenseMovesFromSquare(square);

    for (var i = 0; i < legalDefenses.length; i++) {
        var move = legalDefenses[i];

        $(".square[data-row=" + move.SquareTo.Row + "][data-col=" + move.SquareTo.Col + "]").addClass("defense");

    }

};

function updateUiForChecks() {

    if (currentGameBoard.ColorInCheckMate != null) {

        var kingSquare = currentGameBoard.getKingSquare(currentGameBoard.ColorInCheckMate);

        checkmate(kingSquare);

        Sound.checkmate();

    } else if (currentGameBoard.ColorInCheck != null) {

        var kingSquare = currentGameBoard.getKingSquare(currentGameBoard.ColorInCheck);

        check(kingSquare);

        Sound.check();

    } else if (currentGameBoard.ColorInStaleMate != null) {

        var kingSquare = currentGameBoard.getKingSquare(currentGameBoard.ColorInStaleMate);

        stalemate(kingSquare);

        Sound.stalemate();

    } else
        Sound.moveComplete(currentGameBoard);

};

function clearUiOfChecks() {

    $(".stalemate").removeClass("stalemate");
    $(".checkmate").removeClass("checkmate");
    $(".check").removeClass("check");

};

function checkmate(square) {

    $(".square[data-row=" + square.Row + "][data-col=" + square.Col + "]").addClass("checkmate");

};

function stalemate(square) {

    $(".square[data-row=" + square.Row + "][data-col=" + square.Col + "]").addClass("stalemate");

};

function check(square) {

    $(".square[data-row=" + square.Row + "][data-col=" + square.Col + "]").addClass("check");

};

function clearAllPieces() {

    for (var col = 1; col <= 8; col++)
        for (var row = 1; row <= 8; row++)
            $(".square[data-row=" + row + "][data-col=" + col + "]").html("");

};

function drawPieces() {

    for (var col = 1; col <= 8; col++) {

        for (var row = 1; row <= 8; row++) {

            var piece = currentGameBoard.Squares[col][row].Piece;

            if (piece == null)
                continue;

            var square = $(".square[data-row=" + row + "][data-col=" + col + "]");

            square.html(piece.getHtml());

        }

    }

};

function assignSquaresRowCol(playingColor) {

    var row = playingColor == White ? 1 : 8;
    var initCol = playingColor == White ? 1 : 8;
    var col = initCol;
    var modifier = playingColor == White ? 1 : -1;

    for (var y = 1; y <= 8; y++) {

        for (var x = 1; x <= 8; x++) {

            var square = $(".square[data-x=" + x + "][data-y=" + y + "]");

            square.attr("data-row", row);
            square.attr("data-col", col);

            col += modifier;
        }
        col = initCol;
        row += modifier;
    }

};
