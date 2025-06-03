import '../auth/authstyles.css';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import '../dashboards/profile/profile.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { user, loginWithRedirect, logout, isAuthenticated } = useAuth0();


  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
const role = localStorage.getItem('userRole');
console.log(`Attempting to log in with role: ${role}`);

    if (!role) throw new Error("User role not specified");

    const loginUrl = `http://localhost:3000/${role}s/login`;
    console.log(`Logging in as ${role} at ${loginUrl}`);
    

    // Login request
    const response = await axios.post(loginUrl, {
      email,
      password,
    });

    const token = response.data.token;
    if (!token) throw new Error("Token not found");

    localStorage.setItem('token', token);
    console.log(`Token received: ${token}`);
    
    localStorage.setItem('userRole', role);
    console.log(`User role set to: ${role}`);

    // Ensuite, on appelle l'endpoint pour récupérer l'utilisateur

    const id = localStorage.getItem('userId');
    console.log(`User ID received: ${id}`);
    
    const profileUrl = `http://localhost:3000/${role}s/${id}`;
    console.log(`Fetching profile from ${profileUrl}`);

    const me = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = me.data;
    console.log(`User data received:`, user);
    
    if (!user || !user._id) throw new Error("User data is invalid");

    localStorage.setItem(role, JSON.stringify(user));

    // Redirection selon le rôle
    navigate(`/${role}/dashboard`);

  } catch (err) {
    console.error(err);
    setError("Login failed. Check credentials or role.");
  }
};


  return (
    <div className="login">
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Login Form</span>
          <span className="subtitle">Please fill the Form.</span>
          <div className="form-container">
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">* {error} *</p>}
          <button type="submit">login</button>
        </form>
        <div className="form-section">
          <p>Don't have an account? <NavLink to="/register">Register</NavLink></p>
        </div>
        <h1>
        <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()} className='google-signin-btn'> <img src="/google.png" alt="google" className='img' />log in with google</button>
      ) : (
        <>
          
        </>
      )}
    </div>
        </h1>
      </div>
    </div>
  );
};

export default Login;