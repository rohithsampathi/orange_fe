// src/components/DashboardIcon.js

import React from 'react';
import { motion } from 'framer-motion';

const DashboardIcon = ({ Icon, label, onClick }) => (
  <motion.div
    className="relative flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-500 opacity-10 rounded-lg"></div>
    <Icon size={48} className="text-teal-400 mb-4" />
    <span className="text-lg text-teal-200 font-semibold">{label}</span>
  </motion.div>
);

export default DashboardIcon;
