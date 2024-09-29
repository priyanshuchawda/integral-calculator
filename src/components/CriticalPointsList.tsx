import React from 'react';

interface CriticalPoint {
  x: number;
  y: number;
  type: string;
}

interface CriticalPointsListProps {
  points: CriticalPoint[];
}

const CriticalPointsList: React.FC<CriticalPointsListProps> = ({ points }) => {
  const filterAndSortPoints = (points: CriticalPoint[]): CriticalPoint[] => {
    const yIntercepts = points.filter(p => p.type.includes('y-intercept'));
    const xIntercepts = points.filter(p => p.type.includes('x-intercept'));
    const intersections = points.filter(p => p.type.includes('intersection'));
    const extrema = points.filter(p => p.type.includes('extremum'));

    return [...yIntercepts, ...xIntercepts, ...intersections, ...extrema]
      .sort((a, b) => a.x - b.x)
      .filter((p, i, arr) => 
        i === 0 || 
        Math.abs(p.x - arr[i-1].x) > 0.01 || 
        Math.abs(p.y - arr[i-1].y) > 0.01
      );
  };

  const filteredPoints = filterAndSortPoints(points);

  return (
    <div className="critical-points-list">
      <h4>Critical Points:</h4>
      <ul>
        {filteredPoints.map((point, index) => (
          <li key={index}>
            {point.type}: x = {point.x.toFixed(2)}, y = {point.y.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CriticalPointsList;
