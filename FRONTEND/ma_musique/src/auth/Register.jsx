// import React, { useState } from 'react';
// import '../auth/authstyles.css';
// import { useNavigate } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
// import axios from 'axios';

// const Request = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [contact, setContact] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState(''); // Par défaut, l'utilisateur est un étudiant

//   // Champs spécifiques selon le rôle choisi
//   const [studyLevel, setStudyLevel] = useState('');
//   const [speciality, setSpeciality] = useState('');
//   const [experience, setExperience] = useState('');
//   const [instrument, setInstrument] = useState('');
//   // const [certificate, setCertificate] = useState<File | null>(null);
//   const [certificate, setCertificate] = useState(null);

//   // const [adminCode, setAdminCode] = useState('');

//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleFileUpload = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setCertificate(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // if (!certificate) {
//     //   alert("Please upload a PDF file.");
//     //   return;
//     // }
//     if (role === "teacher" && !certificate) {
//       setError("Le certificat est requis pour les enseignants.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("certificate", certificate);
//     formData.append("experience", experience);
//     formData.append("certificate", certificate);

//     // try {

//     //   if (response.ok) {
//     //     alert("File uploaded successfully!");
//     //   } else {
//     //     alert("Failed to upload file.");
//     //   }
//     // } catch (error) {
//     //   console.error("Error uploading file:", error);
//     // }
//     const userData = { name, email, contact, password, role };

//     // Ajout des champs spécifiques au rôle
//     if (role === 'student') {
//       userData.level = studyLevel;
//       userData.instrument = instrument;
//     } else if (role === 'teacher') {
//       userData.speciality = speciality;
//       userData.experience = experience;
//       userData.certificate = certificate;
//     }
 
//     // Déterminer l'URL en fonction du rôle
//     let apiUrl = 'http://localhost:3000/auth/register';
//     if (role === 'student') {
//       apiUrl = 'http://localhost:3000/students/register';
//     } else if (role === 'teacher') {
//       apiUrl = 'http://localhost:3000/teachers/register';
//     }


//     try {


//       const response = await axios.post(apiUrl, userData);

//       console.log('Registration successful:', response.data);

//       if (response.data) {
//         navigate('/login');
//       }

//       let user = response.data;
//       console.log('user data:', user);


//       if (role === 'student') {
//         user = response.data.student;
//       } else if (role === 'teacher') {
//         user = response.data.teacher;
//         console.log('user data teacher:', user);
        
//       }

//       if (user && user._id) {
//         localStorage.setItem('userId', user._id);
//         localStorage.setItem('userEmail', user.email);
//         localStorage.setItem('userRole', user.role);
//         console.log('User data saved:', user);
//       } else {
//         throw new Error("User data is invalid");
//       }
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//       console.error(err);
//     }


//   }
//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();

//   //   // Données de base pour tous les rôles
//   //   const userData = { name, email, contact, password, role };

//   //   // Ajout des champs spécifiques au rôle
//   //   if (role === 'student') {
//   //     userData.studyLevel = studyLevel;
//   //     userData.instrument = instrument;
//   //   } else if (role === 'teacher') {
//   //     userData.speciality = speciality;
//   //     userData.experience = experience;

//   //     if (!certificate) {
//   //       alert("Please upload a PDF file.");
//   //       return;
//   //     }

//   //     // Upload du certificat
//   //     const formData = new FormData();
//   //     formData.append("certificate", certificate);
//   //     formData.append("experience", experience); // Facultatif selon ton backend

//   //     try {
//   //       const uploadResponse = await axios.post("http://localhost:3000/teachers/upload", formData, {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //         },
//   //       });

//   //       console.log("Upload response:", uploadResponse.data);
//   //       alert("Certificate uploaded successfully!");
//   //     } catch (uploadError) {
//   //       console.error("Upload error:", uploadError);
//   //       alert("Failed to upload certificate.");
//   //       return;
//   //     }
//   //   }

//   //   // Déterminer l'URL d'enregistrement selon le rôle
//   //   let apiUrl = 'http://localhost:3000/auth/register';
//   //   if (role === 'student') {
//   //     apiUrl = 'http://localhost:3000/students/create';
//   //   } else if (role === 'teacher') {
//   //     apiUrl = 'http://localhost:3000/teachers/register';
//   //   }

//   //   try {
//   //     const response = await axios.post(apiUrl, userData);

//   //     console.log('Registration successful:', response.data);

//   //     if (response.data) {
//   //       navigate('/home');
//   //     }

//   //     const user = response.data;

//   //     if (user && user._id) {
//   //       localStorage.setItem('userId', user._id);
//   //       localStorage.setItem('userEmail', user.email);
//   //       localStorage.setItem('userRole', user.role);
//   //       console.log('User data saved.');
//   //     } else {
//   //       throw new Error("User data is invalid");
//   //     }
//   //   } catch (err) {
//   //     setError('Registration failed. Please try again.');
//   //     console.error(err);
//   //   }
//   // };


//   return (
//     <div className="register">
//       <div className="form-box">
//         <form className="form" onSubmit={handleSubmit}>
//           <span className="title">Register Form</span>
//           <span className="subtitle">Museschool Form</span>
//           <div className="form-container">
//             <input
//               type="text"
//               className="input"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <input
//               type="email"
//               className="input"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <input
//               type="password"
//               className="input"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               className="input"
//               placeholder="Tel Number"
//               value={contact}
//               onChange={(e) => setContact(e.target.value)}
//               required
//             />

