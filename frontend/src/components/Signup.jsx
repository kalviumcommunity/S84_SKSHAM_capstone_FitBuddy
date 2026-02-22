import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/register', { name, email, password })
      .then((result) => {
        navigate('/login');
      })
      .catch(() => {});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block font-medium mb-1 text-gray-300" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block font-medium mb-1 text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-1 text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition duration-200 text-white font-semibold py-2 rounded"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="block mt-2 w-full border border-green-600 text-center py-2 rounded text-green-400 hover:bg-green-800 hover:text-white transition duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
