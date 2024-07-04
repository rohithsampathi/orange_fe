import React, { useState } from 'react';
import OrangeLogo from './OrangeLogo';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      });
      if (response.ok) {
        const data = await response.json();
        onLogin(username, data.access_token);
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <OrangeLogo size="large" />
          <h2 className="text-3xl font-bold text-white mt-4">Orange Zone</h2>
        </div>
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