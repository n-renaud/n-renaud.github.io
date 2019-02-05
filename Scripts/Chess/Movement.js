
Movement = {};

Movement.isMoveLegal = function (squareOn, squareTo) {

    if (Board.ColorMoving != squareOn.Piece.Color)
        return null;

    var moves = Board.LastLegalMoves;

    var direction = null;

    for (var i = 0; i < moves.length; i++) {

        var square = moves[i].Square;

        if (square.Row == squareTo.Row && square.Col == squareTo.Col) {
            direction = moves[i].Direction;
            break;
        }

    }

    return direction;

};

Movement.getDirection = function (squareOn, squareTo) {

    var x = squareOn.Col - squareTo.Col;
    var y = squareOn.Row - squareTo.Row;

    var pieceDirections = Movement[squareOn.Piece.Piece];

    var directionForMove = null;

    for (var i = 0; i < pieceDirections.length; i++) {

        var direction = pieceDirections[i];

        var dirX = direction.x != null ? direction.x : 0;
        var dirY = direction.y != null ? direction.y : 0;

        if (dirX == x && dirY == y) {
            directionForMove = direction;
            break;
        }

    }

    return directionForMove;

};

Movement.isMoveUnique = function (square, legalMoves) {

    var unique = true;

    for (var i = 0; i < legalMoves.length; i++) {

        var legalMove = legalMoves[i];

        if (legalMove.Square == square) {
            unique = false;
            break;
        }

    }

    return unique;
}

Movement.getAllLegalMovesFromSquare = function (squareOn) {

    var legalMoves = [];

    if (squareOn == null || squareOn.Piece == null)
        return legalMoves;

    var directions = Movement[squareOn.Piece.Piece];

    for (var i = 0; i < directions.length; i++) {

        var direction = directions[i];

        if (direction.condition != null && !direction.condition(squareOn, squareOn.Piece.Color))
            continue;

        var legalSquares = Movement.getLegalSquaresFromDirection(squareOn, direction);

        for (var j = 0; j < legalSquares.length; j++)
            if (Movement.isMoveUnique(legalSquares[j], legalMoves))
                legalMoves.push(new Move(legalSquares[j], direction));

    }

    return legalMoves;

};

Movement.getLegalSquaresFromDirection = function (squareOn, direction) {

    var xDir = direction.x != null ? direction.x : 0;
    var yDir = direction.y != null ? direction.y : 0;

    var legalSquaresInDirection = [];

    if ((xDir != 0 && yDir != 0 && Math.abs(xDir) != Math.abs(yDir)) || (Math.abs(xDir) == 1 || Math.abs(yDir) == 1)) {

        var squareTo = Movement.getSingleSquare(squareOn, xDir, yDir);

        var legality = Movement.isSquareLegalToMoveTo(squareOn, squareTo, direction);

        if (legality == true)
            legalSquaresInDirection.push(squareTo);
        else if (legality.kill == true)
            legalSquaresInDirection.push(squareTo);

    } else
        legalSquaresInDirection.pushRange(Movement.getLegalSquaresInLine(squareOn, direction));

    return legalSquaresInDirection;

};

Movement.isSquareOccupied = function (squareTo) {

    if (squareTo != null) {

        if (squareTo.Piece == null)
            return false;

        return true;

    }

    return true;

};

Movement.getAllLegalMovesForColor = function (color) {

    var legalTargets = []

    var allSquaresWithPieces = Board.getSquaresWithPieces(color);

    for (var i = 0; i < allSquaresWithPieces.length; i++) {

        var square = allSquaresWithPieces[i];

        legalTargets.pushRange(Movement.getAllLegalMovesFromSquare(square));

    }

    return legalTargets;

};

Movement.getAllEnemyLegalMoves = function () {

    return Movement.getAllLegalMovesForColor(Board.ColorMoving == White ? Black : White);

};

Movement.getAllMyLegalMoves = function () {

    return Movement.getAllLegalMovesForColor(Board.ColorMoving);

};

Movement.isSquareTargetedByEnemy = function (square, allEnemyMoves) {

    var isSquareTargeted = false;

    for (var i = 0; i < allEnemyMoves.length; i++) {

        var enemyMove = allEnemyMoves[i];

        if (enemyMove.Square.Row == square.Row && enemyMove.Square.Col == square.Col && enemyMove.Direction.cantKill != true) {
            isSquareTargeted = true;
            break;
        }

    }

    return isSquareTargeted;

};

Movement.isSquareLegalToMoveTo = function (squareOn, squareTo, direction) {

    if (squareTo == null)
        return false;

    if (squareTo.Piece == null)
        return Movement.canPieceMoveToEmptySquare(squareOn, squareTo, direction);
    else
        return Movement.canPieceMoveToOccupiedSquare(squareOn, squareTo, direction);

}

Movement.canPieceMoveToEmptySquare = function (squareOn, squareTo, direction) {

    if (direction != null && direction.mustKill == true)
        return false;

    if (Movement.wouldKingBeSafeAfterLegalMove(squareOn, squareTo))
        return true;
    else
        return { continue: true };

}

