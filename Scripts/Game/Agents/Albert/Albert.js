//Plays random moves

function Albert(colorPlaying, board) {

    Agent.call(this, AlbertId, colorPlaying, board);

}

Albert.prototype = Object.create(new Agent());

Albert.prototype.agentMove = function () {

    var moves = this.GameBoard.Movement.getAllLegalMovesForColor(this.ColorPlaying);

    if (moves.length == 0)
        return;

    this.executeRandomMove(moves);

};