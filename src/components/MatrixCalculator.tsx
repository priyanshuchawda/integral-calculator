import React, { useState } from 'react';
import * as math from 'mathjs';

interface MatrixCalculatorProps {
  addToHistory: (entry: string) => void;
}

const MatrixCalculator: React.FC<MatrixCalculatorProps> = ({ addToHistory }) => {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState<number[][]>(Array(size).fill(0).map(() => Array(size).fill(0)));
  const [result, setResult] = useState<string>('');

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setMatrix(Array(newSize).fill(0).map(() => Array(newSize).fill(0)));
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = Number(value);
    setMatrix(newMatrix);
  };

  const calculateDeterminant = () => {
    try {
      const det = math.det(matrix);
      setResult(`Determinant: ${det}`);
      addToHistory(`Matrix Determinant (${size}x${size}): ${det}`);
    } catch (error) {
      setResult('Error: Invalid matrix');
      addToHistory('Matrix Determinant: Error - Invalid matrix');
    }
  };

  return (
    <div className="matrix-calculator">
      <h2>Matrix Calculator</h2>
      <div>
        <label>Matrix Size: </label>
        <select value={size} onChange={(e) => handleSizeChange(Number(e.target.value))}>
          {[2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}x{n}</option>
          ))}
        </select>
      </div>
      <div className="matrix-input">
        {matrix.map((row, i) => (
          <div key={i} className="matrix-row">
            {row.map((cell, j) => (
              <input
                key={j}
                type="number"
                value={cell}
                onChange={(e) => handleInputChange(i, j, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={calculateDeterminant}>Calculate Determinant</button>
      <div className="result">{result}</div>
    </div>
  );
};

export default MatrixCalculator;