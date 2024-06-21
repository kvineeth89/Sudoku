import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import { generateSudokuWithDifficulty, solveSudoku } from './utils/sudokuUtils';
import './App.css';

function App() {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialGrid, setInitialGrid] = useState(Array(9).fill().map(() => Array(9).fill(false)));
  const [message, setMessage] = useState('');
  const [isCreatingPuzzle, setIsCreatingPuzzle] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [copyMessage, setCopyMessage] = useState('');

  const handleGenerate = () => {
    const solvedGrid = [...grid.map(row => [...row])];
    if (solveSudoku(solvedGrid)) {
      setGrid(solvedGrid);
      setMessage('Sudoku puzzle solved!');
    } else {
      setMessage('Failed to solve the Sudoku puzzle. It might be invalid.');
    }
  };

  const handleRandom = (selectedDifficulty) => {
    const newGrid = generateSudokuWithDifficulty(selectedDifficulty);
    setGrid(newGrid);
    setInitialGrid(newGrid.map(row => row.map(cell => cell !== 0)));
    setMessage(`New random ${selectedDifficulty} Sudoku puzzle generated!`);
    setIsCreatingPuzzle(false);
    setDifficulty(selectedDifficulty);
  };

  const handleSolve = () => {
    const solvedGrid = [...grid.map(row => [...row])];
    if (solveSudoku(solvedGrid)) {
      setMessage('Your solution is correct so far!');
    } else {
      setMessage('Your solution contains errors. Please check and try again.');
    }
  };

  const handleCreatePuzzle = () => {
    setGrid(Array(9).fill().map(() => Array(9).fill(0)));
    setInitialGrid(Array(9).fill().map(() => Array(9).fill(false)));
    setIsCreatingPuzzle(true);
    setMessage('Enter your custom puzzle. Click "Start Solving" when done.');
    setDifficulty('custom');
  };

  const handleStartSolving = () => {
    const solvedGrid = [...grid.map(row => [...row])];
    if (solveSudoku(solvedGrid)) {
      setInitialGrid(grid.map(row => row.map(cell => cell !== 0)));
      setIsCreatingPuzzle(false);
      setMessage('Custom puzzle accepted. Start solving!');
    } else {
      setMessage('Invalid puzzle. Please check and try again.');
    }
  };

  const handleCellChange = (row, col, value) => {
    if (isCreatingPuzzle || !initialGrid[row][col]) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = value;
      setGrid(newGrid);
    }
  };

  const handleCopyGrid = () => {
    const gridString = grid.flat().join('');
    navigator.clipboard.writeText(gridString).then(() => {
      setCopyMessage('Grid copied to clipboard!');
      setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyMessage('Failed to copy grid');
      setTimeout(() => setCopyMessage(''), 3000);
    });
  };

  useEffect(() => {
    handleRandom('medium');
  }, []);

  return (
    <div className="App">
      <h1>Sudoku App</h1>
      <div className="difficulty-label" style={{ backgroundColor: getDifficultyColor(difficulty) }}>
        {isCreatingPuzzle ? 'Custom' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </div>
      <Grid grid={grid} initialGrid={initialGrid} onCellChange={handleCellChange} />
      <div className="controls">
        <button onClick={handleGenerate}>Generate Solution</button>
        <div className="difficulty-buttons">
          <button onClick={() => handleRandom('easy')}>Easy</button>
          <button onClick={() => handleRandom('medium')}>Medium</button>
          <button onClick={() => handleRandom('hard')}>Hard</button>
          <button onClick={() => handleRandom('extreme')}>Extreme</button>
        </div>
        <button onClick={handleSolve}>Check Solution</button>
        {isCreatingPuzzle ? (
          <button onClick={handleStartSolving}>Start Solving</button>
        ) : (
          <button onClick={handleCreatePuzzle}>Create Puzzle</button>
        )}
        <button onClick={handleCopyGrid}>Copy Grid</button>
      </div>
      {message && <p className="message">{message}</p>}
      {copyMessage && <p className="copy-message">{copyMessage}</p>}
    </div>
  );
}

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'easy':
      return '#4CAF50';
    case 'medium':
      return '#FFC107';
    case 'hard':
      return '#FF9800';
    case 'extreme':
      return '#F44336';
    default:
      return '#9C27B0';
  }
}

export default App;