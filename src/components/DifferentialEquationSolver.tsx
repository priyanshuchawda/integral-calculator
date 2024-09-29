import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import Plot from 'react-plotly.js';
import './DifferentialEquationSolver.css';

interface DifferentialEquationSolverProps {
  theme: 'light' | 'dark';
}

const DifferentialEquationSolver: React.FC<DifferentialEquationSolverProps> = ({ theme }) => {
  const [equation, setEquation] = useState('');
  const [initialCondition, setInitialCondition] = useState('');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');

  const solveEquation = () => {
    try {
      const nerdamer = require('nerdamer/all.min');
      const solvedEquation = nerdamer.solveDE(equation, 'y', 'x');
      setSolution(solvedEquation.toString());
      setError('');
    } catch (err) {
      setError('Failed to solve the differential equation');
      setSolution('');
    }
  };

  const plotSolution = () => {
    if (!solution) return null;

    const x = [];
    const y = [];
    for (let i = -10; i <= 10; i += 0.1) {
      x.push(i);
      try {
        const yValue = evaluate(solution.replace(/C_1/g, initialCondition), { x: i });
        y.push(yValue);
      } catch (err) {
        y.push(null);
      }
    }

    return (
      <Plot
        data={[
          {
            x,
            y,
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'blue' },
          },
        ]}
        layout={{ title: 'Solution Plot', xaxis: { title: 'x' }, yaxis: { title: 'y' } }}
      />
    );
  };

  return (
    <div className={`differential-equation-solver ${theme}`}>
      <h2>Differential Equation Solver</h2>
      <input
        type="text"
        value={equation}
        onChange={(e) => setEquation(e.target.value)}
        placeholder="Enter differential equation (e.g., diff(y,x) + y = 0)"
      />
      <input
        type="text"
        value={initialCondition}
        onChange={(e) => setInitialCondition(e.target.value)}
        placeholder="Enter initial condition (e.g., 1)"
      />
      <button onClick={solveEquation}>Solve</button>
      {error && <p className="error">{error}</p>}
      {solution && (
        <div>
          <h3>Solution:</h3>
          <p>{solution}</p>
          {plotSolution()}
        </div>
      )}
    </div>
  );
};

export default DifferentialEquationSolver;