import React from 'react';

interface DifferentiationTabProps {
  theme: 'light' | 'dark';
}

const DifferentiationTab: React.FC<DifferentiationTabProps> = ({ theme }) => {
  return (
    <div className={`differentiation-tab ${theme}`}>
      <h2>Differentiation</h2>
      {/* Add differentiation functionality here */}
    </div>
  );
};

export default DifferentiationTab;