import React, { useState } from 'react';
import '../auth/authstyles.css';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Request = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Par défaut, l'utilisateur est un étudiant

  // Champs spécifiques selon le rôle choisi
  const [studyLevel, setStudyLevel] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  // const [adminCode, setAdminCode] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const userData = { name, email, contact, password, role };

    // Ajout des champs spécifiques au rôle
    if (role === 'student') {
      userData.studyLevel = studyLevel;
    } else if (role === 'teacher') {
      userData.specialty = specialty;
      userData.experience = experience;
    } 
    // else if (role === 'admin') {
    //   userData.adminCode = adminCode;
    // }
     // Déterminer l'URL en fonction du rôle
     let apiUrl = 'http://localhost:3000/auth/register';
     if (role === 'student') {
       apiUrl = 'http://localhost:3000/students/create';
     } else if (role === 'teacher') {
       apiUrl = 'http://localhost:3000/teachers/create';
     } 
    //  else if (role === 'admin') {
    //    apiUrl = 'http://localhost:3000/admins/create';
    //  }

    try {


      const response = await axios.post(apiUrl, userData);

      console.log('Registration successful:', response.data);

      if (response.data) {
        navigate('/home');
      }

      const user = response.data;

      if (user && user._id) {
        localStorage.setItem('userId', user._id);
        console.log('User ID saved:', user._id);

        localStorage.setItem('userEmail', user.email);
        console.log('User email saved:', user.email);

        localStorage.setItem('userRole', user.role);
        console.log('User role saved:', user.role);
      } else {
        throw new Error("User data is invalid");
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="register">
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Register Form</span>
          <span className="subtitle">Museschool Form</span>
          <div className="form-container">
            <input
              type="text"
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Tel Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            
            {/* Sélecteur de rôle */}
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            {/* <option value="admin">Admin</option> */}            
</select>

            {/* Champs dynamiques selon le rôle sélectionné */}
            {role === 'student' && (
              <input
                type="text"
                className="input"
                placeholder="Study Level"
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                required
              />
            )}

            {role === 'teacher' && (
              <>
                <input
                  type="text"
                  className="input"
                  placeholder="Specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Years of Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </>
            )}

            {/* {role === 'admin' && (
              <input
                type="password"
                className="input"
                placeholder="Admin Access Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
            )} */}
          </div>
          {error && <p className="error">** {error} **</p>}
          <button type="submit">Register</button>
        </form>
        <div className="form-section">
          <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
        </div>
      </div>
    </div>
  );
};

export default Request;
