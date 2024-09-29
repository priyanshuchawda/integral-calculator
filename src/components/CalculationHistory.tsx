import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase/config';
import { collection, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import './CalculationHistory.css';

const CalculationHistory: React.FC = () => {
  const [user] = useAuthState(auth);
  const historyRef = collection(db, `users/${user?.uid}/history`);
  const historyQuery = query(historyRef, orderBy('createdAt', 'desc'), limit(10));
  const [history] = useCollectionData(historyQuery);

  const deleteHistoryItem = async (id: string) => {
    await deleteDoc(doc(historyRef, id));
  };

  if (!user) return null;

  return (
    <div className="calculation-history">
      <h3>Recent Calculations</h3>
      {history?.map((item: any) => (
        <div key={item.id} className="history-item">
          <button className="history-item-content" onClick={() => console.log('Load calculation', item)}>
            {item.expression} = {item.result}
          </button>
          <button className="delete-history-item" onClick={() => deleteHistoryItem(item.id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default CalculationHistory;
