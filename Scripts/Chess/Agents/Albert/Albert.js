
function Albert(colorPlaying) {

    Agent.call(this, AlbertId, colorPlaying);

}

Albert.prototype = Object.create(new Agent());

Albert.prototype.agentMove = function () {

    var moves = Movement.getAllLegalMovesForColor(this.ColorPlaying);

    if (moves.length == 0)
        return;

    var randomMove = getRandomInt(0, moves.length - 1);

    var moveToPerform = moves[randomMove];

    executeAgentMove(moveToPerform.SquareOn, moveToPerform.SquareTo);

};