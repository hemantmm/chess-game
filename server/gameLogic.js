// server/gameLogic.js

const gameState = {
    board: Array(5).fill().map(() => Array(5).fill(null)),
    players: {
        A: { characters: ['A-P1', 'A-P2', 'A-P3', 'A-H1', 'A-H2'], positions: [] },
        B: { characters: ['B-P1', 'B-P2', 'B-P3', 'B-H1', 'B-H2'], positions: [] },
    },
    currentPlayer: 'A',
    moveHistory: [],
};

// Initialize player positions
function initializeGame() {
    gameState.players.A.positions = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    gameState.players.B.positions = [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]];
}

// Validate moves
function isValidMove(character, move, player) {
    const charIndex = gameState.players[player].characters.indexOf(character);
    if (charIndex === -1) return false;

    const [row, col] = gameState.players[player].positions[charIndex];
    switch (move) {
        case 'L': return col > 0 && !isOccupied(row, col - 1);
        case 'R': return col < 4 && !isOccupied(row, col + 1);
        case 'F': return row > 0 && !isOccupied(row - 1, col);
        case 'B': return row < 4 && !isOccupied(row + 1, col);
        case 'FL': return row > 0 && col > 0 && !isOccupied(row - 1, col - 1);
        case 'FR': return row > 0 && col < 4 && !isOccupied(row - 1, col + 1);
        case 'BL': return row < 4 && col > 0 && !isOccupied(row + 1, col - 1);
        case 'BR': return row < 4 && col < 4 && !isOccupied(row + 1, col + 1);
        default: return false;
    }
}

// Check if a position is occupied
function isOccupied(row, col) {
    return gameState.players.A.positions.some(pos => pos[0] === row && pos[1] === col) ||
           gameState.players.B.positions.some(pos => pos[0] === row && pos[1] === col);
}

// Update game state and broadcast to clients
function updateGameState() {
    return JSON.stringify(gameState);
}

module.exports = { gameState, initializeGame, isValidMove, updateGameState };
