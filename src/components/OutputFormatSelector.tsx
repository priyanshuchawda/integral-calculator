import React from 'react';

interface OutputFormatSelectorProps {
  format: string;
  onFormatChange: (format: string) => void;
}

const OutputFormatSelector: React.FC<OutputFormatSelectorProps> = ({ format, onFormatChange }) => {
  return (
    <div className="output-format-selector">
      <label htmlFor="output-format">Output Format:</label>
      <select
        id="output-format"
        value={format}
        onChange={(e) => onFormatChange(e.target.value)}
      >
        <option value="exact">Exact</option>
        <option value="decimal">Decimal</option>
        <option value="simplified">Simplified</option>
      </select>
    </div>
  );
};

export default OutputFormatSelector;
