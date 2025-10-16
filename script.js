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

    const reset = () => {
        value = 0;
    }

    return { addMark, getValue, reset };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {

    const board = Gameboard();
    let gameStatus;

    const getGameStatus = () => gameStatus;

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

        const checkUnusedCells = () => {
            return rawBoard.some(row => row.some(cell => cell.getValue() === 0))
        }

        if (checkWinner()) {
            console.log(`Congrats ${getActivePlayer().name}, you won!`);
            printFinalBoard();
            gameStatus = "win";
        }
        else if (!checkUnusedCells()) {
            console.log(`It's a tie!`);
            printFinalBoard();
            gameStatus = "tie"
        }
        else {
            switchPlayerTurn(); //ne spremenit če je probal dat na zasedeno mesto
            printNewRound();
        };
    };

    const resetGame = () => {
    const rawBoard = board.getGameboard();
    rawBoard.forEach(row => {
        row.forEach(cell => cell.reset());
    });
    activePlayer = players[0];
    gameStatus = undefined;
};

    return { playRound, getActivePlayer, getGameboard: board.getGameboard, getGameStatus, resetGame };
} 

function ScreenController() {
    const game = GameController();
    const container = document.querySelector(".container");
    const playerTurnText = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    

    const updateScreen = () => {

        boardDiv.textContent = "";

        const board = game.getGameboard();
        const activePlayer = game.getActivePlayer();
        const gameStatus = game.getGameStatus();

        playerTurnText.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;


                if (cell.getValue() === 0) {
                    cellButton.textContent = "";
                    cellButton.classList.add("available"); // ✅ only unplayed cells are hoverable
                } 
                else {
                    cellButton.textContent = cell.getValue() === 1 ? "X" : "O";
                }
                
                boardDiv.appendChild(cellButton);
            });
        });

        if (gameStatus === "win") {
            playerTurnText.textContent = `Game over!`;
            const resultText = document.createElement("h2");
            resultText.classList.add("result");
            resultText.textContent = `${activePlayer.name} has won!`;
            container.appendChild(resultText);
        }
        else if (gameStatus === "tie") {
            playerTurnText.textContent = `Game over!`;
            const resultText = document.createElement("h2");
            resultText.classList.add("result");
            resultText.textContent = `It's a tie!`;
            container.appendChild(resultText);
        }
    }

    function clickHandlerBoard(e) {
        const gameStatus = game.getGameStatus();

        if (gameStatus === "win" || gameStatus === "tie") {
            return;
        }

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    const resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", function() {
        game.resetGame();
        document.querySelectorAll(".result").forEach(el => el.remove());
        updateScreen();
    })

    updateScreen();
}

ScreenController()