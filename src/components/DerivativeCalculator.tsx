import React, { useState } from 'react';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';
import './DerivativeCalculator.css';

interface DerivativeCalculatorProps {
  addToHistory: (entry: string) => void;
}

const DerivativeCalculator: React.FC<DerivativeCalculatorProps> = ({ addToHistory }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const calculateDerivative = () => {
    try {
      const derivative = nerdamer.diff(input, 'x');
      const derivativeResult = derivative.toString();
      setResult(derivativeResult);
      addToHistory(`Derivative: ${input} → ${derivativeResult}`);
    } catch (error) {
      setResult('Error: Invalid input');
      addToHistory(`Derivative error: ${input} → Invalid input`);
    }
  };

  return (
    <div className="derivative-calculator">
      <h2>Derivative Calculator</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a function (e.g., x^2 + 2x + 1)"
      />
      <button onClick={calculateDerivative}>Calculate Derivative</button>
      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default DerivativeCalculator;