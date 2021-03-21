
function newBoard(whiteId, blackId) {

    var GameBoard = new Board();

    GameBoard.White = getPlayer(whiteId, White, GameBoard);

    GameBoard.Black = getPlayer(blackId, Black, GameBoard);

    return GameBoard;

}

function getPlayer(playerId, playerColor, board) {

    switch (playerId) {
        case "1":
        case 1:
            return Self; break;
        case "2":
        case 2:
            return new Albert(playerColor, board); break;
        case "3":
        case 3:
            return new Betty(playerColor, board); break;
        case "4":
        case 4:
            return new Carlos(playerColor, board); break;
        default:
            console.error("Invalid agent Id: " + playerId);
    }

}