// src/components/ResultDisplay.js

import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, Mail } from 'lucide-react';

const SocialPostDisplay = ({ result }) => (
  <div className="bg-gray-800 shadow-xl rounded-lg max-w-md w-full text-teal-200">
    <div className="p-4 border-b border-gray-700 flex items-center">
      <img src="/luxofy_logo.png" alt="Luxofy" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-bold">Montaigne Labs</p>
        <p className="text-xs">1M Followers</p>
      </div>
    </div>
    <div className="p-4">
      <p className="whitespace-pre-wrap">{result}</p>
    </div>
    <div className="p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Heart className="text-teal-400" />
        <MessageCircle className="text-teal-400" />
        <Send className="text-teal-400" />
      </div>
      <Bookmark className="text-teal-400" />
    </div>
    <div className="p-4 text-sm text-gray-500">
      <p>Liked by propertyhubgoa and 1 other</p>
      <p>18 minutes ago</p>
    </div>
  </div>
);

const FacebookAdDisplay = ({ result }) => (
  <div className="bg-gray-800 shadow-xl rounded-lg max-w-md w-full text-teal-200">
    <div className="p-4 border-b border-gray-700 flex items-center">
      <img src="/1acre_logo.png" alt="1acre" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-bold">1acre.in</p>
        <p className="text-xs">Sponsored • 3 days ago</p>
      </div>
    </div>
    <div className="p-4">
      <p className="whitespace-pre-wrap">{result}</p>
    </div>
    <div className="p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Heart className="text-teal-400" />
        <MessageCircle className="text-teal-400" />
        <Send className="text-teal-400" />
      </div>
    </div>
    <div className="p-4 text-sm text-teal-400">
      #1acre #buylands #businessowner #properties #hyderabad #telangana #realestate
    </div>
  </div>
);

const EmailDisplay = ({ result }) => (
  <div className="bg-gray-800 shadow-xl rounded-lg max-w-md w-full text-teal-200">
    <div className="p-4 border-b border-gray-700 flex items-center">
      <Mail className="w-6 h-6 mr-3 text-teal-400" />
      <div>
        <p className="font-bold">CEO Email</p>
        <p className="text-xs">Generated Email Content</p>
      </div>
    </div>
    <div className="p-4">
      <pre className="whitespace-pre-wrap">{result}</pre>
    </div>
  </div>
);

const ResultDisplay = ({ result, postType, onBack, onRetry }) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
    <div className="w-full max-w-md">
      {postType === 'Poll' ? (
        <FacebookAdDisplay result={result} />
      ) : postType === 'CEO Email' ? (
        <EmailDisplay result={result} />
      ) : (
        <SocialPostDisplay result={result} />
      )}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBack}
          className="text-teal-400 hover:text-teal-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onRetry}
          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-400 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);

export default ResultDisplay;
