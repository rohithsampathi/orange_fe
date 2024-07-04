import React from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

const SocialPostDisplay = ({ result }) => (
  <div className="bg-white shadow-xl rounded-lg max-w-md w-full">
    <div className="p-4 border-b flex items-center">
      <img src="/luxofy_logo.png" alt="Luxofy" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-bold text-black">luxofy_realty</p>
        <p className="text-xs text-black">Original audio</p>
      </div>
    </div>
    <div className="p-4">
      <p className="whitespace-pre-wrap" style={{ color: 'black' }}>{result}</p>
    </div>
    <div className="p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Heart style={{ color: 'red' }} />
        <MessageCircle style={{ color: 'black' }} />
        <Send style={{ color: 'blue' }} />
      </div>
      <Bookmark style={{ color: 'black' }} />
    </div>
    <div className="p-4 text-sm text-gray-500">
      <p>Liked by propertyhubgoa and 1 other</p>
      <p>18 minutes ago</p>
    </div>
  </div>
);

const PollDisplay = ({ result }) => {
  const pollData = JSON.parse(result);
  
  return (
    <div className="bg-white shadow-xl rounded-lg max-w-md w-full">
      <div className="p-4 border-b flex items-center">
        <img src="/luxofy_logo.png" alt="Luxofy" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-bold text-black">luxofy_realty</p>
          <p className="text-xs text-black">Poll</p>
        </div>
      </div>
      <div className="p-4">
        <p className="font-bold text-black mb-4">{pollData.question}</p>
        {pollData.options.map((option, index) => (
          <div key={index} className="mb-2 bg-gray-100 rounded-full p-2">
            <div className="bg-blue-500 rounded-full" style={{ width: `${option.percentage}%`, height: '24px' }}></div>
            <p className="text-black -mt-6 ml-2">{option.text} ({option.percentage}%)</p>
          </div>
        ))}
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Heart style={{ color: 'red' }} />
          <MessageCircle style={{ color: 'black' }} />
          <Send style={{ color: 'blue' }} />
        </div>
        <Bookmark style={{ color: 'black' }} />
      </div>
      <div className="p-4 text-sm text-gray-500">
        <p>{pollData.votes} votes • {pollData.timeLeft} left</p>
      </div>
    </div>
  );
};

const ResultDisplay = ({ result, postType, onBack, onRetry }) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    {postType === 'Poll' ? (
      <PollDisplay result={result} />
    ) : (
      <SocialPostDisplay result={result} />
    )}
    <div className="p-4 flex justify-between">
      <button onClick={onBack} className="text-blue-500">Back</button>
      <button onClick={onRetry} className="bg-orange-500 text-white px-4 py-2 rounded">Retry</button>
    </div>
  </div>
);

export default ResultDisplay;