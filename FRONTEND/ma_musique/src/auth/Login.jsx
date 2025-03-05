import '../auth/authstyles.css';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const user = response.data.user;
      console.log('login user is : ',user);

      const token = response.data.token;
      console.log('this is a simple token :' , token);

      if (user && user._id) {
        localStorage.setItem('token', token);
        console.log('login token is : ',token);

        localStorage.setItem('userId', user._id);
        console.log(user.id);
        localStorage.setItem('userEmail', user.email);
        console.log(user.email);
        }
      else{throw new Error("User data is invalid");
      }
      

      // Navigate based on user role
      if (response.data) {
        navigate('/home');
      }else {
        setError('page not found'); // Handle unknown roles
      }

      // Optionally, you might want to store the token in local storage or context
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
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
      </div>
    </div>
  );
};

export default Login;