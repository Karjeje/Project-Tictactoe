function Gameboard() {
    const gameboard = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i].push(Cell());
        }
    }

    const getGameboard = () => gameboard;

    const placeMark = (row, column, player) => {

       if (gameboard[row][column].getValue() === 0) {
        gameboard[row][column].addMark(player);
       }
       else {
        console.log("This cell is already taken!");
       }
    };

    const printGameboard = () => {
        const gameboardWithValues = gameboard.map((row) => row.map((cell) => cell.getValue()));
        console.log(gameboardWithValues);
    }

    return { getGameboard, placeMark, printGameboard };
}

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addMark, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {

    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            mark: 1
        },
        {
            name: playerTwoName,
            mark: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printGameboard();
        console.log(`${getActivePlayer}'s turn.`);
    }

    const playRound = (row, column) => {
        console.log(`Placing ${getActivePlayer}'s mark in row ${row}, column ${column}...`);
        board.placeMark(row, column, getActivePlayer().mark);

        //check for winner

        switchPlayerTurn();
        printNewRound();
    };

    return { playRound, getActivePlayer };
} 