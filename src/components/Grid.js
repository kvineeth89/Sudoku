// components/Grid.js
import React from 'react';
import Cell from './Cell';

function Grid({ grid, initialGrid, onCellChange }) {
  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              onChange={(newValue) => onCellChange(rowIndex, colIndex, newValue)}
              isInitial={initialGrid[rowIndex][colIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;