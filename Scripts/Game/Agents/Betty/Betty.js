//Plays random offensive move, then random move

function Betty(colorPlaying, board) {

    Agent.call(this, BettyId, colorPlaying, board);

}

Betty.prototype = Object.create(new Agent());

Betty.prototype.agentMove = function () {

    var moves = this.GameBoard.Movement.getAllLegalMovesForColor(this.ColorPlaying);

    if (moves.length == 0)
        return;

    var offensiveMoves = this.extractOffensiveMoves(moves);

    if (offensiveMoves.length == 0)
        this.executeRandomMove(moves);
    else
        this.executeRandomMove(offensiveMoves);

};