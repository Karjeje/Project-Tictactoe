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

    return { value, addMark, getValue };
}