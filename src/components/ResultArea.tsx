import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '../styles/ResultArea.css';

interface ResultAreaProps {
  result: any;
}

const ResultArea: React.FC<ResultAreaProps> = ({ result }) => {
  if (!result) return null;

  const renderLatex = (latex: string) => {
    return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(latex) }} />;
  };

  return (
    <div className="result-area">
      <h2>Result:</h2>
      {result.type === 'latex' ? (
        renderLatex(result.value)
      ) : (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
      {result.steps && (
        <div className="solution-steps">
          <h3>Step-by-step solution:</h3>
          {result.steps.map((step: string, index: number) => (
            <div key={index} className="step">
              {renderLatex(step)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultArea;