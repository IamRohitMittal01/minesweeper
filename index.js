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

function playMinesweeper(size, numMines) {
  const minefield = generateMinefield(size, numMines);
  const uncoveredGrid = Array.from({ length: size }, () => Array(size).fill('#'));

  function gameLoop() {
    printGrid(uncoveredGrid);
    
    rl.question('Enter row and column (e.g., "1 2"): ', input => {
      const [row, col] = input.split(' ').map(Number);

      if (minefield[row][col] === -1) {
        console.log('Game over! You hit a mine.');
        printGrid(minefield);
        rl.close();
      } else {
        uncoverCell(row, col, uncoveredGrid);
        const isGameWon = uncoveredGrid.flat().every(cell => cell === '#' || cell === '.');

        if (isGameWon) {
          console.log('Congratulations! You won the game!');
          printGrid(minefield);
          rl.close();
        } else {
          gameLoop();
        }
      }
    });
  }

  gameLoop();
}

console.log('Welcome to Minesweeper!');
rl.question('Enter grid size and number of mines (e.g., "5 10"): ', input => {
  const [size, numMines] = input.split(' ').map(Number);
  playMinesweeper(size, numMines);
});
