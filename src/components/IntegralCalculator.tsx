import React, { useState } from 'react';
import * as math from 'mathjs';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import './IntegralCalculator.css';

interface IntegralCalculatorProps {
  addToHistory: (entry: string) => void;
}

const IntegralCalculator: React.FC<IntegralCalculatorProps> = ({ addToHistory }) => {
  const [functionStr, setFunctionStr] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    try {
      // Calculate indefinite integral
      const indefiniteIntegral = nerdamer(`integrate(${functionStr}, x)`);
      const indefiniteResult = indefiniteIntegral.toString();

      if (lowerLimit && upperLimit) {
        // Calculate definite integral
        const a = math.evaluate(lowerLimit);
        const b = math.evaluate(upperLimit);
        const definiteIntegral = nerdamer(`integrate(${functionStr}, x, ${a}, ${b})`);
        const definiteResult = definiteIntegral.evaluate().toString();

        setResult(`Indefinite: ${indefiniteResult} + C\nDefinite [${lowerLimit}, ${upperLimit}]: ${definiteResult}`);
        addToHistory(`∫(${functionStr})dx from ${lowerLimit} to ${upperLimit} = ${definiteResult}`);
      } else {
        setResult(`Indefinite: ${indefiniteResult} + C`);
        addToHistory(`∫(${functionStr})dx = ${indefiniteResult} + C`);
      }
    } catch (error) {
      setResult('Error: Invalid input');
      addToHistory(`Integration error: ${functionStr}`);
    }
  };

  return (
    <div className="integral-calculator">
      <h2>Integral Calculator</h2>
      <input
        type="text"
        value={functionStr}
        onChange={(e) => setFunctionStr(e.target.value)}
        placeholder="Enter function (e.g., x^2)"
      />
      <input
        type="text"
        value={lowerLimit}
        onChange={(e) => setLowerLimit(e.target.value)}
        placeholder="Lower limit (optional)"
      />
      <input
        type="text"
        value={upperLimit}
        onChange={(e) => setUpperLimit(e.target.value)}
        placeholder="Upper limit (optional)"
      />
      <button onClick={handleCalculate}>Calculate</button>
      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default IntegralCalculator;