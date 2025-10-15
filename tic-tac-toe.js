// tic-tac-toe.js
// Implements Exercises 1-6 for INFO2180 Lab 3
// Author: (your name) - drop this file in the same folder as index.html and tic-tac-toe.css

document.addEventListener('DOMContentLoaded', () => {
  // Try to find the board container using a few common possibilities:
  const boardContainer =
    document.getElementById('board') ||
    document.querySelector('.board') ||
    document.querySelector('#gameboard') ||
    document.querySelector('.game-board');

  // Fallback: any 9 divs that look like squares
  let squares = [];
  if (boardContainer) {
    squares = Array.from(boardContainer.querySelectorAll('div'));
  }
  if (squares.length < 9) {
    // try more general selectors (doesn't modify HTML)
    squares = Array.from(document.querySelectorAll('.square, .cell, .tile, #board div')).slice(0, 9);
  }

  // Status div (where messages go)
  const statusDiv = document.getElementById('status') || document.querySelector('.status') || null;
  const originalStatus = statusDiv ? statusDiv.textContent : '';

  // New Game button (try common ids or buttons with text "New Game")
  let newGameBtn =
    document.getElementById('new') ||
    document.getElementById('new-game') ||
    document.querySelector('.new-game') ||
    Array.from(document.querySelectorAll('button')).find(b => /new game/i.test(b.textContent));

  // Game state
  let board = new Array(9).fill(null); // 'X' or 'O' or null
  let currentPlayer = 'X';
  let gameOver = false;
  let moves = 0;

  // Winning combinations (0..8 indexing)
  const wins = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];

  // If we didn't find squares, abort quietly
  if (squares.length < 9) {
    console.warn('tic-tac-toe.js: Could not find 9 board squares on the page. Check selectors.');
    return;
  }

  // Exercise 1: ensure each square has the provided CSS class 'square'
  squares.forEach((sq, idx) => {
    if (!sq.classList.contains('square')) sq.classList.add('square');
    // store index for convenience
    sq.dataset.index = idx;

    // Exercise 3: hover effect (add/remove hover class)
    sq.addEventListener('mouseenter', () => {
      if (!sq.textContent && !gameOver) sq.classList.add('hover');
    });
    sq.addEventListener('mouseleave', () => {
      sq.classList.remove('hover');
    });

    // Exercise 2 & 6: click handler (place X/O; disallow change if already filled)
    sq.addEventListener('click', () => {
      if (gameOver) return; // ignore clicks after game over
      const i = parseInt(sq.dataset.index, 10);
      if (board[i]) return; // disallow cheating: already filled

      // Place current player's mark
      board[i] = currentPlayer;
      sq.textContent = currentPlayer;
      // add class X or O for styling
      sq.classList.add(currentPlayer === 'X' ? 'X' : 'O');
      // remove hover since it's now occupied
      sq.classList.remove('hover');

      moves++;
      // Check for a winner
      const winner = checkWinner();
      if (winner) {
        gameOver = true;
        if (statusDiv) {
          statusDiv.textContent = `Congratulations! ${winner} is the Winner!`;
          statusDiv.classList.add('you-won');
        }
        return;
      }

      // Check for tie
      if (moves === 9) {
        gameOver = true;
        if (statusDiv) {
          statusDiv.textContent = `It's a tie!`;
          statusDiv.classList.remove('you-won');
        }
        return;
      }

      // Switch player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      // Optionally show whose turn it is in status (not required by lab)
      if (statusDiv) {
        statusDiv.textContent = `Turn: ${currentPlayer}`;
        statusDiv.classList.remove('you-won');
      }
    });
  });

  // Helper: check winner and return 'X'/'O' or null
  function checkWinner() {
    for (const combo of wins) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // highlight winning squares (optional, but nice)
        squares[a].classList.add('winner');
        squares[b].classList.add('winner');
        squares[c].classList.add('winner');
        return board[a];
      }
    }
    return null;
  }

  // Exercise 5: reset / new game
  function resetGame() {
    board = new Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    moves = 0;
    squares.forEach(sq => {
      sq.textContent = '';
      // remove styling classes but keep the .square class
      sq.classList.remove('X', 'O', 'hover', 'winner');
    });
    if (statusDiv) {
      statusDiv.textContent = originalStatus || `Turn: ${currentPlayer}`;
      statusDiv.classList.remove('you-won');
    }
  }

  // Wire up new game button (if found)
  if (newGameBtn) {
    newGameBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetGame();
    });
  } else {
    // If no button found, create one at the bottom of the board as a fallback
    const fallbackBtn = document.createElement('button');
    fallbackBtn.textContent = 'New Game';
    fallbackBtn.className = 'new-game';
    fallbackBtn.style.marginTop = '12px';
    // try to append near board or body
    (boardContainer || document.body).appendChild(fallbackBtn);
    fallbackBtn.addEventListener('click', resetGame);
    newGameBtn = fallbackBtn;
  }

  // Initialize status on load
  if (statusDiv) {
    statusDiv.textContent = originalStatus || `Turn: ${currentPlayer}`;
  }
});
