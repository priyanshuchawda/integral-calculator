import React, { useState } from 'react';
import './Tips.css';

const Tips: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`tips ${isExpanded ? 'expanded' : ''}`}>
      <h3 onClick={toggleExpanded}>
        Tips for using the calculator {isExpanded ? '▲' : '▼'}
      </h3>
      {isExpanded && (
        <ul>
          <li>Use ^ for exponents (e.g., x^2 for x squared)</li>
          <li>Use * for multiplication (e.g., 2*x)</li>
          <li>Use / for division (e.g., 1/x)</li>
          <li>Use pi for π and e for Euler's number</li>
          <li>Available functions: sin, cos, tan, log, exp, sqrt, abs</li>
          <li>Press Ctrl+Enter (or Cmd+Enter on Mac) to calculate quickly</li>
        </ul>
      )}
    </div>
  );
};

export default Tips;
