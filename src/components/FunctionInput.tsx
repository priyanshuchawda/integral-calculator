import React, { useState, useCallback } from 'react';
import FunctionPlotter from './FunctionPlotter';

interface FunctionInputProps {
  funcs: { func: string; color: string }[];
  onFuncsChange: (funcs: { func: string; color: string }[]) => void;
  functionType: string;
  onFunctionTypeChange: (type: string) => void;
  variable: string;
}

const FunctionInput: React.FC<FunctionInputProps> = ({ 
  funcs, 
  onFuncsChange, 
  functionType, 
  onFunctionTypeChange,
  variable
}) => {
  const [newFunc, setNewFunc] = useState('');
  const [newColor, setNewColor] = useState('#000000');

  const handleFuncChange = (index: number, value: string) => {
    const updatedFuncs = [...funcs];
    updatedFuncs[index].func = value;
    onFuncsChange(updatedFuncs);
  };

  const handleColorChange = (index: number, value: string) => {
    const updatedFuncs = [...funcs];
    updatedFuncs[index].color = value;
    onFuncsChange(updatedFuncs);
  };

  const addFunction = () => {
    if (newFunc) {
      onFuncsChange([...funcs, { func: newFunc, color: newColor }]);
      setNewFunc('');
      setNewColor('#000000');
    }
  };

  const removeFunction = (index: number) => {
    const updatedFuncs = funcs.filter((_, i) => i !== index);
    onFuncsChange(updatedFuncs);
  };

  const handleCriticalPointsUpdate = useCallback((points: any[]) => {
    // Handle the critical points update here
    console.log('Critical points updated:', points);
    // You might want to update some state or perform some action with these points
  }, []);

  return (
    <div className="function-input">
      <select 
        value={functionType}
        onChange={(e) => onFunctionTypeChange(e.target.value)}
      >
        <option value="standard">Standard</option>
        <option value="parametric">Parametric</option>
        <option value="implicit">Implicit</option>
      </select>
      
      {funcs.map((func, index) => (
        <div key={index}>
          <input
            type="text"
            value={func.func}
            onChange={(e) => handleFuncChange(index, e.target.value)}
            placeholder={`Enter function ${index + 1}`}
          />
          <input
            type="color"
            value={func.color}
            onChange={(e) => handleColorChange(index, e.target.value)}
          />
          <button onClick={() => removeFunction(index)}>Remove</button>
        </div>
      ))}

      <div>
        <input
          type="text"
          value={newFunc}
          onChange={(e) => setNewFunc(e.target.value)}
          placeholder="Enter new function"
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button onClick={addFunction}>Add Function</button>
      </div>

      <FunctionPlotter 
        functions={funcs}
        variable={variable}
        lowerBound="-10" // Add this line
        upperBound="10"  // Add this line
      />
    </div>
  );
};

export default FunctionInput;
