import React, { useState } from 'react';
import * as math from 'mathjs';

const DeterminantCalculator: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState<number[][]>(Array(3).fill(Array(3).fill(0)));
  const [determinant, setDeterminant] = useState<number | null>(null);

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map((r, i) =>
      i === row ? r.map((c, j) => j === col ? Number(value) || 0 : c) : r
    );
    setMatrix(newMatrix);
  };

  const calculateDeterminant = () => {
    try {
      const det = math.det(matrix);
      setDeterminant(det);
    } catch (error) {
      console.error('Error calculating determinant:', error);
      setDeterminant(null);
    }
  };

  return (
    <div className="determinant-calculator">
      <h2>Determinant Calculator</h2>
      <div>
        <label htmlFor="matrix-size">Matrix Size:</label>
        <input
          id="matrix-size"
          type="number"
          min="1"
          max="10"
          value={matrixSize}
          onChange={(e) => {
            const size = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
            setMatrixSize(size);
            setMatrix(Array(size).fill(Array(size).fill(0)));
          }}
        />
      </div>
      <div className="matrix-input">
        {matrix.map((row, i) => (
          <div key={i} className="matrix-row">
            {row.map((_, j) => (
              <input
                key={j}
                type="number"
                value={matrix[i][j]}
                onChange={(e) => handleMatrixChange(i, j, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={calculateDeterminant}>Calculate Determinant</button>
      {determinant !== null && (
        <div className="determinant-result">
          <h3>Determinant:</h3>
          <p>{determinant}</p>
        </div>
      )}
    </div>
  );
};

export default DeterminantCalculator;