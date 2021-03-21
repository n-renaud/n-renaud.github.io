
function Agent(agentId, colorPlaying, board) {

    this.Id = agentId;
    this.ColorPlaying = colorPlaying;
    this.GameBoard = board;

}

Agent.prototype.move = function () {

    this.agentMove();

};

Agent.prototype.executeRandomMove = function (moves) {

    var randomMove = getRandomInt(0, moves.length - 1);

    var moveToPerform = moves[randomMove];

    this.GameBoard.performMove(moveToPerform.SquareOn, moveToPerform.SquareTo);

};

Agent.prototype.extractOffensiveMoves = function(moves) {

    var offensiveMoves = [];

    for (var i = 0; i < moves.length; i++) {

        var move = moves[i];

        if (move.SquareTo.Piece != null)
            offensiveMoves.push(move);

    }

    return offensiveMoves;

}