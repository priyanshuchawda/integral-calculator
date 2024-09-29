import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { create, all } from 'mathjs';
import { Data, Datum } from 'plotly.js';
import { SketchPicker, ColorResult } from 'react-color';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import { getGeminiResponse, ChatMessage } from '../services/geminiService';
import './GraphTab.css';
import MatrixInput from './MatrixInput';
import DeterminantCalculator from './DeterminantCalculator';

const math = create(all);

interface GraphProps {
  addToHistory: (entry: string) => void;
}

const GraphTab: React.FC<GraphProps> = ({ addToHistory }) => {
  const [activeTab, setActiveTab] = useState<'askAI' | 'graph' | 'determinant'>('askAI');
  const [darkMode, setDarkMode] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [functions, setFunctions] = useState<Array<{ expr: string; color: string }>>([{ expr: 'x^2', color: '#1f77b4' }]);
  const [newFunction, setNewFunction] = useState('');
  const [xRange, setXRange] = useState([-10, 10]);
  const [yRange, setYRange] = useState([-10, 10]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#1f77b4');
  const [matrix3, setMatrix3] = useState<number[][]>(Array(3).fill(Array(3).fill(0)));
  const [matrix4, setMatrix4] = useState<number[][]>(Array(4).fill(Array(4).fill(0)));
  const [matrix5, setMatrix5] = useState<number[][]>([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]);
  const [customSize, setCustomSize] = useState<number>(0);
  const [customMatrix, setCustomMatrix] = useState<number[][]>([]);
  const [determinant3, setDeterminant3] = useState<number | null>(null);
  const [determinant4, setDeterminant4] = useState<number | null>(null);
  const [determinant5, setDeterminant5] = useState<number | null>(null);
  const [customDeterminant, setCustomDeterminant] = useState<number | null>(null);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

  const handleAiSubmit = async () => {
    setIsLoading(true);
    setAiOutput('');
    try {
      const messages: ChatMessage[] = [{ role: 'user', content: aiInput }];
      const response = await getGeminiResponse(messages, API_KEY);
      setAiOutput(response);
      addToHistory(`User asked AI: ${aiInput}`);
      addToHistory(`AI responded: ${response}`);
    } catch (error) {
      console.error('Error processing AI request:', error);
      setAiOutput(`Error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunction = () => {
    if (newFunction) {
      setFunctions([...functions, { expr: newFunction, color: currentColor }]);
      setNewFunction('');
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setCurrentColor(color.hex);
  };

  const generatePlotData = (): Data[] => {
    return functions.map(func => {
      const xValues = math.range(xRange[0], xRange[1], 0.1).toArray() as number[];
      const yValues = xValues.map(val => math.evaluate(func.expr, { x: val })) as number[];
      return {
        x: xValues as Datum[],
        y: yValues as Datum[],
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: func.color },
        name: func.expr,
      };
    });
  };

  const handleMatrixChange = (matrix: number[][], setMatrix: React.Dispatch<React.SetStateAction<number[][]>>) => 
    (i: number, j: number, value: string) => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const newMatrix = matrix.map((row, rowIndex) =>
          row.map((cell, cellIndex) =>
            rowIndex === i && cellIndex === j ? numValue : cell
          )
        );
        setMatrix(newMatrix);
      }
    };

  const calculateDeterminant = (matrix: number[][], setDeterminant: React.Dispatch<React.SetStateAction<number | null>>) => () => {
    // Implement determinant calculation logic here
    // For simplicity, let's just set a dummy value
    setDeterminant(Math.random() * 100);
  };

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value);
    setCustomSize(size);
    setCustomMatrix(Array(size).fill(Array(size).fill(0)));
  };

  const handleCustomMatrixChange = (row: number, col: number, value: string) => {
    const newMatrix = customMatrix.map((r, i) => 
      r.map((c, j) => (i === row && j === col) ? Number(value) : c)
    );
    setCustomMatrix(newMatrix);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculateDeterminant(customMatrix, setCustomDeterminant)();
    }
  };

  return (
    <div className={`graph-tab ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('askAI')} className={activeTab === 'askAI' ? 'active' : ''}>Ask AI</button>
        <button onClick={() => setActiveTab('graph')} className={activeTab === 'graph' ? 'active' : ''}>Graph</button>
        <button onClick={() => setActiveTab('determinant')} className={activeTab === 'determinant' ? 'active' : ''}>Determinant</button>
        <button onClick={() => setDarkMode(!darkMode)} className="theme-button">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      
      {activeTab === 'askAI' && (
        <div className="ai-tab">
          <div className="ai-output">
            {aiOutput || "AI output will appear here"}
            {isLoading && <p>Loading...</p>}
          </div>
          <div className="ai-input-container">
            <textarea
              className="ai-input"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask AI about mathematics..."
            />
            <button onClick={handleAiSubmit} disabled={isLoading} className="ai-submit-btn">
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'graph' && (
        <div className="graph-container">
          <Plot
            data={generatePlotData()}
            layout={{
              width: 600,
              height: 400,
              title: 'Function Graph',
              xaxis: { range: xRange },
              yaxis: { range: yRange },
            }}
          />
          <div className="function-input">
            <input
              type="text"
              value={newFunction}
              onChange={(e) => setNewFunction(e.target.value)}
              placeholder="Enter a function (e.g., x^2)"
            />
            <button onClick={handleAddFunction}>Add Function</button>
            <button onClick={() => setShowColorPicker(!showColorPicker)}>
              <FaPalette /> Choose Color
            </button>
            {showColorPicker && (
              <SketchPicker
                color={currentColor}
                onChangeComplete={handleColorChange}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === 'determinant' && (
        <div className="determinant-container">
          <h3>3x3 Matrix Determinant Calculator</h3>
          <MatrixInput matrix={matrix3} onChange={handleMatrixChange(matrix3, setMatrix3)} />
          <button onClick={calculateDeterminant(matrix3, setDeterminant3)}>Calculate 3x3 Determinant</button>
          {determinant3 !== null && <p>The 3x3 determinant is: {determinant3}</p>}

          <h3>4x4 Matrix Determinant Calculator</h3>
          <MatrixInput matrix={matrix4} onChange={handleMatrixChange(matrix4, setMatrix4)} />
          <button onClick={calculateDeterminant(matrix4, setDeterminant4)}>Calculate 4x4 Determinant</button>
          {determinant4 !== null && <p>The 4x4 determinant is: {determinant4}</p>}
        </div>
      )}
    </div>
  );
};

export default GraphTab;