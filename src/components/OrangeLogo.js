// src/components/OrangeLogo.js

import React from 'react';

const OrangeLogo = () => (
  <svg className="w-10 h-10" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#319795" />
    <path
      d="M50 15 Q60 30 60 50 Q60 70 50 85 Q40 70 40 50 Q40 30 50 15"
      fill="#81E6D9"
      fillOpacity="0.3"
    />
    <path
      d="M30 40 Q50 45 70 40 Q67 60 50 75 Q33 60 30 40"
      fill="#FFFFFF"
      fillOpacity="0.2"
    />
    <circle cx="50" cy="50" r="5" fill="#0d1117" />
  </svg>
);

export default OrangeLogo;
