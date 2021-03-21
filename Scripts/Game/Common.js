
var Self = 1, AlbertId = 2, BettyId = 3, CarlosId = 4;
var ThinkingTime = 500;
var A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8;
var Draw = -1, Black = 0, White = 1;

var Pieces = {
    Pawn: { Id: 0, Value: 1 },
    Knight: { Id: 1, Value: 3 },
    Bishop: { Id: 2, Value: 3 },
    Rook: { Id: 3, Value: 5 },
    King: { Id: 4, Value: 4 },
    Queen: { Id: 5, Value: 9 }
};

var PiecesFolder = "Content/Images";

Array.prototype.pushRange = function (rangeToPush) {

    if (this == null || rangeToPush == null)
        return;

    for (i = 0; i < rangeToPush.length; i++)
        this.push(rangeToPush[i]);

}

function getRandomInt(min, max) {
    max = max + 1;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function isInBoard(x, y) {
    return x >= 1 && x <= 8 && y >= 1 && y <= 8;
}

function guid(dashes) {

    if (dashes == null)
        dashes = true;

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    if (dashes)
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    else
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function getColorText(color) {

    if (color == White)
        return "White";
    else if (color == Black)
        return "Black";

};

function isBlack(color) {
    return color == Black;
};

function isWhite(color) {
    return color == White;
};

function getPieceText(piece) {

    if (piece == Pieces.Pawn.Id)
        return "Pawn";
    else if (piece == Pieces.Rook.Id)
        return "Rook";
    else if (piece == Pieces.Bishop.Id)
        return "Bishop";
    else if (piece == Pieces.Knight.Id)
        return "Knight";
    else if (piece == Pieces.King.Id)
        return "King";
    else if (piece == Pieces.Queen.Id)
        return "Queen";

};

function getPieceLetterText(piece) {

    if (piece == Pieces.Pawn.Id)
        return "P";
    else if (piece == Pieces.Rook.Id)
        return "R";
    else if (piece == Pieces.Bishop.Id)
        return "B";
    else if (piece == Pieces.Knight.Id)
        return "N";
    else if (piece == Pieces.King.Id)
        return "K";
    else if (piece == Pieces.Queen.Id)
        return "Q";

};

function getPGNPieceLetterText(piece) {

    if (piece == Pieces.Rook.Id)
        return "R";
    else if (piece == Pieces.Bishop.Id)
        return "B";
    else if (piece == Pieces.Knight.Id)
        return "N";
    else if (piece == Pieces.King.Id)
        return "K";
    else if (piece == Pieces.Queen.Id)
        return "Q";
    else
        return "";

};

function getColText(col) {

    if (col == A)
        return "a";
    else if (col == B)
        return "b";
    else if (col == C)
        return "c";
    else if (col == D)
        return "d";
    else if (col == E)
        return "e";
    else if (col == F)
        return "f";
    else if (col == G)
        return "g";
    else if (col == H)
        return "h";

};

function getSquareText(square) {
    return getColText(square.Col) + square.Row;
}