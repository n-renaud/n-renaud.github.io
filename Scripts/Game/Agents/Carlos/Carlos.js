//Single depth, single move evaluations (only evaluates the next possible moves, no opponent moves afterwards)

function Carlos(colorPlaying, board) {

    Agent.call(this, CarlosId, colorPlaying, board);

}

Carlos.prototype = Object.create(new Agent());

Carlos.prototype.agentMove = function () {

    var moves = this.GameBoard.Movement.getAllLegalMovesForColor(this.ColorPlaying);

    if (moves.length == 0)
        return;

    var moveBoards = [];

    for (var i = 0; i < moves.length; i++) {

        var move = moves[i];

        var moveBoard = this.GameBoard.Copy();

        moveBoard.performMove(moveBoard.getSquare(move.SquareOn.Row, move.SquareOn.Col), moveBoard.getSquare(move.SquareTo.Row, move.SquareTo.Col));

        this.evaluateBoard(moveBoard);

        moveBoards.push(moveBoard);

    }

    var highestBoardIndex = 0;
    var highestScore = -9999999999999999999;

    if (this.ColorPlaying == Black) {
        for (var i = 0; i < moveBoards.length; i++)
            if (moveBoards[i].BlackScore > highestScore) {
                highestScore = moveBoards[i].BlackScore;
                highestBoardIndex = i;
            }

    } else if (this.ColorPlaying == White) {
        for (var i = 0; i < moveBoards.length; i++)
            if (moveBoards[i].WhiteScore > highestScore) {
                highestScore = moveBoards[i].WhiteScore;
                highestBoardIndex = i;
            }
    }

    this.GameBoard.performMove(moves[highestBoardIndex].SquareOn, moves[highestBoardIndex].SquareTo);

};

Carlos.prototype.evaluateBoard = function (board) {

    board.WhiteScore = this.evaluateColor(board, White);
    board.BlackScore = this.evaluateColor(board, Black);

};

Carlos.prototype.evaluateColor = function (board, color) {

    if (board.ColorInCheckMate != null) {
        if (board.ColorInCheckMate != color)
            return 1000000;
        else if (board.ColorInCheckMate == color)
            return -1000000;
    }

    if (board.ColorInStaleMate != null) {
        if (board.ColorInStaleMate != color)
            return -1000000;
        else if (board.ColorInStaleMate == color)
            return 0;
    }

    if (board.MovesSincePawnOrTake >= 50)
        return 0;

    var allColorSquares = board.getSquaresWithPieces(color);

    var value = 0;

    for (var i = 0; i < allColorSquares.length; i++)
        value += this.evaluateSquare(board, allColorSquares[i]);

    return value;

}

Carlos.prototype.evaluateSquare = function (board, square) {

    if (square.Piece == null)
        return 0;

    var checkBonus = 1.05;

    var piece = square.Piece;
    var color = piece.Color;

    var value = piece.Piece.Value;

    var squaresDefendingSquare = board.Movement.getAllSquaresDefendingSquare(board, square, color);
    var piecesDefendingSquare = [];

    for (var i = 0; i < squaresDefendingSquare.length; i++)
        piecesDefendingSquare.push(squaresDefendingSquare[i].Piece);

    var isSquareDefended = squaresDefendingSquare.length > 0;

    if (isSquareDefended)
        for (var i = 0; i < piecesDefendingSquare.length; i++)
            value += piecesDefendingSquare[i].Piece.Value * 0.5;
    else
        value -= piece.Piece.Value * 10;

    var allEnemyLegalMoves = board.Movement.getAllLegalMovesForColor(color == White ? Black : White)

    var squaresTargettingSquare = board.Movement.getEnemySquaresTargettingSquare(square, allEnemyLegalMoves);
    var piecesAttackingSquare = [];

    for (var i = 0; i < squaresTargettingSquare.length; i++)
        piecesAttackingSquare.push(squaresTargettingSquare[i].Piece);

    var squareIsAttacked = piecesAttackingSquare.length > 0;

    if (squareIsAttacked) {
        if (piecesAttackingSquare.length <= piecesDefendingSquare.length) {
            for (var i = 0; i < piecesAttackingSquare.length; i++)
                value += piecesAttackingSquare[i].Piece.Value * 0.5;
            for (var i = 0; i < piecesDefendingSquare.length; i++)
                value -= piecesDefendingSquare[i].Piece.Value * 0.25;
        } else {
            for (var i = 0; i < piecesAttackingSquare.length; i++)
                value += piecesAttackingSquare[i].Piece.Value * 0.25;
            for (var i = 0; i < piecesDefendingSquare.length; i++)
                value -= piecesDefendingSquare[i].Piece.Value * 0.5;
        }
    }

    if (board.ColorInCheck != null && board.ColorInCheck != color)
        value = value * checkBonus;

    return value;

};