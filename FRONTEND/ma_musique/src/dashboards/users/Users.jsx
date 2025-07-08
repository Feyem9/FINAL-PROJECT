import React, { useState } from 'react';
import axios from 'axios';
import './users.css';

export const Users = () => {

      const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const [level, setLevel] = useState('');
  const [instrument, setInstrument] = useState('');

  const [speciality, setSpeciality] = useState('');
  const [experience, setExperience] = useState('');
  const [file, setFile] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCertificateUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userData = { name, email, contact, password, role  };
    console.log('userdata' , userData);
    
    let apiUrl = '';
    console.log('apiurl' , apiUrl);
    

    try {
      if (role === 'student') {
        userData.level = level;
        console.log("Level détecté :",level); // ← DEBUG
        userData.instrument = instrument;
        console.log("instrument détecté :",instrument); // ← DEBUG
        apiUrl = `${databaseUri}/students/register`;

        const response = await axios.post(apiUrl, userData);
        console.log(response);
        
        setSuccess('Étudiant créé avec succès.' , response);
      } else if (role === 'teacher') {
        if (!file) {
          return setError('Veuillez télécharger un certificat (PDF).');
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('contact', contact);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('speciality', speciality);
        formData.append('experience', experience);
        formData.append('file', file);
        console.log("file détecté :",file); // ← DEBUG

        apiUrl = `${databaseUri}/teachers/register`;
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Réponse serveur :', response.data);
        setSuccess('Enseignant créé avec succès.');
      } else {
        setError('Veuillez choisir un rôle.');
      }
    } catch (err) {
      setError('Erreur lors de la création de l’utilisateur.');
      console.error('Erreur serveur :', err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-user-form">
      <h2>Créer un utilisateur</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Téléphone"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">-- Sélectionner un rôle --</option>
          <option value="student">Étudiant</option>
          <option value="teacher">Enseignant</option>
        </select>

        {role === 'student' && (
          <>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="">Niveau d’étude</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>

            <select
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              required
            >
              <option value="">Instrument</option>
              <option value="piano">Piano</option>
              <option value="flute">Flûte</option>
              <option value="violon">Violon</option>
              <option value="drum kit">Batterie</option>
            </select>
          </>
        )}

        {role === 'teacher' && (
          <>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
            >
              <option value="">Spécialité</option>
              <option value="piano">Piano</option>
              <option value="flute">Flûte</option>
              <option value="violon">Violon</option>
              <option value="drum kit">Batterie</option>
            </select>

            <input
              type="number"
              placeholder="Années d'expérience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />

            <input
              type="file"
              accept=".pdf"
              onChange={handleCertificateUpload}
              required
            />
            {file && <p>Fichier sélectionné : {file.name}</p>}
          </>
        )}

        <button type="submit">Créer l’utilisateur</button>
      </form>
    </div>
  );
};