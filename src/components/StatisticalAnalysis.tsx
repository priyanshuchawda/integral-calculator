import React, { useState } from 'react';
import * as math from 'mathjs';

interface StatisticalAnalysisProps {
  addToHistory: (entry: string) => void;
}

interface Results {
  mean?: number;
  median?: number;
  mode?: number[];
  variance?: number;
  standardDeviation?: number;
  error?: string;
}

const StatisticalAnalysis: React.FC<StatisticalAnalysisProps> = ({ addToHistory }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Results>({});

  const calculateStatistics = () => {
    try {
      const numbers = input.split(',').map(num => parseFloat(num.trim()));
      const mean = math.mean(numbers);
      const median = math.median(numbers);
      const mode = calculateMode(numbers);
      const variance = math.variance(numbers);
      const standardDeviation = math.std(numbers);
      
      setResults({ 
        mean: typeof mean === 'number' ? mean : undefined,
        median: typeof median === 'number' ? median : undefined,
        mode,
        variance: typeof variance === 'number' ? variance : undefined,
        standardDeviation: typeof standardDeviation === 'number' ? standardDeviation : undefined
      });
      addToHistory(`Statistical analysis: ${input}`);
    } catch (error) {
      setResults({ error: 'Invalid input' });
    }
  };

  const calculateMode = (numbers: number[]): number[] => {
    const frequency: { [key: number]: number } = {};
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFrequency = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter(key => frequency[parseFloat(key)] === maxFrequency && maxFrequency > 1)
      .map(key => parseFloat(key));
  };

  return (
    <div className="statistical-analysis">
      <h2>Statistical Analysis</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter numbers separated by commas"
      />
      <button onClick={calculateStatistics}>Calculate</button>
      {results.error ? (
        <p className="error">{results.error}</p>
      ) : (
        <div className="results">
          <p>Mean: {results.mean?.toFixed(4)}</p>
          <p>Median: {results.median?.toFixed(4)}</p>
          <p>Mode: {results.mode?.join(', ')}</p>
          <p>Variance: {results.variance?.toFixed(4)}</p>
          <p>Standard Deviation: {results.standardDeviation?.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default StatisticalAnalysis;