
$(function () {

    initSideBar();
    newGame(White);

});

function newGame(colorPlaying) {

    GameBoard = new Board(colorPlaying);
    GameBoard.clearAllPieces();
    GameBoard.drawPieces();
    GameBoard.clearChecks();

    initTileDroppable();
    initAllPiecesDraggable();

    setupOpponent(colorPlaying);

    if (Opponent != Self && colorPlaying == Black)
        setTimeout(function () { Opponent.move(); }, ThinkingTime);   

}

function setupOpponent(colorPlaying) {
    switch (getSelectedOpponent()) {
        case "1":
            Opponent = Self; break;
        case "2":
            Opponent = new Albert(colorPlaying == White ? Black : White); break;
        default:
            console.error("Invalid agent Id: " + id);
    }

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

            var direction = Movement.isMoveLegal(squareOn, squareTo);

            if (direction != null) {

                executePlayerMove(pieceBeingDragged, destination, squareOn, squareTo);

                if (direction.onMove != null)
                    processOnMove(direction.onMove());

                initAllPiecesDraggable();

            }

        }
    });

}

function processOnMove(onMove) {

    if (onMove.castle != null)
        moveRook(onMove.castle[0], onMove.castle[1]);

}

function moveRook(rookWasAt, rookIsAt) {
    $(".square[data-row=" + rookWasAt.Row + "][data-col=" + rookWasAt.Col + "]").html("");
    $(".square[data-row=" + rookIsAt.Row + "][data-col=" + rookIsAt.Col + "]").html(Board.GetSquares()[rookIsAt.Col][rookIsAt.Row].Piece.getHtml());
}

function executePlayerMove(pieceBeingDragged, destination, squareOn, squareTo) {

    initiateMove(squareOn, squareTo);

    pieceBeingDragged.remove();

    pawnPromotionCheck(squareTo);

    destination.html(squareTo.Piece.getHtml());

    resolveMove();

    if (Opponent != Self)
        setTimeout(function () { Opponent.move(); }, ThinkingTime);   

}

function executeAgentMove(squareOn, squareTo) {

    initiateMove(squareOn, squareTo);

    $(".square[data-row=" + squareOn.Row + "][data-col=" + squareOn.Col + "]").html("");

    pawnPromotionCheck(squareTo);

    $(".square[data-row=" + squareTo.Row + "][data-col=" + squareTo.Col + "]").html(squareTo.Piece.getHtml());

    resolveMove();

}

function initiateMove(squareOn, squareTo) {

    GameBoard.castlingChecks(squareOn, squareTo);

    GameBoard.movePieceTo(squareOn, squareTo);

}

function resolveMove() {

    GameBoard.ColorMoving = GameBoard.ColorMoving == White ? Black : White;

    GameBoard.clearChecks();

    GameBoard.checkForChecks();

    $(".dot").remove();

}

function pawnPromotionCheck(square) {

    var piece = square.Piece;

    if (piece.Piece != Pieces.Pawn)
        return;

    if (piece.Color == White && square.Row == 8)
        square.Piece = new Piece(White, Pieces.Queen);
    else if (piece.Color == Black && square.Row == 1)
        square.Piece = new Piece(Black, Pieces.Queen);

}

function getSquareOn(pieceBeingDragged) {

    var origin = $(pieceBeingDragged).parent();

    var squareOnRow = origin.attr("data-row");
    var squareOnCol = origin.attr("data-col");

    return GameBoard.GetSquares()[squareOnCol][squareOnRow];

}

function getSquareTo(destination) {

    var squareOnRow = destination.attr("data-row");
    var squareOnCol = destination.attr("data-col");

    return GameBoard.GetSquares()[squareOnCol][squareOnRow];

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

    GameBoard.showAvailableMoves(squareOn);

}

