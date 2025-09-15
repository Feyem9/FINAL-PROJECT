import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../auth/adminLogin.css'; // Assurez-vous d'importer le fichier CSS pour le style

const AdminRegister = () => {

  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI || import.meta.env.VITE_TESTING_BACKEND_URI;



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Tentative de connexion avec :", name, email, password, contact, role);

      const response = await axios.post(`${databaseUri}/admins/register`, {
        name,
        email,
        password,
        contact,
        role: 'admin'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse brute du backend :", response.data);

    } catch (err) {
      console.log("Erreur reçue :", err.response?.data || err.message);
      setError(err.response?.data?.message || "register échoué. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-image-side">
        <img src="/ChatGPT Image 7 avr. 2025, 12_44_05.png" alt="Register Illustration" />
      </div>
      <div className="admin-login-form">
        <h1>Welcome<br /><strong>To Museschool Admin</strong></h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="input-group">
            <label>contact</label>
            <input
              type="text"
              placeholder="Enter your contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Register</button>

          <div className="separator">Or</div>

          <button className="google-login-btn">
            <img src="/google.png" alt="google" />
            continue with Google
          </button>
        </form>

        <p className="footer-text">Already have an account? <a href="/login">login</a></p>
      </div>
    </div>
  );
};

export default AdminRegister;
