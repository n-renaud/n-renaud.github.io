
function Agent(agentId, colorPlaying, board) {

    this.Id = agentId;
    this.ColorPlaying = colorPlaying;
    this.GameBoard = board;

}

Agent.prototype.move = function () {

    this.agentMove();

};