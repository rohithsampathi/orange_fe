import React from 'react';

const OrangeLogo = () => (
  <svg className="w-10 h-10 mr-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="orangeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{stopColor:'#FFB300', stopOpacity:1}} />
        <stop offset="70%" style={{stopColor:'#FF8800', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:'#FF6B35', stopOpacity:1}} />
      </radialGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.5"/>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#orangeGradient)" filter="url(#shadow)"/>
    <path d="M50 15 Q60 30 60 50 Q60 70 50 85 Q40 70 40 50 Q40 30 50 15" fill="#FFD600" fillOpacity="0.3"/>
    <path d="M30 40 Q50 45 70 40 Q67 60 50 75 Q33 60 30 40" fill="#FFFFFF" fillOpacity="0.2"/>
    <path d="M50 20 L52 25 L48 25 Z" fill="#4CAF50"/>
  </svg>
);

export default OrangeLogo;