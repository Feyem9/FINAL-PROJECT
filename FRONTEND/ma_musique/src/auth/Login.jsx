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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-orange-400 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <h2 className="text-3xl font-dancing-script text-green-700 mb-4 text-center">Museschool Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-red-600 text-center font-semibold">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{' '}
          <NavLink to="/register" className="text-green-700 font-semibold hover:underline">
            Register
          </NavLink>
        </p>

        <div className="mt-6 text-center">
          {!isAuthenticated ? (
            <button
              onClick={() => loginWithRedirect()}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
            >
              <img src="/google.png" alt="Google logo" className="w-6 h-6" />
              <span className="text-gray-700 font-medium">Log in with Google</span>
            </button>
          ) : (
            <p className="text-green-700 font-semibold">You are logged in with Google</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
