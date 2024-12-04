// src/components/ChatWindow.js

import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

const ChatWindow = ({ industry, purpose, client, token, apiBaseUrl, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatText = (text) => {
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br /><br />');

    return DOMPurify.sanitize(formattedText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/generate_orange_strategy_chat`,
        {
          industry,
          purpose,
          client,
          user_input: input,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.result },
      ]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-teal-200">
      <div className="flex-none p-4 bg-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold">Strategy Chat</h2>
        <button
          onClick={onBack}
          className="text-teal-400 hover:text-teal-200 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="flex-grow overflow-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-800 text-teal-200'
              }`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: formatText(message.content),
                }}
              />
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 bg-gray-700 text-teal-200 rounded-l-md focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-400 transition-colors"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
