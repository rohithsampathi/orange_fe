import React from 'react';
import { motion } from 'framer-motion';

const DashboardIcon = ({ Icon, label, onClick }) => (
  <motion.div 
    className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg cursor-pointer"
    whileHover={{ scale: 1.05, backgroundColor: "#1F2937" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <Icon size={40} className="text-orange-500 mb-2" />
    <span className="text-sm text-white font-medium">{label}</span>
  </motion.div>
);

export default DashboardIcon;