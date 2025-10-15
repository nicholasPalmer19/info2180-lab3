/* Nicholas Palmer, 620163716
   tic-tac-toe.js
   Paste this file into the same folder as your index.html and tic-tac-toe.css
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements from your HTML
  const statusDiv = document.getElementById('status');
  const originalStatus = statusDiv ? statusDiv.textContent : '';
  const boardEl = document.getElementById('board');
  const newGameBtn = document.querySelector('.btn');

  if (!boardEl) {
    console.warn('Could not find #board in the page.');
    return;
  }

  // Grab the first 9 divs inside #board and treat them as squares
  let squares = Array.from(boardEl.querySelectorAll('div')).slice(0, 9);
  if (squares.length < 9) {
    console.warn('Board does not contain 9 squares. Found:', squares.length);
  }

  // Game state
  let boardState = new Array(9).fill(null); // null / 'X' / 'O'
  let currentPlayer = 'X';
  let gameOver = false;
  let moves = 0;

  // Winning combos
  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];

  // Initialize squares: add classes, dataset index, and event listeners
  squares.forEach((sq, idx) => {
    // Ensure visual class exists for CSS targeting
    if (!sq.classList.contains('square')) sq.classList.add('square');
    sq.dataset.index = idx;

    // Hover: only show on empty squares and while game is not over
    sq.addEventListener('mouseenter', () => {
      if (!gameOver && !sq.textContent) sq.classList.add('hover');
    });
    sq.addEventListener('mouseleave', () => {
      sq.classList.remove('hover');
    });

    // Click: place mark if empty and game not over
    sq.addEventListener('click', () => {
      if (gameOver) return;
      const i = Number(sq.dataset.index);
      if (boardState[i]) return; // prevent overwriting (no cheating)

      // Place mark
      boardState[i] = currentPlayer;
      sq.textContent = currentPlayer;
      sq.classList.add(currentPlayer); // for styling (e.g., .X or .O)
      sq.classList.remove('hover');
      moves++;

      // Check for winner
      const winner = checkWinner();
      if (winner) {
        gameOver = true;
        // EXACT required message:
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

      // Switch player (but keep original status text as your HTML had)
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      // (Optional) If you want the status to show the turn, uncomment:
      // if (statusDiv) statusDiv.textContent = `Turn: ${currentPlayer}`;
    });
  });

  // Check winner and highlight the winning squares; returns 'X'/'O' or null
  function checkWinner() {
    for (const combo of wins) {
      const [a,b,c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        // highlight winning squares
        [a,b,c].forEach(i => {
          if (squares[i]) squares[i].classList.add('winner');
        });
        return boardState[a];
      }
    }
    return null;
  }

  // Reset game to initial state
  function resetGame() {
    boardState = new Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    moves = 0;
    squares.forEach(sq => {
      sq.textContent = '';
      sq.classList.remove('X','O','hover','winner');
    });
    if (statusDiv) {
      statusDiv.textContent = originalStatus;
      statusDiv.classList.remove('you-won');
    }
  }

  // Wire New Game button
  if (newGameBtn) {
    newGameBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetGame();
    });
  } else {
    console.warn('New Game button (.btn) not found.');
  }

  // Expose reset on window for quick debugging (optional)
  window.resetTicTacToe = resetGame;
});
