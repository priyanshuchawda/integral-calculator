import React, { useState } from 'react';
import { matrix, inv, det, eigs, multiply } from 'mathjs';
import './LinearAlgebra.css';

interface LinearAlgebraProps {
  theme: 'light' | 'dark';
}

const LinearAlgebra: React.FC<LinearAlgebraProps> = ({ theme }) => {
  const [matrixA, setMatrixA] = useState('[[1, 2], [3, 4]]');
  const [matrixB, setMatrixB] = useState('[[5, 6], [7, 8]]');
  const [result, setResult] = useState('');

  const parseMatrix = (input: string) => {
    try {
      return matrix(JSON.parse(input));
    } catch (error) {
      throw new Error('Invalid matrix format');
    }
  };

  const handleOperation = (operation: string) => {
    try {
      let res;
      const A = parseMatrix(matrixA);
      switch (operation) {
        case 'inverse':
          res = inv(A);
          break;
        case 'determinant':
          res = det(A);
          break;
        case 'eigenvalues':
          res = eigs(A).values;
          break;
        case 'multiply':
          const B = parseMatrix(matrixB);
          res = multiply(A, B);
          break;
        default:
          throw new Error('Invalid operation');
      }
      setResult(JSON.stringify(res));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className={`linear-algebra ${theme}`}>
      <h2>Linear Algebra Toolkit</h2>
      <div className="input-group">
        <label>
          Matrix A:
          <textarea
            value={matrixA}
            onChange={(e) => setMatrixA(e.target.value)}
            placeholder="Enter matrix A (e.g., [[1, 2], [3, 4]])"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Matrix B (for multiplication):
          <textarea
            value={matrixB}
            onChange={(e) => setMatrixB(e.target.value)}
            placeholder="Enter matrix B (e.g., [[5, 6], [7, 8]])"
          />
        </label>
      </div>
      <div className="button-group">
        <button onClick={() => handleOperation('inverse')}>Inverse</button>
        <button onClick={() => handleOperation('determinant')}>Determinant</button>
        <button onClick={() => handleOperation('eigenvalues')}>Eigenvalues</button>
        <button onClick={() => handleOperation('multiply')}>Multiply A*B</button>
      </div>
      <div className="result">
        <h3>Result:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default LinearAlgebra;