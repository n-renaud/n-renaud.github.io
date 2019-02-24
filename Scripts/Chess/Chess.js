
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

function resolveMove() {

    refreshBoard();

    updateUiForChecks();

    setTimeout(function () {
        if (currentGameBoard.tryPerformNextMove())
            resolveMove();
    }, ThinkingTime);    

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

    });

    $(".piece").draggable({
        revert: true,
        revertDuration: 0,
        zIndex: 9999,
        start: function (event, ui) {
            showPieceAvailableMoves(event.target);
        }
    });

}

function showPieceAvailableMoves(piece) {

    $(".dot").remove();

    var squareOn = getSquareOn(piece);

    showAvailableMoves(squareOn);

}

function showAvailableMoves(square) {

    if (square.Piece.Color != currentGameBoard.ColorMoving)
        return;

    var legalMoves = currentGameBoard.Movement.getAllLegalMovesFromSquare(square);

    currentGameBoard.LastLegalMoves = legalMoves;

    for (var i = 0; i < legalMoves.length; i++) {
        var move = legalMoves[i];

        $(".square[data-row=" + move.SquareTo.Row + "][data-col=" + move.SquareTo.Col + "]").prepend("<div class='dot'></div>");

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
