import React, { useEffect } from 'react';
import { MathJax } from 'better-react-mathjax';

interface ResultDisplayProps {
  result: any;
  theme: string;
  format: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, theme, format }) => {
  useEffect(() => {
    // This will trigger MathJax to reprocess the page
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }, [result]);

  return (
    <div className={`result-display ${theme}`}>
      <h3>Result:</h3>
      <MathJax>{`\\[${result.result}\\]`}</MathJax>
      <p>Format: {format}</p>
    </div>
  );
};

export default ResultDisplay;
