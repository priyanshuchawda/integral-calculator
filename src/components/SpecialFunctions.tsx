import React, { useState } from 'react';
import './SpecialFunctions.css';

interface SpecialFunctionsProps {
  onInsert: (value: string) => void;
}

const SpecialFunctions: React.FC<SpecialFunctionsProps> = ({ onInsert }) => {
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [base, setBase] = useState('');

  const handleNCR = () => onInsert(`C(${n},${r})`);
  const handleNPR = () => onInsert(`P(${n},${r})`);
  const handleLog = () => onInsert(`log(${base},x)`);
  const handleFactorial = () => onInsert('factorial(x)');

  return (
    <div className="special-functions">
      <div className="function-group">
        <input type="number" value={n} onChange={(e) => setN(e.target.value)} placeholder="n" />
        <input type="number" value={r} onChange={(e) => setR(e.target.value)} placeholder="r" />
        <button onClick={handleNCR}>nCr</button>
        <button onClick={handleNPR}>nPr</button>
      </div>
      <div className="function-group">
        <input type="number" value={base} onChange={(e) => setBase(e.target.value)} placeholder="base" />
        <button onClick={handleLog}>log</button>
      </div>
      <div className="function-group">
        <button onClick={handleFactorial}>n!</button>
        <button onClick={() => onInsert('π')}>π</button>
        <button onClick={() => onInsert('e')}>e</button>
        <button onClick={() => onInsert('√')}>√</button>
        <button onClick={() => onInsert('∞')}>∞</button>
      </div>
    </div>
  );
};

export default SpecialFunctions;