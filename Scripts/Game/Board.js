
function Board() {

    this.Movement = new Movement(this);
    this.Squares = [9];
    this.HypotheticalSquares = [];
    this.PGN = [];
    this.LastLegalMoves = null;
    this.White = null;
    this.Black = null;

    this.GameResult = null;
    this.ColorInCheck = null;
    this.ColorInCheckMate = null;
    this.ColorInStaleMate = null;
    this.ColorMoving = White;
    this.ColorViewing = White;

    this.WhiteLeftCastling = true;
    this.WhiteRightCastling = true;
    this.BlackLeftCastling = true;
    this.BlackRightCastling = true;

    this.initSquaresArrays();
    this.setPiecesToNewGame();

}

Board.prototype.gameEndChecks = function () {

    if (this.ColorInCheckMate != null)
        this.GameResult = "Checkmate: " + getColorText(this.ColorInCheckMate == White ? Black : White) + " wins";

    if (this.ColorInStaleMate != null)
        this.GameResult = "Stalemate: " + getColorText(this.ColorMoving) + ". Draw";

    if (this.getAllSquaresWithPieces().length == 2)
        this.GameResult = "King Draw";

};

Board.prototype.tryPerformNextMove = function () {

    if (this.GameResult != null)
        return false;

    if (this.ColorMoving == White && this.White != Self) {
        this.White.move();
        this.gameEndChecks();
        return true;
    } else if (this.ColorMoving == Black && this.Black != Self) {
        this.Black.move();
        this.gameEndChecks();
        return true;
    }

    return false;

};

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

Board.prototype.pawnPromotionCheck = function (square) {

    var piece = square.Piece;

    if (piece.Piece != Pieces.Pawn)
        return;

    if (piece.Color == White && square.Row == 8)
        square.Piece = new Piece(White, Pieces.Queen);
    else if (piece.Color == Black && square.Row == 1)
        square.Piece = new Piece(Black, Pieces.Queen);

}

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
        else if (squareTo.Col == H)
            this.WhiteRightCastling = false;

};

Board.prototype.GetSquares = function () {

    if (this.HypotheticalSquares.length == 0)
        return this.Squares;

    return this.HypotheticalSquares[this.HypotheticalSquares.length - 1];

};

Board.prototype.startHypotheticalMove = function (squareOn, squareTo) {

    this.HypotheticalSquares.push(JSON.parse(JSON.stringify(this.Squares)));

    squareOn = this.getSquare(squareOn.Row, squareOn.Col);
    squareTo = this.getSquare(squareTo.Row, squareTo.Col);

    this.movePieceTo(squareOn, squareTo);

};

Board.prototype.endHypotheticalMove = function () {

    if (this.HypotheticalSquares.length == 0)
        return;

    this.HypotheticalSquares.splice(this.HypotheticalSquares.length - 1, 1);

};

Board.prototype.tryPerformMove = function (squareOn, squareTo) {

    if (!this.Movement.isMoveLegal(squareOn, squareTo))
        return false;

    var direction = this.Movement.getDirection(squareOn, squareTo);

    this.performMove(squareOn, squareTo);

    if (direction != null && direction.onMove != null)
        direction.onMove();
    
    this.gameEndChecks();

    return true;

};


Board.prototype.performMove = function (squareOn, squareTo) {

    addPly(this, squareOn, squareTo);

    this.castlingChecks(squareOn, squareTo);

    this.movePieceTo(squareOn, squareTo);

    this.pawnPromotionCheck(squareTo);

    this.resolveMove();

    this.checkForChecks();

};

Board.prototype.resolveMove = function () {
    this.ColorMoving = this.ColorMoving == White ? Black : White;
};

Board.prototype.checkForChecks = function () {

    this.ColorInCheck = null;
    this.ColorInCheckMate = null;
    this.ColorInStaleMate = null;

    var defenderColor = this.ColorMoving == White ? Black : White;

    var defenderKingSquare = this.getKingSquare(this.ColorMoving);

    var allAttackerMoves = this.Movement.getAllLegalMovesForColor(defenderColor);

    if (this.Movement.isSquareTargetedByEnemy(defenderKingSquare, allAttackerMoves)) {

        if (this.Movement.getAllLegalMovesForColor(this.ColorMoving).length == 0) {
            this.ColorInCheckMate = this.ColorMoving;
            checkmateCurrentPly(this);
        } else {
            this.ColorInCheck = this.ColorMoving;
            checkCurrentPly(this);
        }

    } else if (this.Movement.getAllLegalMovesForColor(this.ColorMoving).length == 0) {
        this.ColorInStaleMate = this.ColorMoving;
        stalemateCurrentPly(this);
    }

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

    this.Squares[A][2].Piece = new Piece(White, Pieces.Pawn);
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

    this.Squares[A][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[B][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[C][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[D][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[E][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[F][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[G][7].Piece = new Piece(Black, Pieces.Pawn);
    this.Squares[H][7].Piece = new Piece(Black, Pieces.Pawn);

};