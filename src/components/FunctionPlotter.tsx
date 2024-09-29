import React from 'react';
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';
import { evaluate } from 'mathjs';

interface FunctionPlotterProps {
  functions: { func: string; color: string }[];
  variable: string;
  lowerBound: string;
  upperBound: string;
}

const FunctionPlotter: React.FC<FunctionPlotterProps> = ({
  functions,
  variable,
  lowerBound,
  upperBound,
}) => {
  const generatePoints = (func: string, lower: number, upper: number, points: number = 1000) => {
    const step = (upper - lower) / points;
    const x = [];
    const y = [];
    for (let i = 0; i <= points; i++) {
      const xVal = lower + i * step;
      x.push(xVal);
      try {
        // Use math.js to evaluate the function
        const yVal = evaluate(func, { [variable]: xVal });
        y.push(yVal);
      } catch (error) {
        console.error(`Error evaluating function at x=${xVal}:`, error);
        y.push(null);
      }
    }
    return { x, y };
  };

  const lower = Number(lowerBound) || -10;
  const upper = Number(upperBound) || 10;

  const data: Data[] = functions.map(({ func, color }) => {
    const { x, y } = generatePoints(func, lower, upper);
    return {
      x,
      y,
      type: 'scatter',
      mode: 'lines',
      name: func,
      line: { color, shape: 'spline' },
    } as Data;
  });

  const layout: Partial<Layout> = {
    title: 'Function Plot',
    xaxis: { title: variable },
    yaxis: { title: 'f(x)' },
    showlegend: true,
    legend: { x: 1, xanchor: 'right' as const, y: 1 },
  };

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: '100%', height: '400px' }}
      config={{ responsive: true }}
    />
  );
};

export default FunctionPlotter;
