
function Board(copy) {

    this.Movement = new Movement(this);
    this.HypotheticalSquares = [];
    this.Squares = [];
    this.PGN = [];
    this.DefenseMatrix = [];

    this.LastLegalMoves = copy?.LastLegalMoves ?? null;
    this.White = copy?.White ?? null;
    this.Black = copy?.Black ?? null;
    this.WhiteScore = copy?.WhiteScore ?? null;
    this.BlackScore = copy?.BlackScore ?? null;

    this.GameResult = copy?.GameResult ?? null;
    this.ColorInCheck = copy?.ColorInCheck ?? null;
    this.ColorInCheckMate = copy?.ColorInCheckMate ?? null;
    this.ColorInStaleMate = copy?.ColorInStaleMate ?? null;
    this.ColorMoving = copy?.ColorMoving ?? White;
    this.ColorViewing = copy?.ColorViewing ?? White;

    this.WhiteLeftCastling = copy?.WhiteLeftCastling ?? true;
    this.WhiteRightCastling = copy?.WhiteRightCastling ?? true;
    this.BlackLeftCastling = copy?.BlackLeftCastling ?? true;
    this.BlackRightCastling = copy?.BlackRightCastling ?? true;

    this.MovesSincePawnOrTake = copy?.MovesSincePawnOrTake ?? 0;

    if (copy == null) {

        this.initSquaresArrays();
        this.setPiecesToNewGame();

    } else {

        for (var i = 1; i < copy.Squares.length; i++) {
            var squares = copy.Squares[i];
            this.Squares[i] = [];
            for (var j = 1; j < squares.length; j++)
                this.Squares[i][j] = copy.Squares[i][j].copy();
        }

        this.PGN = JSON.parse(JSON.stringify(copy.PGN));

    }

}

Board.prototype.Copy = function () {

    return new Board(this);

}

Board.prototype.GetColorScorePercent = function (color) {

    var total = this.WhiteScore + this.BlackScore;

    if (color == White)
        return (this.WhiteScore / total) * 100;
    if (color == Black)
        return (this.BlackScore / total) * 100;

}

Board.prototype.gameEndChecks = function () {

    if (this.MovesSincePawnOrTake >= 50)
        this.GameResult = "Draw: 50 moves";

    if (this.ColorInCheckMate != null)
        this.GameResult = "Checkmate: " + getColorText(this.ColorInCheckMate == White ? Black : White) + " wins";

    if (this.ColorInStaleMate != null)
        this.GameResult = "Draw: " + getColorText(this.ColorMoving) + " cannot move";

    if (this.getAllSquaresWithPieces().length == 2)
        this.GameResult = "Draw: Kings";

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

    if (squareMoving.Piece.Piece.Id == Pieces.King.Id) {
        this.WhiteLeftCastling = false;
        this.WhiteRightCastling = false;
    }

    if (squareMoving.Piece.Piece.Id == Pieces.Rook.Id)
        if (squareMoving.Col == A)
            this.WhiteLeftCastling = false;
        else if (squareMoving.Col == H)
            this.WhiteRightCastling = false;

    if (squareTo.Piece != null && squareTo.Piece.Piece.Id == Pieces.Rook.Id)
        if (squareTo.Col == A)
            this.BlackLeftCastling = false;
        else if (squareTo.Col == H)
            this.BlackRightCastling = false;

};

Board.prototype.pawnPromotionCheck = function (square) {

    var piece = square.Piece;

    if (piece.Piece.Id != Pieces.Pawn.Id)
        return;

    if (piece.Color == White && square.Row == 8)
        square.Piece = new Piece(White, Pieces.Queen);
    else if (piece.Color == Black && square.Row == 1)
        square.Piece = new Piece(Black, Pieces.Queen);

}

Board.prototype.blackCastlingChecks = function (squareMoving, squareTo) {

    if (squareMoving.Piece.Piece.Id == Pieces.King.Id) {
        this.BlackLeftCastling = false;
        this.BlackRightCastling = false;
    }

    if (squareMoving.Piece.Piece.Id == Pieces.Rook.Id)
        if (squareMoving.Col == A)
            this.BlackLeftCastling = false;
        else if (squareMoving.Col == H)
            this.BlackRightCastling = false;

    if (squareTo.Piece != null && squareTo.Piece.Piece.Id == Pieces.Rook.Id)
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

    this.pawnOrTakeCheck(squareOn, squareTo);

    this.castlingChecks(squareOn, squareTo);

    this.movePieceTo(squareOn, squareTo);

    this.pawnPromotionCheck(squareTo);

    this.resolveMove();

    this.checkForChecks();

};

Board.prototype.pawnOrTakeCheck = function (squareOn, squareTo) {

    if (squareOn.Piece.Piece.Id == Pieces.Pawn.Id ||
        squareTo.Piece != null)
        this.MovesSincePawnOrTake = 0;
    else
        this.MovesSincePawnOrTake++;

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

            if (square.Piece.Color == color && square.Piece.Piece.Id == Pieces.King.Id)
                return square;

        }
    }

};

Board.prototype.initSquaresArrays = function () {

    for (var col = 1; col <= 8; col++) {
        this.Squares[col] = [];
        for (var row = 1; row <= 8; row++) {
            this.Squares[col][row] = new Square(row, col);
        }
    }

};

Board.prototype.initDefenseMatrix = function () {

    for (var col = 1; col <= 8; col++) {
        this.DefenseMatrix[col] = [];
        for (var row = 1; row <= 8; row++) {
            this.DefenseMatrix[col][row] = [];
        }
    }

};

Board.prototype.getSquaresWithPieces = function (color) {

    var squares = [];

    for (var col = 1; col <= 8; col++) {

        for (var row = 1; row <= 8; row++) {

            var square = this.GetSquares()[col][row];

            if (square.Piece != null && square.Piece.Color == color)
                squares.push(square);

        }

    }

    return squares;

};

Board.prototype.getAllSquares = function () {

    var squares = [];

    for (var col = 1; col <= 8; col++)
        for (var row = 1; row <= 8; row++)
            squares.push(this.GetSquares()[col][row]);

    return squares;

};

Board.prototype.getSquare = function (row, col) {

    return this.GetSquares()[col][row];

};

Board.prototype.setupDefenseMatrix = function () {

    this.initDefenseMatrix();

    var squaresWithPieces = this.getAllSquaresWithPieces();

    for (var i = 0; i < squaresWithPieces.length; i++) {

        var square = squaresWithPieces[i];

        var legalDefensesForSquare = this.Movement.getAllLegalDefenseMovesFromSquare(square);

        for (var j = 0; j < legalDefensesForSquare.length; j++) {

            var defenseMove = legalDefensesForSquare[j];

            this.DefenseMatrix[defenseMove.SquareTo.Col][defenseMove.SquareTo.Row].push(defenseMove.SquareOn);

        }

    }

}

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