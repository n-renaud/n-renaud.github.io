
Self = 1, AlbertId = 2, BettyId = 3;
ThinkingTime = 500;
A = 1, B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8;
Draw = -1, Black = 0, White = 1;
Pieces = { Pawn : 0, Knight : 1, Bishop : 2, Rook : 3, King : 4, Queen : 5 };
PiecesFolder = "Content/Images";

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

function getPieceText (piece) {

    if (piece == Pieces.Pawn)
        return "Pawn";
    else if (piece == Pieces.Rook)
        return "Rook";
    else if (piece == Pieces.Bishop)
        return "Bishop";
    else if (piece == Pieces.Knight)
        return "Knight";
    else if (piece == Pieces.King)
        return "King";
    else if (piece == Pieces.Queen)
        return "Queen";

};

function getPieceLetterText (piece) {

    if (piece == Pieces.Pawn)
        return "P";
    else if (piece == Pieces.Rook)
        return "R";
    else if (piece == Pieces.Bishop)
        return "B";
    else if (piece == Pieces.Knight)
        return "N";
    else if (piece == Pieces.King)
        return "K";
    else if (piece == Pieces.Queen)
        return "Q";

};

function getPGNPieceLetterText (piece) {

    if (piece == Pieces.Rook)
        return "R";
    else if (piece == Pieces.Bishop)
        return "B";
    else if (piece == Pieces.Knight)
        return "N";
    else if (piece == Pieces.King)
        return "K";
    else if (piece == Pieces.Queen)
        return "Q";
    else
        return "";

};

function getColText (col) {

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