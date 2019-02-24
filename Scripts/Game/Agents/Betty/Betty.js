
function Betty(colorPlaying, board) {

    Agent.call(this, BettyId, colorPlaying, board);

}

Betty.prototype = Object.create(new Agent());

Betty.prototype.agentMove = function () {

    var moves = this.GameBoard.Movement.getAllLegalMovesForColor(this.ColorPlaying);

    if (moves.length == 0)
        return;

    var randomMove = getRandomInt(0, moves.length - 1);

    var moveToPerform = moves[randomMove];

    this.GameBoard.performMove(moveToPerform.SquareOn, moveToPerform.SquareTo);

};