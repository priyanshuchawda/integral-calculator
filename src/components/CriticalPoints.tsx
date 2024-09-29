import React from 'react';
import * as nerdamer from 'nerdamer/all.min';
import * as math from 'mathjs';

interface CriticalPointsProps {
  functions: { func: string; color: string }[];
  variable: string;
}

const CriticalPoints: React.FC<CriticalPointsProps> = ({ functions, variable }) => {
  const findCriticalPoints = (func: string): { x: number; y: number }[] => {
    try {
      const derivative = nerdamer.diff(func, variable).toString();
      const criticalPoints: { x: number; y: number }[] = [];
      
      // Find roots of the derivative
      const roots = nerdamer(`solve(${derivative},${variable})`).evaluate();
      
      roots.forEach((root: any) => {
        const x = Number(root.valueOf());
        if (!isNaN(x)) {
          const roundedX = Math.round(x * 1000) / 1000; // Round to 3 decimal places
          const y = Math.round(math.evaluate(func, { [variable]: roundedX }) * 1000) / 1000;
          criticalPoints.push({ x: roundedX, y });
        }
      });
      
      return criticalPoints;
    } catch (error) {
      console.error('Error finding critical points:', error);
      return [];
    }
  };

  return (
    <div className="critical-points">
      <h4>Critical Points</h4>
      {functions.map((f, index) => (
        <div key={index} style={{ color: f.color }}>
          <p>Function {index + 1}: {f.func}</p>
          <ul>
            {findCriticalPoints(f.func).map((point, i) => (
              <li key={i}>x = {point.x}, y = {point.y}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CriticalPoints;
