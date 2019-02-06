
function Board(playingColor) {

    this.Squares = [9];
    this.HypotheticalSquares = null;
    this.LastLegalMoves = null;
    this.ColorInCheck = null;
    this.ColorMoving = White;
    this.initSquaresArrays();
    this.setPiecesToNewGame();
    this.assignSquaresRowCol(playingColor);

    this.WhiteLeftCastling = true;
    this.WhiteRightCastling = true;

    this.BlackLeftCastling = true;
    this.BlackRightCastling = true;

}

Board.prototype.castlingChecks = function (squareMoving, squareTo) {

    if (squareMoving.Piece.Color == White)
        this.whiteCastlingChecks(squareMoving, squareTo);
    else if (squareMoving.Piece.Color == Black)
        this.blackCastlingChecks(squareMoving, squareTo);

};

Board.prototype.whiteCastlingChecks = function (squareMoving, squareTo) {

    if (squareMoving.Piece.Piece == Pieces.King) {
        this.WhiteLeftCastling = false;
        this.WhiteRightCastling = false;
    }

    if (squareMoving.Piece.Piece == Pieces.Rook)
        if (squareMoving.Col == A)
            this.WhiteLeftCastling = false;
        else if (squareMoving.Col == H)
            this.WhiteRightCastling = false;

    if (squareTo.Piece != null && squareTo.Piece.Piece == Pieces.Rook)
        if (squareTo.Col == A)
            this.BlackLeftCastling = false;
        else if (squareTo.Col == H)
            this.BlackRightCastling = false;

};

Board.prototype.blackCastlingChecks = function (squareMoving, squareTo) {

    if (squareMoving.Piece.Piece == Pieces.King) {
        this.BlackLeftCastling = false;
        this.BlackRightCastling = false;
    }

    if (squareMoving.Piece.Piece == Pieces.Rook)
        if (squareMoving.Col == A)
            this.BlackLeftCastling = false;
        else if (squareMoving.Col == H)
            this.BlackRightCastling = false;

    if (squareTo.Piece != null && squareTo.Piece.Piece == Pieces.Rook)
        if (squareTo.Col == A)
            this.WhiteLeftCastling = false;
        else if (squaresquareToMoving.Col == H)
            this.WhiteRightCastling = false;

};

Board.prototype.GetSquares = function () {

    if (this.HypotheticalSquares == null)
        return this.Squares;

    return this.HypotheticalSquares;

};

Board.prototype.startHypotheticalMove = function (squareOn, squareTo) {

    this.HypotheticalSquares = JSON.parse(JSON.stringify(Board.Squares));

    squareOn = this.getSquare(squareOn.Row, squareOn.Col);
    squareTo = this.getSquare(squareTo.Row, squareTo.Col);

    this.movePieceTo(squareOn, squareTo);

};

Board.prototype.endHypotheticalMove = function () {

    this.HypotheticalSquares = null;

};

Board.prototype.checkForChecks = function () {

    this.ColorInCheck = null;

    var kingSquare = this.getKingSquare(this.ColorMoving);

    var allEnemyMoves = Movement.getAllLegalMovesForColor(this.ColorMoving == White ? Black : White);

    if (Movement.isSquareTargetedByEnemy(kingSquare, allEnemyMoves)) {
        if (Movement.getAllLegalMovesForColor(this.ColorMoving).length == 0) {
            this.checkmate(kingSquare);
            Sound.checkmate();
        } else {
            this.check(kingSquare);
            Sound.check();
        }
    } else
        Sound.moveComplete();
};

Board.prototype.showAvailableMoves = function (square) {

    if (square.Piece.Color != Board.ColorMoving)
        return;

    var legalMoves = Movement.getAllLegalMovesFromSquare(square);

    this.LastLegalMoves = legalMoves;

    for (var i = 0; i < legalMoves.length; i++) {
        var move = legalMoves[i];

        $(".square[data-row=" + move.Square.Row + "][data-col=" + move.Square.Col + "]").prepend("<div class='dot'></div>");

    }

};

Board.prototype.clearChecks = function () {

    $(".check").removeClass("check");

};

Board.prototype.checkmate = function (square) {

    $(".square[data-row=" + square.Row + "][data-col=" + square.Col + "]").addClass("checkmate");

};

