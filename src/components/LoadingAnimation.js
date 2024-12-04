// src/components/LoadingAnimation.js

import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = ({ elapsedTime }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-teal-200 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-90"></div>
    <div className="z-10 text-center">
      <motion.div
        className="mb-8"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="teal"
            strokeWidth="2"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset="75"
          />
          <circle cx="50" cy="50" r="2" fill="teal" />
        </svg>
      </motion.div>
      <p className="text-2xl font-bold mb-2">Processing your request...</p>
      <p className="text-lg">Elapsed Time: {elapsedTime} seconds</p>
    </div>
  </div>
);

export default LoadingAnimation;
