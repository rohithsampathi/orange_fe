import React from 'react';

const LoadingAnimation = ({ elapsedTime }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <img src="./1474.gif" alt="Loading" className="w-64 h-64 mb-4" />
    <p className="text-xl font-bold">Generating content...</p>
    <p className="text-lg">Time elapsed: {elapsedTime} seconds</p>
  </div>
);

export default LoadingAnimation;