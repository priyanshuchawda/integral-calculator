import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';
import './AdvancedCalculator.css';

interface AdvancedCalculatorProps {
  addToHistory: (entry: string) => void;
}

const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({ addToHistory }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        calculateResult();
      } else if (event.key === 'Backspace') {
        backspace();
      } else if (/^[0-9+\-*/()^.%]$/.test(event.key)) {
        handleButtonClick(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  const handleButtonClick = (value: string) => {
    setInput(prev => prev + value);
  };

  const calculateResult = () => {
    try {
      // Replace π with pi before evaluation
      const preparedInput = input.replace(/π/g, 'pi');
      const calculatedResult = math.evaluate(preparedInput);
      setResult(calculatedResult.toString());
      addToHistory(`${input} = ${calculatedResult}`);
    } catch (error) {
      console.error('Error calculating result:', error);
      setResult('Error: Invalid input');
      addToHistory(`Error: ${input}`);
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  const backspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const buttons = [
    '7', '8', '9', '/', '√',
    '4', '5', '6', '*', 'π',
    '1', '2', '3', '-', 'sin(',
    '0', '.', '=', '+', 'cos(',
    'C', '(', ')', '^', 'tan(',
    'asin(', 'acos(', 'atan(', 'log(', 'ln(',
    'nCr(', 'nPr(', 'e', '!', '←'
  ];

  return (
    <div className="advanced-calculator">
      <input type="text" value={input} readOnly />
      <div className="result">{result}</div>
      <div className="button-grid">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => {
              if (btn === '=') calculateResult();
              else if (btn === 'C') clearInput();
              else if (btn === '←') backspace();
              else handleButtonClick(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdvancedCalculator;
