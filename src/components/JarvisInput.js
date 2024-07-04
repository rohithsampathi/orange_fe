import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const JarvisInput = ({ question, onAnswer, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [displayedText, setDisplayedText] = useState(question.text);

  useEffect(() => {
    setDisplayedText(question.text);
    console.log('Question prop received:', question);
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnswer(inputValue);
    setInputValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white"
    >
      <button onClick={onBack} className="absolute top-4 left-4 text-white">
        <ArrowLeft />
      </button>
      <h2 className="text-3xl mb-8 font-bold text-center h-20">
        {displayedText}
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {question.type === 'dropdown' ? (
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 mb-4 bg-transparent border-b-2 border-orange-500 text-white focus:outline-none focus:border-orange-600"
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 mb-4 bg-transparent border-b-2 border-orange-500 text-white focus:outline-none focus:border-orange-600"
            placeholder="Type your answer here"
            autoFocus
          />
        )}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors font-medium mt-4"
        >
          Next
        </button>
      </form>
    </motion.div>
  );
};

export default JarvisInput;
