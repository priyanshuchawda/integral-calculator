import React from 'react';

interface ComplexIntegrationSettingsProps {
  path: string;
  onPathChange: (path: string) => void;
}

const ComplexIntegrationSettings: React.FC<ComplexIntegrationSettingsProps> = ({ path, onPathChange }) => {
  return (
    <div className="complex-integration-settings">
      <label htmlFor="complex-path">Integration Path:</label>
      <input
        id="complex-path"
        type="text"
        value={path}
        onChange={(e) => onPathChange(e.target.value)}
        placeholder="Enter integration path (e.g., CRLUD)"
      />
    </div>
  );
};

export default ComplexIntegrationSettings;
