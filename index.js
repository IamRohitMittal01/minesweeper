const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateMinefield(size, numMines) {
  const minefield = Array.from({ length: size }, () => Array(size).fill(0));
  const positions = new Set();

  while (positions.size < numMines) {
    const position = Math.floor(Math.random() * (size * size));
    positions.add(position);
  }

  for (const position of positions) {
    const row = Math.floor(position / size);
    const col = position % size;
    minefield[row][col] = -1;

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < size && j >= 0 && j < size && minefield[i][j] !== -1) {
          minefield[i][j]++;
        }
      }
    }
  }

  return minefield;
}

function printGrid(grid) {
  for (const row of grid) {
    console.log(row.map(cell => (cell === -1 ? '*' : cell)).join(' '));
  }
}

function uncoverCell(row, col, grid) {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return;
  }

  if (grid[row][col] === 0) {
    grid[row][col] = '.';
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        uncoverCell(i, j, grid);
      }
    }
  }
}

function convertPositionToIndices(position) {
  const column = position.charCodeAt(0) - 'A'.charCodeAt(0);
  const row = parseInt(position.substring(1)) - 1;
  return { row, column };
}

function playMinesweeper() {
  rl.question('Enter grid size: ', sizeInput => {
    const size = parseInt(sizeInput, 10);

    rl.question('Enter number of mines: ', numMinesInput => {
      const numMines = parseInt(numMinesInput, 10);

      const minefield = generateMinefield(size, numMines);
      const uncoveredGrid = Array.from({ length: size }, () => Array(size).fill('#'));

      function gameLoop() {
        printGrid(uncoveredGrid);

        rl.question('Enter position (e.g., "A1", "B2"): ', input => {
          const { row, column } = convertPositionToIndices(input.toUpperCase());

          if (row >= 0 && row < size && column >= 0 && column < size) {
            if (minefield[row][column] === -1) {
              console.log('Game over! You hit a mine.');
              printGrid(minefield);
              rl.close();
            } else {
              uncoverCell(row, column, uncoveredGrid);
              const isGameWon = uncoveredGrid.flat().every(cell => cell === '#' || cell === '.');

              if (isGameWon) {
                console.log('Congratulations! You won the game!');
                printGrid(minefield);
                rl.close();
              } else {
                console.log('Press any key to continue...');
                rl.input.emit('keypress', null, { name: 'anyKey' }); // Simulate keypress event
                rl.once('anyKey', () => {
                  gameLoop();
                });
              }
            }
          } else {
            console.log('Invalid position. Please enter a valid position.');
            gameLoop();
          }
        });
      }

      gameLoop();
    });
  });
}

console.log('Welcome to Minesweeper!');
playMinesweeper();