//             {/* Sélecteur de rôle */}
//             <select className="input" value={role} onChange={(e) => setRole(e.target.value)} required>
//               <option value="" disabled>Register As A </option>
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//             </select>

//             {/* Champs dynamiques selon le rôle sélectionné */}
//             {role === 'student' && (

//               <>

//                 <select
//                   className="input"
//                   value={studyLevel}
//                   onChange={(e) => setStudyLevel(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>Select Study Level</option>
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select><select
//                   className="input"
//                   value={instrument}
//                   onChange={(e) => setInstrument(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>What instrument did you want to learn ?</option>
//                   <option value="piano">Piano</option>
//                   <option value="flute">Flute</option>
//                   <option value="violon">Violon</option>
//                   <option value="drum kit">Drum kit</option>
//                 </select></>
//             )}

//             {role === 'teacher' && (
//               <>
//                 <select
//                   className="input"
//                   value={speciality}
//                   onChange={(e) => setSpeciality(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>What speciality did you want to teach ?</option>
//                   <option value="piano">Piano</option>
//                   <option value="flute">Flute</option>
//                   <option value="violon">Violon</option>
//                   <option value="drum kit">Drum kit</option>
//                 </select>
//                 <input
//                   type="number"
//                   className="input"
//                   placeholder="Years of Experience"
//                   value={experience}
//                   onChange={(e) => setExperience(e.target.value)}
//                   required
//                 />

//                 <input
//                   type="file"
//                   className="input"
//                   accept=".pdf"
//                   onChange={(e) => handleFileUpload(e)} // Sauvegarde le fichier PDF dans le state
//                   required={role === 'teacher'} // ✅ Obligatoire seulement pour les enseignants
//                 />
//                 {certificate && (
//                   <p>Selected file: {certificate.name}</p>
//                 )}
//               </>
//             )}


//           </div>
//           {error && <p className="error">** {error} **</p>}
//           <button type="submit">Register</button>
//         </form>
//         <div className="form-section">
//           <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Request;

import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Request = () => {

    const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "",
    studyLevel: "",
    speciality: "",
    experience: "",
    instrument: "",
  });
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setError("");
    setSuccessMsg("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setError("");
    setSuccessMsg("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Merci de télécharger un fichier PDF valide.");
        setCertificate(null);
        return;
      }
      setCertificate(file);
    }
  };

  const validateForm = () => {
    const { name, email, contact, password, role } = formData;
    if (!name || !email || !contact || !password || !role) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    if (role === "student" && (!formData.studyLevel || !formData.instrument)) {
      setError("Veuillez sélectionner le niveau d'étude et l'instrument.");
      return false;
    }
    if (role === "teacher" && (!formData.speciality || !formData.experience)) {
      setError(
        "Veuillez renseigner votre spécialité et vos années d'expérience."
      );
      return false;
    }
    if (role === "teacher" && !certificate) {
      setError("Le certificat PDF est obligatoire pour les enseignants.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Simulation d'envoi backend
      await new Promise((r) => setTimeout(r, 1500)); // simulate delay

      setSuccessMsg(
        "Inscription réussie ! Redirection vers la page de connexion..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Échec de l'inscription, veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-400 to-yellow-400 flex items-center justify-center px-4 py-10 font-sans">
      <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center text-green-900">
        <h1 className="text-4xl font-dancing-script font-bold mb-2 tracking-wide">
          Museschool Register
        </h1>
        <p className="text-lg font-semibold mb-8 text-green-800">
          Rejoignez notre famille musicale !
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
            minLength={6}
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />
          <input
            type="tel"
            name="contact"
            placeholder="Téléphone"
            value={formData.contact}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={loading}
            required
            className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
          >
            <option value="" disabled>
              S'inscrire en tant que
            </option>
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
          </select>

          {formData.role === "student" && (
            <>
              <select
                name="studyLevel"
                value={formData.studyLevel}
                onChange={handleInputChange}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Choisissez votre niveau d'étude
                </option>
                <option value="easy">Débutant</option>
                <option value="medium">Intermédiaire</option>
                <option value="hard">Avancé</option>
              </select>

              <select
                name="instrument"
                value={formData.instrument}
                onChange={handleInputChange}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Instrument à apprendre
                </option>
                <option value="piano">Piano</option>
                <option value="flute">Flûte</option>
                <option value="violin">Violon</option>
                <option value="drum">Batterie</option>
              </select>
            </>
          )}

          {formData.role === "teacher" && (
            <>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Spécialité enseignée
                </option>
                <option value="piano">Piano</option>
                <option value="flute">Flûte</option>
                <option value="violin">Violon</option>
                <option value="drum">Batterie</option>
              </select>

              <input
                type="number"
                name="experience"
                placeholder="Années d'expérience"
                value={formData.experience}
                onChange={handleInputChange}
                disabled={loading}
                min={0}
                max={60}
                required
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-yellow-400 outline-none transition-colors text-green-900 placeholder-green-600"
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={loading}
                required
                className="w-full text-green-900 cursor-pointer mt-3"
              />
              {certificate && (
                <p className="text-sm text-green-900 mt-1">
                  Fichier choisi : {certificate.name}
                </p>
              )}
            </>
          )}

          {error && (
            <p className="text-red-600 font-semibold mt-3 text-center">{error}</p>
          )}
          {successMsg && (
            <p className="text-green-700 font-semibold mt-3 text-center">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-green-900 font-semibold text-center">
          <p>
            Vous avez déjà un compte ?{" "}
            <NavLink
              to="/login"
              className="text-yellow-400 hover:text-yellow-500 underline font-bold"
            >
              Connectez-vous
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Request;
