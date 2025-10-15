function Gameboard() {
    const gameboard = [];
    const rows = 3;
    const columns = 3;

    let repeatTurn = false;

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
        repeatTurn = false;
       }
       else {
        repeatTurn = true;
        console.log("This cell is already taken!");
       }
    };

    const getRepeatTurn = () => repeatTurn;

    const printGameboard = () => {
        const gameboardWithValues = gameboard.map((row) => row.map((cell) => cell.getValue()));
        console.log(gameboardWithValues);
    }

    return { getGameboard, placeMark, printGameboard, getRepeatTurn };
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
        if (!board.getRepeatTurn()) {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        }
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printGameboard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const printFinalBoard = () => {
        board.printGameboard();
        console.log(`Game over!`);
    }

    const playRound = (row, column) => {
        console.log(`Placing ${getActivePlayer().name}'s mark in row ${row}, column ${column}...`);
        board.placeMark(row, column, getActivePlayer().mark);

        const rawBoard = board.getGameboard();

        const checkWinner = () => {
            const winningCombos = [
                [[0,0], [0,1], [0,2]],
                [[1,0], [1,1], [1,2]],
                [[2,0], [2,1], [2,2]],
                [[0,0], [1,0], [2,0]],
                [[0,1], [1,1], [2,1]],
                [[0,2], [1,2], [2,2]],
                [[0,0], [1,1], [2,2]],
                [[0,2], [1,1], [2,0]]
            ];

            return winningCombos.some(
                combo => combo.every(([row, col]) => rawBoard[row][col].getValue() === getActivePlayer().mark)
            );
        }

        if (checkWinner()) {
            console.log(`Congrats ${getActivePlayer().name}, you won!`);
            printFinalBoard();
        }
        else {
            switchPlayerTurn(); //ne spremenit če je probal dat na zasedeno mesto
            printNewRound();
        };
    };

    return { playRound, getActivePlayer, getGameboard: board.getGameboard };
} 

function ScreenController() {
    const game = GameController();
    const playerTurnText = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {

        boardDiv.textContent = "";

        const board = game.getGameboard();
        const activePlayer = game.getActivePlayer();

        playerTurnText.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            });
        });
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController()