import React from 'react';
import GraphTab from './components/GraphTab';
import './App.css';

const App: React.FC = () => {
  const addToHistory = (entry: string) => {
    // Implement your history logic here
    console.log('Added to history:', entry);
  };

  return (
    <div className="App">
      <GraphTab addToHistory={addToHistory} />
    </div>
  );
};

export default App;
