import React from 'react';
import { MathJax } from 'better-react-mathjax';

interface IntegrationStep {
  step: string;
  result: string;
  explanation: string;
  substeps?: {
    description: string;
    result: string;
  }[];
}

interface StepByStepSolutionProps {
  steps: IntegrationStep[];
}

const StepByStepSolution: React.FC<StepByStepSolutionProps> = ({ steps }) => {
  return (
    <div className="step-by-step-solution">
      <h3>Step-by-step Solution</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={index} className="solution-step">
            <p className="step-description">{step.step}</p>
            <MathJax className="step-result">{`\\[${step.result}\\]`}</MathJax>
            <p className="step-explanation">{step.explanation}</p>
            {step.substeps && (
              <ol className="substeps">
                {step.substeps.map((substep, subindex) => (
                  <li key={`${index}-${subindex}`} className="solution-substep">
                    <p className="substep-description">{substep.description}</p>
                    <MathJax className="substep-result">{`\\[${substep.result}\\]`}</MathJax>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StepByStepSolution;
