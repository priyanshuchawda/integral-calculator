import React, { useState } from 'react';
import AdvancedCalculator from './AdvancedCalculator';
import IntegralCalculator from './IntegralCalculator';
import StatisticalAnalysis from './StatisticalAnalysis';
import MatrixCalculator from './MatrixCalculator';
import PolynomialSolver from './PolynomialSolver';
import GraphTab from './GraphTab';
import UnitConverter from './UnitConverter';
import DerivativeCalculator from './DerivativeCalculator';
import AITab from './AITab';
import History from './History';
import './Calculator.css';

interface CalculatorProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

type CalculatorType = 'advanced' | 'integral' | 'statistical' | 'matrix' | 'polynomial' | 'graph' | 'unit' | 'derivative' | 'ai';

const Calculator: React.FC<CalculatorProps> = ({ toggleTheme, theme }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('advanced');

  const addToHistory = (entry: string) => {
    setHistory(prev => [...prev, entry]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteHistoryItem = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`calculator-container ${theme}`}>
      <div className="calculator-header">
        <button onClick={toggleTheme}>Toggle Theme</button>
        <div className="calculator-tabs">
          <button 
            className={activeCalculator === 'advanced' ? 'active' : ''}
            onClick={() => setActiveCalculator('advanced')}
          >
            Advanced
          </button>
          <button 
            className={activeCalculator === 'integral' ? 'active' : ''}
            onClick={() => setActiveCalculator('integral')}
          >
            Integral
          </button>
          <button 
            className={activeCalculator === 'statistical' ? 'active' : ''}
            onClick={() => setActiveCalculator('statistical')}
          >
            Statistical
          </button>
          <button 
            className={activeCalculator === 'matrix' ? 'active' : ''}
            onClick={() => setActiveCalculator('matrix')}
          >
            Matrix
          </button>
          <button 
            className={activeCalculator === 'polynomial' ? 'active' : ''}
            onClick={() => setActiveCalculator('polynomial')}
          >
            Polynomial
          </button>
          <button 
            className={activeCalculator === 'graph' ? 'active' : ''}
            onClick={() => setActiveCalculator('graph')}
          >
            Graph
          </button>
          <button 
            className={activeCalculator === 'unit' ? 'active' : ''}
            onClick={() => setActiveCalculator('unit')}
          >
            Unit Converter
          </button>
          <button 
            className={activeCalculator === 'derivative' ? 'active' : ''}
            onClick={() => setActiveCalculator('derivative')}
          >
            Derivative
          </button>
          <button 
            className={activeCalculator === 'ai' ? 'active' : ''}
            onClick={() => setActiveCalculator('ai')}
          >
            AI Assistant
          </button>
        </div>
      </div>
      <div className="calculator-main">
        <div className="calculator-body">
          {activeCalculator === 'advanced' && <AdvancedCalculator addToHistory={addToHistory} />}
          {activeCalculator === 'integral' && <IntegralCalculator addToHistory={addToHistory} />}
          {activeCalculator === 'statistical' && <StatisticalAnalysis addToHistory={addToHistory} />}
          {activeCalculator === 'matrix' && <MatrixCalculator addToHistory={addToHistory} />}
          {activeCalculator === 'polynomial' && <PolynomialSolver addToHistory={addToHistory} />}
          {activeCalculator === 'graph' && <GraphTab addToHistory={addToHistory} />}
          {activeCalculator === 'unit' && <UnitConverter addToHistory={addToHistory} />}
          {activeCalculator === 'derivative' && <DerivativeCalculator addToHistory={addToHistory} />}
          {activeCalculator === 'ai' && <AITab theme={theme} addToHistory={addToHistory} />}
        </div>
        <div className="calculator-history">
          <History 
            history={history} 
            clearHistory={clearHistory} 
            deleteHistoryItem={deleteHistoryItem} 
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
