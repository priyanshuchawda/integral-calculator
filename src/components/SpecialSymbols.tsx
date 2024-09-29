import React from 'react';
import './SpecialSymbols.css';

interface SpecialSymbolsProps {
  onSymbolClick: (symbol: string) => void;
}

const SpecialSymbols: React.FC<SpecialSymbolsProps> = ({ onSymbolClick }) => {
  const symbols = ['π', '∞', '√', '∫', '∂', '∑', '∏', 'θ', 'λ', 'μ'];

  return (
    <div className="special-symbols">
      {symbols.map(symbol => (
        <button key={symbol} onClick={() => onSymbolClick(symbol)}>
          {symbol}
        </button>
      ))}
    </div>
  );
};

export default SpecialSymbols;