Board.prototype.check = function (square) {

    this.ColorInCheck = square.Piece.Color;

    $(".square[data-row=" + square.Row + "][data-col=" + square.Col + "]").addClass("check");

};

Board.prototype.getKingSquare = function (color) {

    for (var col = 1; col <= 8; col++) {

        for (var row = 1; row <= 8; row++) {

            var square = this.GetSquares()[col][row];

            if (square.Piece == null)
                continue;

            if (square.Piece.Color == color && square.Piece.Piece == Pieces.King)
                return square;

        }
    }

};

Board.prototype.drawPieces = function () {

    for (var col = 1; col <= 8; col++) {

        for (var row = 1; row <= 8; row++) {

            var piece = this.Squares[col][row].Piece;

            if (piece == null)
                continue;

            var square = $(".square[data-row=" + row + "][data-col=" + col + "]");

            square.html(piece.getHtml());

        }
    }

};

Board.prototype.assignSquaresRowCol = function (playingColor) {

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

Board.prototype.initSquaresArrays = function () {

    for (var col = 1; col <= 8; col++) {
        this.Squares[col] = [9];
        for (var row = 1; row <= 8; row++) {
            this.Squares[col][row] = new Square(row, col);
        }
    }

};

Board.prototype.getSquaresWithPieces = function (color) {

    var pieces = [];

    for (var col = 1; col <= 8; col++) {

        for (var row = 1; row <= 8; row++) {

            var square = this.GetSquares()[col][row];

            if (square.Piece != null && square.Piece.Color == color)
                pieces.push(square);

        }

    }

    return pieces;

};

Board.prototype.getSquare = function (row, col) {

    return this.GetSquares()[col][row];

};

Board.prototype.movePieceTo = function (squareOn, squareTo) {

    squareTo.Piece = squareOn.Piece;
    squareOn.Piece = null;

};

Board.prototype.getAllSquaresWithPieces = function () {

    var allPieces = []

    allPieces.pushRange(this.getSquaresWithPieces(White));
    allPieces.pushRange(this.getSquaresWithPieces(Black));

    return allPieces;

};

Board.prototype.setPiecesToNewGame = function () {

    this.Squares[A][1].Piece = new Piece(White, Pieces.Rook);
    this.Squares[B][1].Piece = new Piece(White, Pieces.Knight);
    this.Squares[C][1].Piece = new Piece(White, Pieces.Bishop);
    this.Squares[D][1].Piece = new Piece(White, Pieces.Queen);
    this.Squares[E][1].Piece = new Piece(White, Pieces.King);
    this.Squares[F][1].Piece = new Piece(White, Pieces.Bishop);
    this.Squares[G][1].Piece = new Piece(White, Pieces.Knight);
    this.Squares[H][1].Piece = new Piece(White, Pieces.Rook);

    this.Squares[A][2].Piece = new Pawn(White);
    this.Squares[B][2].Piece = new Piece(White, Pieces.Pawn);
    this.Squares[C][2].Piece = new Piece(White, Pieces.Pawn);
    this.Squares[D][2].Piece = new Piece(White, Pieces.Pawn);
    this.Squares[E][2].Piece = new Piece(White, Pieces.Pawn);
    this.Squares[F][2].Piece = new Piece(White, Pieces.Pawn);
    this.Squares[G][2].Piece = new Piece(White, Pieces.Pawn);
    this.Squares[H][2].Piece = new Piece(White, Pieces.Pawn);

    this.Squares[A][8].Piece = new Piece(Black, Pieces.Rook);
    this.Squares[B][8].Piece = new Piece(Black, Pieces.Knight);
    this.Squares[C][8].Piece = new Piece(Black, Pieces.Bishop);
    this.Squares[D][8].Piece = new Piece(Black, Pieces.Queen);
    this.Squares[E][8].Piece = new Piece(Black, Pieces.King);
    this.Squares[F][8].Piece = new Piece(Black, Pieces.Bishop);
    this.Squares[G][8].Piece = new Piece(Black, Pieces.Knight);
    this.Squares[H][8].Piece = new Piece(Black, Pieces.Rook);

    this.Squares[A][7].Piece = new Pawn(Black);
    this.Squares[B][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[C][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[D][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[E][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[F][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[G][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[H][7].Piece = new Piece(Black, Pieces.Pawn);

};