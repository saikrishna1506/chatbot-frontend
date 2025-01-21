// src/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUserInput = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/chat', { message: userInput });
      setChatHistory([...chatHistory, { user: userInput, bot: response.data.response }]);
      setUserInput('');
    } catch (error) {
      console.error('Error communicating with backend', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>College Resource Chatbot</h1>
      <div>
        {chatHistory.map((msg, index) => (
          <div key={index}>
            <strong>You:</strong> {msg.user}
            <br />
            <strong>Bot:</strong> {msg.bot}
            <hr />
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleUserInput} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
