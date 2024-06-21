// components/Cell.js
import React from 'react';

function Cell({ value, onChange, isInitial }) {
  const handleChange = (e) => {
    const newValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return;
    onChange(newValue);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value === 0 ? '' : value}
      onChange={handleChange}
      className={`cell ${isInitial ? 'initial' : ''}`}
      readOnly={isInitial}
    />
  );
}

export default Cell;