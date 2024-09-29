import React, { useState, useRef, useEffect } from 'react';
import { FaSun, FaMoon, FaPaperPlane, FaCalculator, FaChartLine } from 'react-icons/fa';
import './MainTab.css';

// Import or create these components
import DeterminantCalculator from './DeterminantCalculator';
import Graph from './GraphTab'; // Make sure this import is correct

const MainTab: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('askAI');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'model', content: string}>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    // Here you would call your AI service
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', content: 'This is a simulated AI response.' }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`main-tab ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <nav className="tab-navigation">
        <button onClick={() => setActiveTab('askAI')} className={activeTab === 'askAI' ? 'active' : ''}>Ask AI</button>
        <button onClick={() => setActiveTab('determinant')} className={activeTab === 'determinant' ? 'active' : ''}>Determinant</button>
        <button onClick={() => setActiveTab('graph')} className={activeTab === 'graph' ? 'active' : ''}>Graph</button>
        <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </nav>

      <div className="tab-content">
        {activeTab === 'askAI' && (
          <div className="chat-container">
            <div className="chat-history" ref={chatHistoryRef}>
              {messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.role}`}>
                  <div className="message-content">{message.content}</div>
                </div>
              ))}
            </div>
            <div className="input-area">
              <form onSubmit={handleSubmit} className="input-container">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  rows={1}
                />
                <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        )}
        {activeTab === 'determinant' && <DeterminantCalculator />}
        {activeTab === 'graph' && <Graph addToHistory={() => {}} />}
      </div>
    </div>
  );
};

export default MainTab;