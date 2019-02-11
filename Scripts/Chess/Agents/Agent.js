
function Agent(agentId, colorPlaying) {

    this.Id = agentId;
    this.ColorPlaying = colorPlaying;

}

Agent.prototype.move = function () {

    this.agentMove();

};