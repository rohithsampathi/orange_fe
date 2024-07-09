import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

const API_BASE_URL = 'https://ca5f-122-174-51-29.ngrok-free.app/api';

const ChatWindow = ({ industry, purpose, client, token, apiBaseUrl }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatText = (text) => {
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Replace **text** with <strong>text</strong>
      .replace(/\n\n/g, '<br /><br />');  // Replace \n\n with <br /><br />
    
    return DOMPurify.sanitize(formattedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/generate_orange_strategy_chat`, {
        industry,
        purpose,
        client,
        user_input: input
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.result }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4">
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500' : 'bg-gray-700'}`}>
              <span dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-orange-500 text-white p-2 rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
