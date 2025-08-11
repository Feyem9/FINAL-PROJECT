import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {

  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI || 'http://localhost:3000';
  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  // Par sécurité :
  // const databaseUri = import.meta.env.REACT_APP_BACKEND_ONLINE_URI || process.env.REACT_APP_BACKEND_ONLINE_URI  || 'http://localhost:3000';

  // console.log("✅ URI :", databaseUri);

  // console.log("Database URI:", databaseUri);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const role = localStorage.getItem('userRole');

      if (!role) throw new Error("User role not specified");

      const loginUrl = `${databaseUri}/${role}s/login`;

      const response = await axios.post(loginUrl, { email, password });
      const token = response.data.token;
      if (!token) throw new Error("Token not found");

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);

      const userData = response.data[role];

      const id = userData._id;


      if (!id) throw new Error("User ID not found");

      const profileUrl = `${databaseUri}/${role}s/${id}`;
      const me = await axios.get(profileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = me.data;
      if (!user || !user._id) throw new Error("User data is invalid");

      localStorage.setItem(role, JSON.stringify(user));

      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials and role.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-orange-400 px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-orange-400 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Museschool account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-green-600 hover:text-green-500">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-center text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithRedirect()}
                className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <img src="/google.png" alt="Google logo" className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
            ) : (
              <p className="text-green-600 font-medium text-center">You are logged in with Google</p>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <NavLink to="/register" className="text-green-600 font-medium hover:text-green-500 transition">
            Register now
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
