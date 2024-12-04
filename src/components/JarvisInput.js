// src/components/JarvisInput.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const JarvisInput = ({ question, onAnswer, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const typingSpeed = 50; // milliseconds per character

  useEffect(() => {
    let isMounted = true; // To prevent state updates after unmounting
    setDisplayedText(''); // Reset displayed text when question changes

    const typeCharacter = (index) => {
      if (index < question.text.length && isMounted) {
        setDisplayedText((prev) => prev + question.text.charAt(index));
        setTimeout(() => typeCharacter(index + 1), typingSpeed);
      }
    };

    typeCharacter(0); // Start typing from the first character

    return () => {
      isMounted = false; // Cleanup flag
    };
  }, [question.text, typingSpeed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAnswer(inputValue);
      setInputValue('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-teal-200 relative"
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 text-teal-200 hover:text-teal-400"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-80"></div>
        <div className="grid grid-cols-3 gap-4 p-4">
          {Array(9)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-teal-500 opacity-10 h-32 animate-pulse"
              ></div>
            ))}
        </div>
      </div>
      <div className="z-10 w-full max-w-md px-4">
        {/* Revised Typing Animation */}
        <h2 className="text-3xl mb-8 font-bold text-center">
          {displayedText}
          <span className="blinking-cursor">|</span>
        </h2>
        <form onSubmit={handleSubmit}>
          {question.type === 'dropdown' && (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 mb-4 bg-transparent border-b-2 border-teal-500 text-teal-200 focus:outline-none focus:border-teal-400"
            >
              <option value="">Select an option</option>
              {question.options.map((option) => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
          )}
          {(question.type === 'textarea' || question.type === 'text') && (
            question.type === 'textarea' ? (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-3 mb-4 bg-transparent border-b-2 border-teal-500 text-teal-200 focus:outline-none focus:border-teal-400 resize-none"
                placeholder="Type your answer here..."
                autoFocus
                rows={4} // Adjust rows as needed
              />
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-3 mb-4 bg-transparent border-b-2 border-teal-500 text-teal-200 focus:outline-none focus:border-teal-400"
                placeholder="Type your answer here..."
                autoFocus
              />
            )
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-400 transition-colors font-medium mt-4"
          >
            Next
          </button>
        </form>
      </div>
      {/* Blinking Cursor Styling */}
      <style jsx>{`
        .blinking-cursor {
          display: inline-block;
          width: 10px;
          background-color: currentColor;
          animation: blink 1s steps(1) infinite;
          margin-left: 2px;
        }

        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default JarvisInput;
