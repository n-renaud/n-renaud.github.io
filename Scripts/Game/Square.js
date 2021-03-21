
function Square(row, col) {

    this.Row = row;
    this.Col = col;
    this.Piece = null;

    this.Equals = function (otherSquare) {
        return otherSquare.Row == this.Row && otherSquare.Col == this.Col;
    }

}

Square.prototype.copy = function () {

    var newSquare = new Square(this.Row, this.Col);

    if (this.Piece != null)
        newSquare.Piece = this.Piece.copy();

    return newSquare;

}