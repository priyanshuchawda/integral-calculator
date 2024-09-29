import React, { useState } from 'react';
import * as math from 'mathjs';

interface UnitConverterProps {
  addToHistory: (entry: string) => void;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ addToHistory }) => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState('');

  const unitCategories = {
    length: ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
    mass: ['g', 'kg', 'mg', 'lb', 'oz'],
    volume: ['l', 'ml', 'gal', 'qt', 'pt', 'cup'],
    // Add more categories as needed
  };

  const convert = () => {
    try {
      const convertedValue = math.unit(parseFloat(value), fromUnit).to(toUnit);
      setResult(`${value} ${fromUnit} = ${convertedValue.format({ precision: 4 })} ${toUnit}`);
      addToHistory(`Converted ${value} ${fromUnit} to ${toUnit}`);
    } catch (error) {
      setResult('Error: Invalid conversion');
      addToHistory('Unit conversion error');
    }
  };

  return (
    <div className="unit-converter">
      <h2>Unit Converter</h2>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />
      <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
        {Object.entries(unitCategories).map(([category, units]) => (
          <optgroup key={category} label={category}>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <span>to</span>
      <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
        {Object.entries(unitCategories).map(([category, units]) => (
          <optgroup key={category} label={category}>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <button onClick={convert}>Convert</button>
      <div className="result">{result}</div>
    </div>
  );
};

export default UnitConverter;