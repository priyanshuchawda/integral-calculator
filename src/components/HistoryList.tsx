import React from 'react';
import { IntegrationResult } from '../types';

interface HistoryListProps {
  history: IntegrationResult[];
  onSelectHistory: (item: IntegrationResult) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectHistory }) => {
  return (
    <div className="history-list">
      <h3>Calculation History</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id} onClick={() => onSelectHistory(item)}>
            <span className="history-function">{item.func}</span>
            <span className="history-result">{item.result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;
