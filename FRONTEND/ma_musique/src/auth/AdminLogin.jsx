import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../auth/adminLogin.css'; // Assurez-vous d'importer le fichier CSS pour le style

const AdminLogin = () => {

  const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Tentative de connexion avec :", email, password);
  
      const response = await axios.post(`${databaseUri}/admins/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse brute du backend :", response.data);

  
      const { token, admin } = response.data;
      if (admin.role === 'admin') {
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));

        navigate('/admin/profile');
      } else {
        setError("Vous n'êtes pas autorisé en tant qu'administrateur.");
      }
    } catch (err) {
      console.log("Erreur reçue :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login échoué. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="admin-login-wrapper">
    <div className="login-image-side">
      <img src="/ChatGPT Image 7 avr. 2025, 12_44_05.png" alt="Login Illustration" />
    </div>
    <div className="admin-login-form">
      <h1>Welcome<br /><strong>To Museschool Admin</strong></h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-btn">Login</button>

        <div className="separator">Or</div>

        <button className="google-login-btn">
          <img src="/google.png" alt="google" />
          Login with Google
        </button>
      </form>

      <p className="footer-text">Don't have an account? <a href="#">Create here</a></p>
    </div>
  </div>
  );
};

export default AdminLogin;
