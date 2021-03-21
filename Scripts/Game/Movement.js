
function Movement(board) {

    var thisMovement = this;

    this.GameBoard = board;

    this[Pieces.Rook.Id] = [{ x: -7 }, { x: 7 }, { y: -7 }, { y: 7 }];

    this[Pieces.Bishop.Id] = [{ x: -7, y: -7 }, { x: -7, y: 7 }, { x: 7, y: -7 }, { x: 7, y: 7 }];

    this[Pieces.Knight.Id] = [
        { x: -2, y: 1 },
        { x: -1, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: -2, y: -1 },
        { x: -1, y: -2 },
        { x: 1, y: -2 },
        { x: 2, y: -1 }
    ];

    this[Pieces.Queen.Id] = [{ x: -7 }, { x: 7 }, { y: -7 }, { y: 7 }, { x: -7, y: -7 }, { x: -7, y: 7 }, { x: 7, y: -7 }, { x: 7, y: 7 }];

    //implement castling
    this[Pieces.King.Id] = [{ x: -1 }, { x: 1 }, { y: -1 }, { y: 1 }, { x: -1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: 1, y: 1 },
    {
        x: 2,
        condition: function (squareOn, color) {

            if (color != White || !thisMovement.GameBoard.WhiteRightCastling || thisMovement.GameBoard.ColorInCheck == White)
                return false;

            var F1 = thisMovement.GameBoard.getSquare(1, F);

            return thisMovement.wouldKingBeSafeAfterLegalMove(squareOn, F1);

        },
        onMove: function () {
            var rook = thisMovement.GameBoard.getSquare(1, H);
            var moveTo = thisMovement.GameBoard.getSquare(1, F);
            thisMovement.GameBoard.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    }, {
        x: -2,
        condition: function (squareOn, color) {
            if (color != White || !thisMovement.GameBoard.WhiteLeftCastling || thisMovement.GameBoard.ColorInCheck == White || thisMovement.GameBoard.getSquare(1, B).Piece != null)
                return false;

            var D1 = thisMovement.GameBoard.getSquare(1, D);

            return thisMovement.wouldKingBeSafeAfterLegalMove(squareOn, D1);

        },
        onMove: function () {
            var rook = thisMovement.GameBoard.getSquare(1, A);
            var moveTo = thisMovement.GameBoard.getSquare(1, D);
            thisMovement.GameBoard.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    }, {
        x: 2,
        condition: function (squareOn, color) {
            if (color != Black || !thisMovement.GameBoard.BlackRightCastling || thisMovement.GameBoard.ColorInCheck == Black)
                return false;

            var F8 = thisMovement.GameBoard.getSquare(8, F);

            return thisMovement.wouldKingBeSafeAfterLegalMove(squareOn, F8);

        },
        onMove: function () {
            var rook = thisMovement.GameBoard.getSquare(8, H);
            var moveTo = thisMovement.GameBoard.getSquare(8, F);
            thisMovement.GameBoard.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    }, {
        x: -2,
        condition: function (squareOn, color) {
            if (color != Black || !thisMovement.GameBoard.BlackLeftCastling || thisMovement.GameBoard.ColorInCheck == Black || thisMovement.GameBoard.getSquare(8, B).Piece != null)
                return false;

            var D8 = thisMovement.GameBoard.getSquare(8, D);

            return thisMovement.wouldKingBeSafeAfterLegalMove(squareOn, D8);

        },
        onMove: function () {
            var rook = thisMovement.GameBoard.getSquare(8, A);
            var moveTo = thisMovement.GameBoard.getSquare(8, D);
            thisMovement.GameBoard.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    }];

    //implement en passant
    this[Pieces.Pawn.Id] = [
        { y: 1, cantKill: true, condition: function (squareOn, color) { return color == White } },
        { y: 2, cantKill: true, condition: function (squareOn, color) { return squareOn.Row == 2 && color == White } },
        { y: 1, x: -1, mustKill: true, condition: function (squareOn, color) { return color == White } },
        { y: 1, x: 1, mustKill: true, condition: function (squareOn, color) { return color == White } },
        { y: -1, cantKill: true, condition: function (squareOn, color) { return color == Black } },
        { y: -2, cantKill: true, condition: function (squareOn, color) { return squareOn.Row == 7 && color == Black } },
        { y: -1, x: -1, mustKill: true, condition: function (squareOn, color) { return color == Black } },
        { y: -1, x: 1, mustKill: true, condition: function (squareOn, color) { return color == Black } }
    ];

}

Movement.prototype.isMoveLegal = function (squareOn, squareTo) {

    if (!this.validPieceColor(squareOn))
        return false;

    var moves = this.GameBoard.LastLegalMoves;

    var direction = null;

    for (var i = 0; i < moves.length; i++) {

        var square = moves[i].SquareTo;

        if (square.Row == squareTo.Row && square.Col == squareTo.Col) {
            direction = moves[i].Direction;
            break;
        }

    }

    return direction != null;

};

Movement.prototype.validPieceColor = function (squareOn) {

    if (this.GameBoard.ColorMoving != squareOn.Piece.Color)
        return false;

    return true;

}

Movement.prototype.getDirection = function (squareOn, squareTo) {

    var x = squareTo.Col - squareOn.Col;
    var y = squareTo.Row - squareOn.Row;

    var pieceDirections = this[squareOn.Piece.Piece.Id];

    var directionForMove = null;

    for (var i = 0; i < pieceDirections.length; i++) {

        var direction = pieceDirections[i];

        if (direction.condition != null && !direction.condition(squareOn, squareOn.Piece.Color))
            continue;

        var dirX = direction.x != null ? direction.x : 0;
        var dirY = direction.y != null ? direction.y : 0;

        if (dirX == x && dirY == y) {
            directionForMove = direction;
            break;
        }

    }

    return directionForMove;

};

Movement.prototype.isMoveUnique = function (square, legalMoves) {

    var unique = true;

    for (var i = 0; i < legalMoves.length; i++) {

        var legalMove = legalMoves[i];

        if (legalMove.SquareTo == square) {
            unique = false;
            break;
        }

    }

    return unique;
}

Movement.prototype.getAllLegalMovesFromSquare = function (squareOn) {

    var legalMoves = [];

    if (squareOn == null || squareOn.Piece == null)
        return legalMoves;

    var directions = this[squareOn.Piece.Piece.Id];

    for (var i = 0; i < directions.length; i++) {

        var direction = directions[i];

        if (direction.condition != null && !direction.condition(squareOn, squareOn.Piece.Color))
            continue;

        var legalSquares = this.getLegalSquaresFromDirection(squareOn, direction);

        for (var j = 0; j < legalSquares.length; j++)
            if (this.isMoveUnique(legalSquares[j], legalMoves))
                legalMoves.push(new Move(squareOn, legalSquares[j], direction));

    }

    return legalMoves;

};

Movement.prototype.getAllLegalDefenseMovesFromSquare = function (squareOn) {

    var legalMoves = [];

    if (squareOn == null || squareOn.Piece == null)
        return legalMoves;

    var directions = this[squareOn.Piece.Piece.Id];

    for (var i = 0; i < directions.length; i++) {

        var direction = directions[i];

        if (direction.cantKill || (direction.condition != null && !direction.condition(squareOn, squareOn.Piece.Color)))
            continue;

        var legalSquares = this.getLegalDefensesFromDirection(squareOn, direction);

        for (var j = 0; j < legalSquares.length; j++)
            if (this.isMoveUnique(legalSquares[j], legalMoves))
                legalMoves.push(new Move(squareOn, legalSquares[j], direction));

    }

    return legalMoves;

};

Movement.prototype.getAllSquaresDefendingSquare = function (board, squareToBeDefended, color) {

    var defendingSquares = [];

    if (squareToBeDefended == null)
        return defendingSquares;

    if (board.DefenseMatrix.length == 0)
        board.setupDefenseMatrix();

    return board.DefenseMatrix[squareToBeDefended.Col][squareToBeDefended.Row];

};

Movement.prototype.getLegalSquaresFromDirection = function (squareOn, direction) {

    var xDir = direction.x != null ? direction.x : 0;
    var yDir = direction.y != null ? direction.y : 0;

    var legalSquaresInDirection = [];

    if ((xDir != 0 && yDir != 0 && Math.abs(xDir) != Math.abs(yDir)) || (Math.abs(xDir) == 1 || Math.abs(yDir) == 1)) {

        var squareTo = this.getSingleSquare(squareOn, xDir, yDir);

        var legality = this.isSquareLegalToMoveTo(squareOn, squareTo, direction);

        if (legality == true)
            legalSquaresInDirection.push(squareTo);
        else if (legality.kill == true)
            legalSquaresInDirection.push(squareTo);

    } else
        legalSquaresInDirection.pushRange(this.getLegalSquaresInLine(squareOn, direction));

    return legalSquaresInDirection;

};

Movement.prototype.getLegalDefensesFromDirection = function (squareOn, direction) {

    var xDir = direction.x != null ? direction.x : 0;
    var yDir = direction.y != null ? direction.y : 0;

    var legalSquaresInDirection = [];

    if ((xDir != 0 && yDir != 0 && Math.abs(xDir) != Math.abs(yDir)) || (Math.abs(xDir) == 1 || Math.abs(yDir) == 1)) {

        var squareTo = this.getSingleSquare(squareOn, xDir, yDir);

        var legality = this.isSquareLegalToDefend(squareOn, squareTo, direction);

        if (legality == true)
            legalSquaresInDirection.push(squareTo);
        else if (legality.kill == true)
            legalSquaresInDirection.push(squareTo);

    } else
        legalSquaresInDirection.pushRange(this.getLegalDefenseSquaresInLine(squareOn, direction));

    return legalSquaresInDirection;

};

Movement.prototype.isSquareOccupied = function (squareTo) {

    if (squareTo != null) {

        if (squareTo.Piece == null)
            return false;

        return true;

    }

    return true;

};

Movement.prototype.getAllLegalMovesForColor = function (color) {

    var legalTargets = [];

    var allSquaresWithPieces = this.GameBoard.getSquaresWithPieces(color);

    for (var i = 0; i < allSquaresWithPieces.length; i++) {

        var square = allSquaresWithPieces[i];

        legalTargets.pushRange(this.getAllLegalMovesFromSquare(square));

    }

    return legalTargets;

};

Movement.prototype.getAllEnemyLegalMoves = function () {

    return this.getAllLegalMovesForColor(this.GameBoard.ColorMoving == White ? Black : White);

};

Movement.prototype.getAllMyLegalMoves = function () {

    return this.getAllLegalMovesForColor(this.GameBoard.ColorMoving);

};

Movement.prototype.getEnemySquaresTargettingSquare = function (square, allEnemyMoves) {

    var squaresTargetting = [];

    if (square == null)
        return squaresTargetting;

    for (var i = 0; i < allEnemyMoves.length; i++) {

        var enemyMove = allEnemyMoves[i];

        if (enemyMove.SquareTo.Row == square.Row && enemyMove.SquareTo.Col == square.Col && enemyMove.Direction.cantKill != true)
            squaresTargetting.push(enemyMove.SquareOn);

    }

    return squaresTargetting;

};

Movement.prototype.isSquareTargetedByEnemy = function (square, allEnemyMoves) {

    return this.getEnemySquaresTargettingSquare(square, allEnemyMoves).length > 0;

};

Movement.prototype.isSquareLegalToMoveTo = function (squareOn, squareTo, direction) {

    if (squareTo == null)
        return false;

    if (squareTo.Piece == null)
        return this.canPieceMoveToEmptySquare(squareOn, squareTo, direction);
    else
        return this.canPieceMoveToOccupiedSquare(squareOn, squareTo, direction);

};

Movement.prototype.isSquareLegalToDefend = function (squareOn, squareTo, direction) {

    if (squareOn == null || squareTo == null || direction == null)
        return false;

    if (squareTo.Equals(squareOn))
        return false;

    if (squareTo.Piece == null)
        return this.canPieceDefendEmptySquare(squareOn, squareTo, direction);
    else
        return this.canPieceDefendSquare(squareOn, squareTo, direction);

};

Movement.prototype.canPieceMoveToEmptySquare = function (squareOn, squareTo, direction) {

    if (direction != null && direction.mustKill == true)
        return false;

    if (this.wouldKingBeSafeAfterLegalMove(squareOn, squareTo))
        return true;
    else
        return { continue: true };

}

Movement.prototype.canPieceDefendEmptySquare = function (squareOn, squareTo, direction) {

    if (direction != null && direction.mustKill == true)
        return true;

    if (this.wouldKingBeSafeAfterLegalMove(squareOn, squareTo))
        return true;
    else
        return { continue: true };

}

Movement.prototype.canPieceMoveToOccupiedSquare = function (squareOn, squareTo, direction) {

    if (squareOn.Piece.Color == squareTo.Piece.Color)
        return false;

    if (direction != null && direction.cantKill == true)
        return false;

    if (this.wouldKingBeSafeAfterLegalMove(squareOn, squareTo))
        return { kill: true }

    return false;

}

Movement.prototype.canPieceDefendSquare = function (squareOn, squareTo, direction) {

    if (squareOn.Piece.Color != squareTo.Piece.Color)
        return false;

    if (direction != null && direction.cantKill == true)
        return false;

    if (this.wouldKingBeSafeAfterLegalMove(squareOn, squareTo))
        return { kill: true }

    return false;

}

Movement.prototype.wouldKingBeSafeAfterLegalMove = function (squareOn, squareTo) {

    if (squareOn.Piece.Color != this.GameBoard.ColorMoving && this.GameBoard.HypotheticalSquares.length > 0)
        return true;

    this.GameBoard.startHypotheticalMove(squareOn, squareTo);

    var enemyMoves = this.getAllEnemyLegalMoves();

    var kingSquare = this.GameBoard.getKingSquare(squareOn.Piece.Color);

    var wouldKingBeSafe = !this.isSquareTargetedByEnemy(kingSquare, enemyMoves);

    this.GameBoard.endHypotheticalMove();

    return wouldKingBeSafe;

};

Movement.prototype.getSingleSquare = function (squareOn, xDir, yDir) {

    var onX = squareOn.Col;
    var onY = squareOn.Row;

    var newX = onX + xDir;
    var newY = onY + yDir;

    if (isInBoard(newX, newY))
        return this.GameBoard.GetSquares()[newX][newY];

    return null

};

Movement.prototype.getLegalSquaresInLine = function (squareOn, direction) {

    var distanceCheck = direction.x != null ? direction.x : direction.y;

    var distance = Math.abs(distanceCheck);
    var squaresInLine = []

    var xDir = direction.x != null ? direction.x : 0;
    var yDir = direction.y != null ? direction.y : 0;

    var onX = squareOn.Col;
    var xSign = Math.sign(xDir);
    var onY = squareOn.Row;
    var ySign = Math.sign(yDir);

    for (var i = 1; i <= distance; i++) {

        var lineX = onX + (i * xSign);
        var lineY = onY + (i * ySign);

        if (!isInBoard(lineX, lineY))
            break;

        var squareTo = this.GameBoard.GetSquares()[lineX][lineY];

        var legality = this.isSquareLegalToMoveTo(squareOn, squareTo, direction);

        if (legality == true)
            squaresInLine.push(squareTo);
        else if (legality.kill == true) {
            squaresInLine.push(squareTo);
            break;
        }
        else if (legality.continue == true)
            continue;
        else if (legality == false)
            break;

    }

    return squaresInLine;

};

Movement.prototype.getLegalDefenseSquaresInLine = function (squareOn, direction) {

    var distanceCheck = direction.x != null ? direction.x : direction.y;

    var distance = Math.abs(distanceCheck);
    var squaresInLine = []

    var xDir = direction.x != null ? direction.x : 0;
    var yDir = direction.y != null ? direction.y : 0;

    var onX = squareOn.Col;
    var xSign = Math.sign(xDir);
    var onY = squareOn.Row;
    var ySign = Math.sign(yDir);

    for (var i = 1; i <= distance; i++) {

        var lineX = onX + (i * xSign);
        var lineY = onY + (i * ySign);

        if (!isInBoard(lineX, lineY))
            break;

        var squareTo = this.GameBoard.GetSquares()[lineX][lineY];

        if (squareTo.Equals(squareOn))
            return false;

        var legality = this.isSquareLegalToDefend(squareOn, squareTo, direction);

        if (legality == true)
            squaresInLine.push(squareTo);
        else if (legality.kill == true) {
            squaresInLine.push(squareTo);
            break;
        }
        else if (legality.continue == true)
            continue;
        else if (legality == false)
            break;

    }

    return squaresInLine;

};
