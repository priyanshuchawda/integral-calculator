import React from 'react';

interface ExampleSelectorProps {
  onSelectExample: (example: string) => void;
}

const ExampleSelector: React.FC<ExampleSelectorProps> = ({ onSelectExample }) => {
  const examples = [
    { name: 'Polynomial', func: 'x^2 + 2x + 1' },
    { name: 'Trigonometric', func: 'sin(x)' },
    { name: 'Exponential', func: 'e^x' },
    { name: 'Logarithmic', func: 'ln(x)' },
  ];

  return (
    <div className="example-selector">
      <label htmlFor="example-select">Select an example:</label>
      <select
        id="example-select"
        onChange={(e) => onSelectExample(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Choose an example</option>
        {examples.map((example, index) => (
          <option key={index} value={example.func}>
            {example.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExampleSelector;
