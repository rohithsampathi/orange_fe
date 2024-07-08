import React from 'react';

const LoadingAnimation = ({ elapsedTime }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <div className="w-64 h-64 relative mb-4">
      <iframe 
        src="https://giphy.com/embed/hL9q5k9dk9l0wGd4e0" 
        width="100%" 
        height="100%" 
        style={{position: 'absolute'}} 
        frameBorder="0" 
        className="giphy-embed" 
        allowFullScreen
        title="Loading Animation"
      ></iframe>
    </div>
    <p className="text-xl font-bold">Generating content...</p>
    <p className="text-lg">Time elapsed: {elapsedTime} seconds</p>
  </div>
);

export default LoadingAnimation;