import React from 'react';
import '../styles/InputArea.css';

interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  onCalculate: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ input, setInput, onCalculate }) => {
  return (
    <div className="input-area">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your query (e.g., 'solve x^2 + 2x - 3 = 0' or 'plot sin(x) from -pi to pi')"
        className="main-input"
      />
      <button onClick={onCalculate} className="equals-button">=</button>
    </div>
  );
};

export default InputArea;
