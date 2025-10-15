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

        const getAvailableCells = (gameboard) => {

            const availableCells = [];

            for (let row = 0; row < gameboard.length; row++) {
                for (let col = 0; col < gameboard[row].length; col++) {
                    if (gameboard[row][col] === 0) {
                        availableCells.push({ row, col });
                    }
                }
            }

            return availableCells;
        }
    }

    return { getGameboard };
}

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addMark, getValue };
}