Movement.canPieceMoveToOccupiedSquare = function (squareOn, squareTo, direction) {

    if (squareOn.Piece.Color == squareTo.Piece.Color)
        return false;

    if (direction != null && direction.cantKill == true)
        return false;

    if (Movement.wouldKingBeSafeAfterLegalMove(squareOn, squareTo))
        return { kill: true }

    return false;

}

Movement.wouldKingBeSafeAfterLegalMove = function (squareOn, squareTo) {

    if (squareOn.Piece.Color != Board.ColorMoving)
        return true;

    Board.startHypotheticalMove(squareOn, squareTo);

    var enemyMoves = Movement.getAllEnemyLegalMoves();

    var kingSquare = Board.getKingSquare(squareOn.Piece.Color);

    var wouldKingBeSafe = !Movement.isSquareTargetedByEnemy(kingSquare, enemyMoves);

    Board.endHypotheticalMove();

    return wouldKingBeSafe;

};

Movement.getSingleSquare = function (squareOn, xDir, yDir) {

    var onX = squareOn.Col;
    var onY = squareOn.Row;

    var newX = onX + xDir;
    var newY = onY + yDir;

    if (isInBoard(newX, newY))
        return Board.GetSquares()[newX][newY];

    return null

};

Movement.getLegalSquaresInLine = function (squareOn, direction) {

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

        var squareTo = Board.GetSquares()[lineX][lineY];

        var legality = Movement.isSquareLegalToMoveTo(squareOn, squareTo, direction);

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

Movement[Pieces.Rook] = [{ x: -7 }, { x: 7 }, { y: -7 }, { y: 7 }];

Movement[Pieces.Bishop] = [{ x: -7, y: -7 }, { x: -7, y: 7 }, { x: 7, y: -7 }, { x: 7, y: 7 }];

Movement[Pieces.Knight] = [
    { x: -2, y: 1 },
    { x: -1, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: -2, y: -1 },
    { x: -1, y: -2 },
    { x: 1, y: -2 },
    { x: 2, y: -1 }
];

Movement[Pieces.Queen] = [{ x: -7 }, { x: 7 }, { y: -7 }, { y: 7 }, { x: -7, y: -7 }, { x: -7, y: 7 }, { x: 7, y: -7 }, { x: 7, y: 7 }];

//implement castling
Movement[Pieces.King] = [{ x: -1 }, { x: 1 }, { y: -1 }, { y: 1 }, { x: -1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: 1, y: 1 },
    {
        x: 2,
        condition: function (squareOn, color) {

            if (color != White || !Board.WhiteRightCastling || Board.ColorInCheck == White)
                return false;

            var F1 = Board.getSquare(1, F);

            return Movement.wouldKingBeSafeAfterLegalMove(squareOn, F1);

        },
        onMove: function () {
            var rook = Board.getSquare(1, H);
            var moveTo = Board.getSquare(1, F);
            Board.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    },{
        x: -2,
        condition: function (squareOn, color) {
            if (color != White || !Board.WhiteLeftCastling || Board.ColorInCheck == White || Board.getSquare(1, B).Piece != null)
                return false;

            var D1 = Board.getSquare(1, D);

            return Movement.wouldKingBeSafeAfterLegalMove(squareOn, D1);

        },
        onMove: function () {
            var rook = Board.getSquare(1, A);
            var moveTo = Board.getSquare(1, D);
            Board.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    },{
        x: 2,
        condition: function (squareOn, color) {
            if (color != Black || !Board.BlackRightCastling || Board.ColorInCheck == Black)
                return false;

            var F8 = Board.getSquare(8, F);

            return Movement.wouldKingBeSafeAfterLegalMove(squareOn, F8);

        },
        onMove: function () {
            var rook = Board.getSquare(8, H);
            var moveTo = Board.getSquare(8, F);
            Board.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    },{
        x: -2,
        condition: function (squareOn, color) {
            if (color != Black || !Board.BlackLeftCastling || Board.ColorInCheck == Black || Board.getSquare(8, B).Piece != null)
                return false;

            var D8 = Board.getSquare(8, D);

            return Movement.wouldKingBeSafeAfterLegalMove(squareOn, D8);

        },
        onMove: function () {
            var rook = Board.getSquare(8, A);
            var moveTo = Board.getSquare(8, D);
            Board.movePieceTo(rook, moveTo);
            return { castle: [rook, moveTo] };
        }
    }];

//implement en passant
Movement[Pieces.Pawn] = [
    { y: 1, cantKill: true, condition: function (squareOn, color) { return color == White } },
    { y: 2, cantKill: true, condition: function (squareOn, color) { return squareOn.Row == 2 && color == White } },
    { y: 1, x: -1, mustKill: true, condition: function (squareOn, color) { return color == White } },
    { y: 1, x: 1, mustKill: true, condition: function (squareOn, color) { return color == White } },
    { y: -1, cantKill: true, condition: function (squareOn, color) { return color == Black } },
    { y: -2, cantKill: true, condition: function (squareOn, color) { return squareOn.Row == 7 && color == Black } },
    { y: -1, x: -1, mustKill: true, condition: function (squareOn, color) { return color == Black } },
    { y: -1, x: 1, mustKill: true, condition: function (squareOn, color) { return color == Black } }
];
