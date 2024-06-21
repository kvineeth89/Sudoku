// sudokuUtils.js

function generateSudokuWithDifficulty(difficulty) {
    const grid = Array(9).fill().map(() => Array(9).fill(0));
    fillGrid(grid);
    
    const difficultyLevels = {
      easy: { min: 36, max: 41, maxScore: 3 },
      medium: { min: 32, max: 35, maxScore: 5 },
      hard: { min: 28, max: 31, maxScore: 7 },
      extreme: { min: 10, max: 16, maxScore: 15 }
    };
    
    const { min, max, maxScore } = difficultyLevels[difficulty];
    let puzzle, score;
    let attempts = 0;
    const maxAttempts = 20;
  
    do {
      const cellsToKeep = Math.floor(Math.random() * (max - min + 1)) + min;
      puzzle = generateUniqueSolution(grid, cellsToKeep);
      score = estimateDifficulty(puzzle);
      attempts++;
    } while (score > maxScore && attempts < maxAttempts);
  
    return puzzle;
  }
  
  function generateUniqueSolution(grid, cellsToKeep) {
    const puzzle = [...grid.map(row => [...row])];
    const positions = [];
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    
    shuffleArray(positions);
    
    for (let i = 0; i < 81 - cellsToKeep; i++) {
      const [row, col] = positions[i];
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;
      
      if (!hasUniqueSolution(puzzle)) {
        puzzle[row][col] = backup;
      }
    }
    
    return puzzle;
  }
  
  function hasUniqueSolution(puzzle) {
    const grid = [...puzzle.map(row => [...row])];
    return countSolutions(grid) === 1;
  }
  
  function countSolutions(grid, limit = 2) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return 1;
    
    const [row, col] = emptyCell;
    let count = 0;
    
    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        count += countSolutions(grid, limit - count);
        grid[row][col] = 0;
        if (count >= limit) return count;
      }
    }
    
    return count;
  }
  
  function estimateDifficulty(puzzle) {
    let score = 0;
    const grid = [...puzzle.map(row => [...row])];
    
    if (hasNakedSingles(grid)) score += 1;
    if (hasHiddenSingles(grid)) score += 2;
    if (hasNakedPairs(grid)) score += 2;
    if (hasHiddenPairs(grid)) score += 2;
    
    return score;
  }
  
  function hasNakedSingles(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const possibilities = getPossibilities(grid, row, col);
          if (possibilities.length === 1) return true;
        }
      }
    }
    return false;
  }
  
  function hasHiddenSingles(grid) {
    for (let num = 1; num <= 9; num++) {
      for (let row = 0; row < 9; row++) {
        let count = 0;
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0 && isValid(grid, row, col, num)) count++;
        }
        if (count === 1) return true;
      }
      for (let col = 0; col < 9; col++) {
        let count = 0;
        for (let row = 0; row < 9; row++) {
          if (grid[row][col] === 0 && isValid(grid, row, col, num)) count++;
        }
        if (count === 1) return true;
      }
    }
    return false;
  }
  
  function hasNakedPairs(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const poss1 = getPossibilities(grid, row, col);
          if (poss1.length === 2) {
            for (let col2 = col + 1; col2 < 9; col2++) {
              if (grid[row][col2] === 0) {
                const poss2 = getPossibilities(grid, row, col2);
                if (poss2.length === 2 && poss1.every(num => poss2.includes(num))) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }
  
  function hasHiddenPairs(grid) {
    for (let row = 0; row < 9; row++) {
      const emptyCells = [];
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) emptyCells.push(col);
      }
      if (emptyCells.length >= 2) {
        const possibilities = emptyCells.map(col => getPossibilities(grid, row, col));
        for (let i = 0; i < possibilities.length - 1; i++) {
          for (let j = i + 1; j < possibilities.length; j++) {
            const commonPoss = possibilities[i].filter(num => possibilities[j].includes(num));
            if (commonPoss.length === 2) {
              const otherPoss = possibilities.filter((_, index) => index !== i && index !== j)
                .flat();
              if (commonPoss.every(num => !otherPoss.includes(num))) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
  
  function getPossibilities(grid, row, col) {
    const possibilities = [];
    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        possibilities.push(num);
      }
    }
    return possibilities;
  }
  
  function fillGrid(grid) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          shuffleArray(numbers);
          for (let num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function solveSudoku(grid) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true;
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (solveSudoku(grid)) {
          return true;
        }
        
        grid[row][col] = 0;
      }
    }
    
    return false;
  }
  
  function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }
  
  function isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false;
      }
    }
    
    return true;
  }
  
  function isValidSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0) {
          const temp = grid[row][col];
          grid[row][col] = 0;
          if (!isValid(grid, row, col, temp)) {
            grid[row][col] = temp;
            return false;
          }
          grid[row][col] = temp;
        }
      }
    }
    return true;
  }
  
  export { generateSudokuWithDifficulty, solveSudoku, isValidSudoku };