import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import Plot from 'react-plotly.js';
import './NumericalMethods.css';

interface NumericalMethodsProps {
  theme: 'light' | 'dark';
}

const NumericalMethods: React.FC<NumericalMethodsProps> = ({ theme }) => {
  const [method, setMethod] = useState('bisection');
  const [function1, setFunction1] = useState('x^2 - 4');
  const [function2, setFunction2] = useState('');
  const [a, setA] = useState('0');
  const [b, setB] = useState('3');
  const [tolerance, setTolerance] = useState('0.0001');
  const [maxIterations, setMaxIterations] = useState('100');
  const [result, setResult] = useState('');
  const [plotData, setPlotData] = useState<any[]>([]);

  const bisectionMethod = (f: (x: number) => number, a: number, b: number, tol: number, maxIter: number) => {
    let fa = f(a);
    let fb = f(b);
    if (fa * fb >= 0) {
      throw new Error('Function must have opposite signs at a and b');
    }
    let c: number;
    for (let i = 0; i < maxIter; i++) {
      c = (a + b) / 2;
      let fc = f(c);
      if (Math.abs(fc) < tol) {
        return c;
      }
      if (fa * fc < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }
    }
    throw new Error('Method failed to converge');
  };

  const newtonRaphsonMethod = (f: (x: number) => number, df: (x: number) => number, x0: number, tol: number, maxIter: number) => {
    let x = x0;
    for (let i = 0; i < maxIter; i++) {
      let fx = f(x);
      if (Math.abs(fx) < tol) {
        return x;
      }
      let dfx = df(x);
      if (dfx === 0) {
        throw new Error('Derivative is zero');
      }
      x = x - fx / dfx;
    }
    throw new Error('Method failed to converge');
  };

  const trapezoidalRule = (f: (x: number) => number, a: number, b: number, n: number) => {
    const h = (b - a) / n;
    let sum = 0.5 * (f(a) + f(b));
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += f(x);
    }
    return h * sum;
  };

  const handleCalculate = () => {
    try {
      const f = (x: number) => evaluate(function1, { x });
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const tolNum = parseFloat(tolerance);
      const maxIterNum = parseInt(maxIterations);

      let res: number;
      switch (method) {
        case 'bisection':
          res = bisectionMethod(f, aNum, bNum, tolNum, maxIterNum);
          break;
        case 'newtonRaphson':
          const df = (x: number) => evaluate(`derivative(${function1}, 'x')`, { x });
          res = newtonRaphsonMethod(f, df, aNum, tolNum, maxIterNum);
          break;
        case 'integration':
          res = trapezoidalRule(f, aNum, bNum, maxIterNum);
          break;
        default:
          throw new Error('Invalid method');
      }

      setResult(`Result: ${res}`);

      // Generate plot data
      const xValues = [];
      const yValues = [];
      const step = (bNum - aNum) / 100;
      for (let x = aNum; x <= bNum; x += step) {
        xValues.push(x);
        yValues.push(f(x));
      }
      setPlotData([
        { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'Function' },
        { x: [res], y: [f(res)], type: 'scatter', mode: 'markers', name: 'Root', marker: { size: 10, color: 'red' } },
      ]);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setPlotData([]);
    }
  };

  return (
    <div className={`numerical-methods ${theme}`}>
      <h2>Numerical Methods Toolkit</h2>
      <div className="input-group">
        <label>
          Method:
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="bisection">Bisection</option>
            <option value="newtonRaphson">Newton-Raphson</option>
            <option value="integration">Numerical Integration</option>
          </select>
        </label>
      </div>
      {/* Rest of the component */}
    </div>
  );
};

export default NumericalMethods;