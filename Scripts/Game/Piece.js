﻿
function Piece(color, piece) {

    this.Id = guid(false);
    this.Color = color;
    this.Piece = piece;

}

Piece.prototype.ImageText = function () {

    return PiecesFolder + "/" + getColorText(this.Color) + getPieceText(this.Piece) + ".png";

};

Piece.prototype.getHtml = function () {
    return "<img class='piece' data-id='" + this.Id +"' data-piece='" + this.Piece + "' data-color='" + this.Color + "' src='" + this.ImageText() + "'/>";
};