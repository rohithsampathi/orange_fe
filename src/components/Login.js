// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import OrangeLogo from './OrangeLogo';
import { API_BASE_URL } from '../App';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Constructing the correct API URL
      const url = `${API_BASE_URL.replace('/api', '')}/token`;

      // Encoding the payload explicitly
      const payload = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

      console.log('Request URL:', url);
      console.log('Request Payload:', payload);

      // Sending the POST request
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Response:', response.data);

      if (response.data && response.data.access_token) {
        onLogin(username, response.data.access_token);
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);

      if (error.response) {
        if (error.response.status === 400) {
          setError('Invalid username or password. Please try again.');
        } else if (error.response.status === 401) {
          setError('Unauthorized. Please check your credentials.');
        } else {
          setError(`Server error: ${error.response.status}. Please try again later.`);
        }
      } else if (error.request) {
        setError('No response from server. Please check your internet connection and try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <OrangeLogo />
          <h2 className="text-3xl font-bold text-teal-200 mt-4">Orange Zone</h2>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 bg-transparent border-b-2 border-teal-500 text-teal-200 focus:outline-none focus:border-teal-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-transparent border-b-2 border-teal-500 text-teal-200 focus:outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            className="w-full bg-teal-500 text-white p-3 rounded-md hover:bg-teal-400 transition-colors font-bold"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
