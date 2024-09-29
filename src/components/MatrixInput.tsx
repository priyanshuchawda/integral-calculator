import React from 'react';

interface MatrixInputProps {
  matrix: number[][];
  onChange: (i: number, j: number, value: string) => void;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ matrix, onChange }) => {
  return (
    <div className="matrix-input">
      {matrix.map((row, i) => (
        <div key={i} className="matrix-row">
          {row.map((val, j) => (
            <input
              key={j}
              type="number"
              value={val}
              onChange={(e) => onChange(i, j, e.target.value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MatrixInput;