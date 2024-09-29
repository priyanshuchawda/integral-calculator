import React, { useState } from 'react';
import { evaluate, complex, add, multiply, Complex } from 'mathjs';
import Plot from 'react-plotly.js';
import './FourierTransform.css';

interface FourierTransformProps {
  theme: 'light' | 'dark';
}

const FourierTransform: React.FC<FourierTransformProps> = ({ theme }) => {
  const [inputFunction, setInputFunction] = useState('sin(2*pi*x)');
  const [startFreq, setStartFreq] = useState('-10');
  const [endFreq, setEndFreq] = useState('10');
  const [numPoints, setNumPoints] = useState('1000');
  const [transform, setTransform] = useState<{ freq: number[]; magnitude: number[] }>({ freq: [], magnitude: [] });

  const calculateFourierTransform = () => {
    const start = parseFloat(startFreq);
    const end = parseFloat(endFreq);
    const points = parseInt(numPoints);

    const freq: number[] = [];
    const magnitude: number[] = [];

    for (let i = 0; i < points; i++) {
      const f = start + (i / (points - 1)) * (end - start);
      freq.push(f);

      let integral: Complex = complex(0, 0);
      const dx = 0.01;
      for (let x = -100; x <= 100; x += dx) {
        const funcValue = evaluate(inputFunction, { x });
        const exponential = complex(Math.cos(-2 * Math.PI * f * x), Math.sin(-2 * Math.PI * f * x));
        integral = add(integral, multiply(multiply(complex(funcValue), exponential), dx)) as Complex;
      }

      magnitude.push(Math.sqrt(integral.re * integral.re + integral.im * integral.im));
    }

    setTransform({ freq, magnitude });
  };

  return (
    <div className={`fourier-transform ${theme}`}>
      <h2>Fourier Transform Calculator</h2>
      <div className="input-group">
        <label>
          Input Function f(x):
          <input
            type="text"
            value={inputFunction}
            onChange={(e) => setInputFunction(e.target.value)}
            placeholder="e.g., sin(2*pi*x)"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Start Frequency:
          <input
            type="number"
            value={startFreq}
            onChange={(e) => setStartFreq(e.target.value)}
          />
        </label>
        <label>
          End Frequency:
          <input
            type="number"
            value={endFreq}
            onChange={(e) => setEndFreq(e.target.value)}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Number of Points:
          <input
            type="number"
            value={numPoints}
            onChange={(e) => setNumPoints(e.target.value)}
          />
        </label>
      </div>
      <button onClick={calculateFourierTransform}>Calculate Fourier Transform</button>
      {transform.freq.length > 0 && (
        <Plot
          data={[
            {
              x: transform.freq,
              y: transform.magnitude,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'blue' },
            },
          ]}
          layout={{
            width: 600,
            height: 400,
            title: 'Fourier Transform',
            xaxis: { title: 'Frequency' },
            yaxis: { title: 'Magnitude' },
          }}
        />
      )}
    </div>
  );
};

export default FourierTransform;