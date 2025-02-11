const CROSS = "X";
const ZERO = "O";
const EMPTY = " ";
let field;
let turn = 1;
let end = false;
let botTurn = false;
const container = document.getElementById("fieldWrapper");

startGame();
addResetListener();

function startGame() {
    field = [[EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY], [EMPTY, EMPTY, EMPTY]];
    renderGrid(3);
    end = false;
    turn = 1;
}

function renderGrid(dimension) {
    container.innerHTML = "";

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement("td");
            cell.textContent = EMPTY;
            cell.addEventListener("click", () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    //c ИИ, без ИИ см ниже
    if (botTurn) {
        return;
    }
    if (end) {
        return;
    }
    const t = CROSS;
    if (field[row][col] === EMPTY) {
        field[row][col] = t;
        renderSymbolInCell(t, row, col);
        turn++;
    } else {
        return;
    }
    const winner = checkWinner();
    if (winner[0]) {
        end = true;
        for (let i = 1; i < 4; i++) {
            renderSymbolInCell(t, winner[i][0], winner[i][1], "red");
        }
        setTimeout(() => alert(`Win ${t}`));
        return;
    } else if (turn === 10) {
        setTimeout(() => alert("Ничья! :D"));
        end = true;
        return;
    }
    botTurn = true;
    setTimeout(() => {

        while (true) {
            let row1 = getRandomInt(3);
            let col1 = getRandomInt(3);
            if (field[row1][col1] === EMPTY) {
                field[row1][col1] = ZERO;
                renderSymbolInCell(ZERO, row1, col1);
                turn++;
                break;
            }
        }
        const winner1 = checkWinner();
        if (winner1[0]) {
            end = true;
            renderSymbolInCell(ZERO, winner1[1][0], winner1[1][1], "red");
            renderSymbolInCell(ZERO, winner1[2][0], winner1[2][1], "red");
            renderSymbolInCell(ZERO, winner1[3][0], winner1[3][1], "red");
            setTimeout(() => alert(`Win ${ZERO}`), 50);
        } else if (turn === 10) {
            setTimeout(() => alert("Ничья! :D"), 50);
        }
        botTurn = false;
    }, 500);
}


// function cellClickHandler(row, col) {
//     // Пиши код тут без ИИ
//     if (end) {
//         return;
//     }
//     const t = turn % 2 === 0 ? ZERO : CROSS;
//     if (field[row][col] === EMPTY) {
//         field[row][col] = t;
//         renderSymbolInCell(t, row, col);
//         turn++;
//     }
//     else{
//         return;
//     }
//     const winner = checkWinner();
//     if (winner[0]) {
//         end = true;
//         renderSymbolInCell(t, winner[1][0], winner[1][1], "red");
//         renderSymbolInCell(t, winner[2][0], winner[2][1], "red");
//         renderSymbolInCell(t, winner[3][0], winner[3][1], "red");
//         setTimeout(() => alert(`Win ${t}`));
//     }
//     else if (turn === 10) {
//         setTimeout(() => alert("Ничья! :D"));
//     }
//     /* Пользоваться методом для размещения символа в клетке так:
//         renderSymbolInCell(ZERO, row, col);
//      */
// }

function checkWinner() {
    for (let i = 0; i < 3; i++) {
        if ([field[i][0], field[i][1], field[i][2]].every(v => v !== EMPTY && v === field[i][2])) {
            return [true, [i, 0], [i, 1], [i, 2]];
        }
        if ([field[0][i], field[1][i], field[2][i]].every(v => v !== EMPTY && v === field[0][i])) {
            return [true, [0, i], [1, i], [2, i]];
        }
    }
    if ([field[0][0], field[1][1], field[2][2]].every(v => v !== EMPTY && v === field[0][0])) {
        return [true, [0, 0], [1, 1], [2, 2]];
    }
    if ([field[0][2], field[1][1], field[2][0]].every(v => v !== EMPTY && v === field[0][2])) {
        return [true, [0, 2], [1, 1], [2, 0]];
    }
    return [false, 0, 0, 0];
}

function renderSymbolInCell(symbol, row, col, color = "#333") {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll("tr")[row];
    return targetRow.querySelectorAll("td")[col];
}

function addResetListener() {
    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", resetClickHandler);
}

function resetClickHandler() {
    startGame();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
