import React, { useState } from 'react';
import './CalculatorTab.css';

interface CalculatorTabProps {
  theme: 'light' | 'dark';
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({ theme }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      const calculatedResult = eval(input);
      setResult(calculatedResult.toString());
    } catch (error) {
      setResult('Error');
    }
  };

  const handleFactorial = () => {
    const n = parseInt(input);
    if (isNaN(n) || n < 0) {
      setResult('Error: Invalid input for factorial');
    } else {
      let factorial = 1;
      for (let i = 2; i <= n; i++) {
        factorial *= i;
      }
      setResult(factorial.toString());
    }
  };

  const handleNPR = () => {
    const [n, r] = input.split(',').map(Number);
    if (isNaN(n) || isNaN(r) || n < r || n < 0 || r < 0) {
      setResult('Error: Invalid input for nPr');
    } else {
      const result = factorial(n) / factorial(n - r);
      setResult(result.toString());
    }
  };

  const handleNCR = () => {
    const [n, r] = input.split(',').map(Number);
    if (isNaN(n) || isNaN(r) || n < r || n < 0 || r < 0) {
      setResult('Error: Invalid input for nCr');
    } else {
      const result = factorial(n) / (factorial(r) * factorial(n - r));
      setResult(result.toString());
    }
  };

  const factorial = (num: number): number => {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
  };

  return (
    <div className={`calculator-tab ${theme}`}>
      <input type="text" value={input} readOnly className="input-field" />
      <div className="result">{result}</div>
      <div className="buttons">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <button key={btn} onClick={() => handleButtonClick(btn)} className="btn btn-secondary">
            {btn}
          </button>
        ))}
        <button onClick={handleClear} className="btn btn-primary">
          C
        </button>
        <button onClick={handleFactorial} className="btn btn-primary">
          n!
        </button>
        <button onClick={handleNPR} className="btn btn-primary">
          nPr
        </button>
        <button onClick={handleNCR} className="btn btn-primary">
          nCr
        </button>
      </div>
    </div>
  );
};

export default CalculatorTab;
