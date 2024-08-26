// server/server.js

const express = require('express');
const WebSocket = require('ws');
const path = require('path'); // Import path module
const { gameState, initializeGame, isValidMove, updateGameState } = require('./gameLogic');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

initializeGame(); // Initialize game state

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

wss.on('connection', (ws) => {
    ws.send(updateGameState()); // Send initial game state

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            const { character, move } = data;
            const player = gameState.currentPlayer;

            if (isValidMove(character, move, player)) {
                const charIndex = gameState.players[player].characters.indexOf(character);
                const [row, col] = gameState.players[player].positions[charIndex];

                // Update position
                switch (move) {
                    case 'L': gameState.players[player].positions[charIndex][1]--; break;
                    case 'R': gameState.players[player].positions[charIndex][1]++; break;
                    case 'F': gameState.players[player].positions[charIndex][0]--; break;
                    case 'B': gameState.players[player].positions[charIndex][0]++; break;
                    case 'FL': gameState.players[player].positions[charIndex][0]--; gameState.players[player].positions[charIndex][1]--; break;
                    case 'FR': gameState.players[player].positions[charIndex][0]--; gameState.players[player].positions[charIndex][1]++; break;
                    case 'BL': gameState.players[player].positions[charIndex][0]++; gameState.players[player].positions[charIndex][1]--; break;
                    case 'BR': gameState.players[player].positions[charIndex][0]++; gameState.players[player].positions[charIndex][1]++; break;
                }

                gameState.moveHistory.push(`${player} moved ${character} ${move}`);
                gameState.currentPlayer = player === 'A' ? 'B' : 'A'; // Switch turns
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(updateGameState());
                    }
                });
            } else {
                ws.send(JSON.stringify({ type: 'invalidMove' }));
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});




