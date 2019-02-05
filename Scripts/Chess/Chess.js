
$(function () {

    Board = new Board(White);
    Board.drawPieces();
    initTileDroppable();
    initPieceDraggable();

});

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
                moveToSquare(pieceBeingDragged, destination, squareOn, squareTo);
                if (direction.onMove != null)
                    processOnMove(direction.onMove()); 
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

function moveToSquare(pieceBeingDragged, destination, squareOn, squareTo) {

    Board.castlingChecks(squareOn);

    Board.movePieceTo(squareOn, squareTo);
    
    pieceBeingDragged.remove();

    pawnPromotionCheck(squareTo);

    destination.html(squareTo.Piece.getHtml());

    initPieceDraggable();

    Board.ColorMoving = Board.ColorMoving == White ? Black : White;

    Board.clearChecks();

    Board.checkForChecks();

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

    return Board.GetSquares()[squareOnCol][squareOnRow];

}

function getSquareTo(destination) {

    var squareOnRow = destination.attr("data-row");
    var squareOnCol = destination.attr("data-col");

    return Board.GetSquares()[squareOnCol][squareOnRow];

}

function initPieceDraggable() {

    $(".piece").draggable({
        revert: true,
        revertDuration: 0,
        zIndex: 9999,
        start: function (event, ui) {
            
            var squareOn = getSquareOn(event.target);

            Board.showAvailableMoves(squareOn);

        },
        stop: function () {
            $(".dot").remove();
        }
    });

}

