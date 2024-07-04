import React, { useState } from 'react';
import axios from 'axios';
import OrangeLogo from './OrangeLogo';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://6162-122-174-149-162.ngrok-free.app/token', // Update this line
        `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log('Login response:', response.data);

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
          <OrangeLogo size="large" />
          <h2 className="text-3xl font-bold text-white mt-4">Orange Zone</h2>
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
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded font-bold hover:bg-orange-600 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
