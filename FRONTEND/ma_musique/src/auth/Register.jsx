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
  const [role, setRole] = useState(''); // Par défaut, l'utilisateur est un étudiant

  // Champs spécifiques selon le rôle choisi
  const [studyLevel, setStudyLevel] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [experience, setExperience] = useState('');
  const [instrument, setInstrument] = useState('');
  // const [certificate, setCertificate] = useState<File | null>(null);
  const [certificate, setCertificate] = useState(null);

  // const [adminCode, setAdminCode] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!certificate) {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("certificate", certificate);
    formData.append("experience", experience);
    formData.append("certificate", certificate);

    try {

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    const userData = { name, email, contact, password, role };

    // Ajout des champs spécifiques au rôle
    if (role === 'student') {
      userData.studyLevel = studyLevel;
      userData.instrument = instrument;
    } else if (role === 'teacher') {
      userData.speciality = speciality;
      userData.experience = experience;
      userData.certificate = certificate;
    } 
    // else if (role === 'admin') {
    //   userData.adminCode = adminCode;
    // }
     // Déterminer l'URL en fonction du rôle
     let apiUrl = 'http://localhost:3000/auth/register';
     if (role === 'student') {
       apiUrl = 'http://localhost:3000/students/create';
     } else if (role === 'teacher') {
       apiUrl = 'http://localhost:3000/teachers/register';
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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  
  //   // Données de base pour tous les rôles
  //   const userData = { name, email, contact, password, role };
  
  //   // Ajout des champs spécifiques au rôle
  //   if (role === 'student') {
  //     userData.studyLevel = studyLevel;
  //     userData.instrument = instrument;
  //   } else if (role === 'teacher') {
  //     userData.speciality = speciality;
  //     userData.experience = experience;
  
  //     if (!certificate) {
  //       alert("Please upload a PDF file.");
  //       return;
  //     }
  
  //     // Upload du certificat
  //     const formData = new FormData();
  //     formData.append("certificate", certificate);
  //     formData.append("experience", experience); // Facultatif selon ton backend
  
  //     try {
  //       const uploadResponse = await axios.post("http://localhost:3000/teachers/upload", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  
  //       console.log("Upload response:", uploadResponse.data);
  //       alert("Certificate uploaded successfully!");
  //     } catch (uploadError) {
  //       console.error("Upload error:", uploadError);
  //       alert("Failed to upload certificate.");
  //       return;
  //     }
  //   }
  
  //   // Déterminer l'URL d'enregistrement selon le rôle
  //   let apiUrl = 'http://localhost:3000/auth/register';
  //   if (role === 'student') {
  //     apiUrl = 'http://localhost:3000/students/create';
  //   } else if (role === 'teacher') {
  //     apiUrl = 'http://localhost:3000/teachers/register';
  //   }
  
  //   try {
  //     const response = await axios.post(apiUrl, userData);
  
  //     console.log('Registration successful:', response.data);
  
  //     if (response.data) {
  //       navigate('/home');
  //     }
  
  //     const user = response.data;
  
  //     if (user && user._id) {
  //       localStorage.setItem('userId', user._id);
  //       localStorage.setItem('userEmail', user.email);
  //       localStorage.setItem('userRole', user.role);
  //       console.log('User data saved.');
  //     } else {
  //       throw new Error("User data is invalid");
  //     }
  //   } catch (err) {
  //     setError('Registration failed. Please try again.');
  //     console.error(err);
  //   }
  // };
  

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
            <option value="" disabled>Register As A </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
</select>

            {/* Champs dynamiques selon le rôle sélectionné */}
            {role === 'student' && (
              
              <>
                
                <select
                  className="input"
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Study Level</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select><select
                  className="input"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  required
                >
                  <option value="" disabled>What instrument did you want to learn ?</option>
                  <option value="piano">Piano</option>
                  <option value="flute">Flute</option>
                  <option value="violon">Violon</option>
                  <option value="drum kit">Drum kit</option>
                </select></>
            )}

            {role === 'teacher' && (
              <>
                <select
  className="input"
  value={speciality}
  onChange={(e) => setSpeciality(e.target.value)}
  required
>
  <option value="" disabled>What speciality did you want to teach ?</option>
  <option value="piano">Piano</option>
  <option value="flute">Flute</option>
  <option value="violon">Violon</option>
  <option value="drum kit">Drum kit</option>
</select>
                <input
                  type="number"
                  className="input"
                  placeholder="Years of Experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />

<input
      type="file"
      className="input"
      accept=".pdf"
      onChange={(e) => handleFileUpload(e)} // Sauvegarde le fichier PDF dans le state
      required
    />
     {certificate && (
      <p>Selected file: {certificate.name}</p>
    )}
              </>
            )}


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
