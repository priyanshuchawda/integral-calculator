import React, { useEffect, useRef } from 'react';
import functionPlot from 'function-plot';

interface DesmosLikeGraphProps {
  functions: string[];
  title: string;
  width?: number;
  height?: number;
}

const DesmosLikeGraph: React.FC<DesmosLikeGraphProps> = ({ functions, title, width = 800, height = 500 }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.innerHTML = '';
      try {
        functionPlot({
          target: rootRef.current,
          title,
          width,
          height,
          yAxis: { domain: [-10, 10] },
          xAxis: { domain: [-10, 10] },
          grid: true,
          data: functions.map(func => ({ fn: func })),
        });
      } catch (error) {
        console.error('Error plotting function:', error);
        rootRef.current.innerHTML = 'Error plotting function. Please check your input.';
      }
    }
  }, [functions, title, width, height]);

  return <div ref={rootRef} className="graph-container"></div>;
};

export default DesmosLikeGraph;
