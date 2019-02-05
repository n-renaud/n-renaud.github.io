
function Pawn(color) {

    Piece.call(this, color, Pieces.Pawn);

}

Pawn.prototype = Object.create(new Piece());

Pawn.prototype.isMoveLegal = function () {
    console.log("IsMoveLegal called");
};