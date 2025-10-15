// tic-tac-toe.js

document.addEventListener('DOMContentLoaded', function() {
    // Exercise 1: Layout the board
    const boardSquares = document.querySelectorAll('#board div');
    const statusDiv = document.getElementById('status');
    const newGameBtn = document.querySelector('.btn');
    
    // Initialize game state
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', ''];
    let gameActive = true;
    const initialStatus = statusDiv.textContent;

    // Add square class to all board divs
    boardSquares.forEach(square => {
        square.classList.add('square');
        
        // Exercise 3: Hover effects
        square.addEventListener('mouseover', function() {
            if (gameActive && !square.textContent) {
                this.classList.add('hover');
                // Preview the current player's move
                this.textContent = currentPlayer;
                this.classList.add(currentPlayer);
            }
        });
        
        square.addEventListener('mouseout', function() {
            this.classList.remove('hover');
            // Only remove preview if square isn't permanently marked
            if (!gameBoard[Array.from(boardSquares).indexOf(this)]) {
                this.textContent = '';
                this.classList.remove('X', 'O');
            }
        });
        
        // Exercise 2: Add X or O when clicked
        square.addEventListener('click', function() {
            const index = Array.from(boardSquares).indexOf(this);
            
            // Exercise 6: Disallow cheating - prevent overwriting
            if (gameBoard[index] !== '' || !gameActive) {
                return;
            }
            
            // Make the move
            gameBoard[index] = currentPlayer;
            this.textContent = currentPlayer;
            this.classList.add(currentPlayer);
            this.classList.remove('hover');
            
            // Exercise 4: Check for winner
            checkWinner();
            
            // Switch player if game is still active
            if (gameActive) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                statusDiv.textContent = `Current player: ${currentPlayer}`;
            }
        });
    });
    
    // Exercise 5: New Game button
    newGameBtn.addEventListener('click', resetGame);
    
    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                // We have a winner!
                gameActive = false;
                statusDiv.textContent = `Congratulations! ${gameBoard[a]} is the Winner!`;
                statusDiv.classList.add('you-won');
                return;
            }
        }
        
        // Check for tie
        if (!gameBoard.includes('')) {
            gameActive = false;
            statusDiv.textContent = "Game ended in a tie!";
        }
    }
    
    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        boardSquares.forEach(square => {
            square.textContent = '';
            square.classList.remove('X', 'O', 'hover');
        });
        
        statusDiv.textContent = initialStatus;
        statusDiv.classList.remove('you-won');
    }
});