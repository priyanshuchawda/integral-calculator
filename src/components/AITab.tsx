import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAIResponse } from '../services/aiService';
import './AITab.css';

interface AITabProps {
  theme: 'light' | 'dark';
  addToHistory: (entry: string) => void;
}

const AITab: React.FC<AITabProps> = ({ theme, addToHistory }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await getAIResponse(input);
      setResponse(result);
      addToHistory(`AI Response: ${input} → ${result}`);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse(t('ai_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-tab ${theme}`}>
      <h2>{t('ai_assistant')}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('ai_placeholder')}
          rows={4}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? t('ai_thinking') : t('ai_submit')}
        </button>
      </form>
      {response && (
        <div className="ai-response">
          <h3>{t('ai_response')}</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AITab;