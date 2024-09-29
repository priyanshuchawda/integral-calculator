import React from 'react';
import './History.css';

interface HistoryProps {
  history: string[];
  clearHistory: () => void;
  deleteHistoryItem: (index: number) => void;
}

const History: React.FC<HistoryProps> = ({ history, clearHistory, deleteHistoryItem }) => {
  return (
    <div className="history">
      <h2>History</h2>
      <button onClick={clearHistory}>Clear History</button>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => deleteHistoryItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;