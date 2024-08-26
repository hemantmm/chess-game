const ws = new WebSocket('ws://localhost:3000');
const boardElement = document.getElementById('board');
const currentPlayerElement = document.getElementById('currentPlayer');
const moveHistoryElement = document.getElementById('moveHistory');

ws.onmessage = (event) => {
    const gameState = JSON.parse(event.data);
    renderBoard(gameState.board);
    currentPlayerElement.textContent = `Current Player: ${gameState.currentPlayer}`;
    renderMoveHistory(gameState.moveHistory);
};

function renderBoard(board) {
    boardElement.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.textContent = cell ? cell : '';
            cellElement.onclick = () => handleCellClick(rowIndex, colIndex);
            boardElement.appendChild(cellElement);
        });
    });
}

function handleCellClick(row, col) {
    const character = prompt('Enter character name and move (e.g., A-P1:L)');
    if (character) {
        const [name, move] = character.split(':');
        sendMove(name, move);
    }
}

function sendMove(character, move) {
    ws.send(JSON.stringify({ type: 'move', character, move }));
}

function renderMoveHistory(moveHistory) {
    moveHistoryElement.innerHTML = moveHistory.map(move => `<div>${move}</div>`).join('');
}


