import React from 'react';

interface MethodSelectorProps {
  method: string;
  onMethodChange: (method: string) => void;
}

const MethodSelector: React.FC<MethodSelectorProps> = ({ method, onMethodChange }) => {
  return (
    <div className="method-selector">
      <label htmlFor="method-select">Integration Method:</label>
      <select
        id="method-select"
        value={method}
        onChange={(e) => onMethodChange(e.target.value)}
      >
        <option value="auto">Automatic</option>
        <option value="substitution">U-Substitution</option>
        <option value="parts">Integration by Parts</option>
        <option value="partial_fractions">Partial Fractions</option>
        <option value="trig_substitution">Trigonometric Substitution</option>
      </select>
    </div>
  );
};

export default MethodSelector;
