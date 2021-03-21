
//pawn promotion e.g: a8=Q
//advanced unambiguous rules:
//remove piece notations for unambiguous moves
//including removing piece notation if sibling piece is pinned (when the target is the same square)

function addPly(board, squareOn, squareTo) {

    var color = board.ColorMoving;

    if (color == White)
        addWhitePly(board, squareOn, squareTo);
    else if (color == Black)
        addBlackPly(board, squareOn, squareTo);

}

function addWhitePly(board, squareOn, squareTo) {

    board.PGN.push([getPly(squareOn, squareTo)]);

}

function addBlackPly(board, squareOn, squareTo) {

    board.PGN[board.PGN.length - 1].push(getPly(squareOn, squareTo));

}

function getPly(squareOn, squareTo) {

    var ply = "";

    ply += getPGNPieceLetterText(squareOn.Piece.Piece.Id);

    if (squareTo.Piece != null)
        ply += "x";

    ply += getSquareText(squareTo);

    return ply;

}

function appendToCurrentPly(board, append) {

    if (board.PGN[board.PGN.length - 1][1] != null)
        board.PGN[board.PGN.length - 1][1] += append;
    else if (board.PGN[board.PGN.length - 1][0] != null)
        board.PGN[board.PGN.length - 1][0] += append;

}

function checkCurrentPly(board) {

    appendToCurrentPly(board, "+");

}

function checkmateCurrentPly(board) {

    appendToCurrentPly(board, "#");

}

function stalemateCurrentPly(board) {

    appendToCurrentPly(board, "@");

}