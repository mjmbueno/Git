const statusDisplay = document.querySelector('#status');
const previousBtn = document.getElementById('previous');
const nextBtn = document.getElementById('next');

let gameActive= true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let moveIndex = 0;
const gameStatesHistory = [gameState];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for(let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if(a === '' || b === '' || c === '')
            continue;
        if(a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if(roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if(roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if(gameState[clickedCellIndex] !== "" || !gameActive)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    // Save game state
    if (moveIndex < gameStatesHistory.length - 1) {
        gameStatesHistory.splice(moveIndex + 1, gameStatesHistory.length - moveIndex);
    }
    gameState = [...gameState];
    gameStatesHistory.push(gameState);
    moveIndex++;
    previousBtn.disabled = false;
    nextBtn.disabled = true;
}

function handlePreviousClick() {
    if (moveIndex > 0) {
        moveIndex--;
        gameState = gameStatesHistory[moveIndex];
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = currentPlayerTurn();
        renderBoard();
        nextBtn.disabled = false;
        if (moveIndex === 0) {
            previousBtn.disabled = true;
        }
    }
}

function handleNextClick() {
    if (moveIndex < gameStatesHistory.length - 1) {
        moveIndex++;
        gameState = gameStatesHistory[moveIndex];
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = currentPlayerTurn();
        renderBoard();
        previousBtn.disabled = false;
        if (moveIndex === gameStatesHistory.length - 1) {
            nextBtn.disabled = true;
        }
    }
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameStatesHistory.length = 0;
    gameStatesHistory.push(gameState);
    moveIndex = 0;
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    previousBtn.disabled = true;
    nextBtn.disabled = true;
}

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.innerHTML = gameState[index];
    });
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#restart-btn').addEventListener('click', handleRestartGame);
previousBtn.addEventListener('click', handlePreviousClick);
nextBtn.addEventListener('click', handleNextClick);
