import React, { useState } from 'react';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';
import * as math from 'mathjs';

interface PolynomialSolverProps {
  addToHistory: (entry: string) => void;
}

const PolynomialSolver: React.FC<PolynomialSolverProps> = ({ addToHistory }) => {
  const [input, setInput] = useState('');
  const [roots, setRoots] = useState<string[]>([]);
  const [error, setError] = useState('');

  const solvePolynomial = () => {
    try {
      // Solve the polynomial
      const solutions = nerdamer(`solve(${input}, x)`);

      // Convert solutions to strings
      const rootStrings = solutions.toString().slice(1, -1).split(',');

      setRoots(rootStrings);
      setError('');
      addToHistory(`Solved polynomial: ${input}`);
    } catch (err) {
      setError('Invalid input. Please enter a valid polynomial.');
      setRoots([]);
    }
  };

  const formatRoot = (root: string) => {
    try {
      const parsed = math.parse(root);
      return math.format(parsed, { precision: 4 });
    } catch {
      return root;
    }
  };

  return (
    <div className="polynomial-solver">
      <h2>Polynomial Solver</h2>
      <p>Enter a polynomial in the form: x^3 + 2*x^2 - 5*x + 3 = 0</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter polynomial equation"
      />
      <button onClick={solvePolynomial}>Solve</button>
      {error && <p className="error">{error}</p>}
      {roots.length > 0 && (
        <div className="results">
          <h3>Roots:</h3>
          <ul>
            {roots.map((root, index) => (
              <li key={index}>{formatRoot(root)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PolynomialSolver;