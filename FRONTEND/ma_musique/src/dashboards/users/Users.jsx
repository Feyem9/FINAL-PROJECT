import React, { useState } from 'react';
import axios from 'axios';
import './users.css';

export const Users = () => {

      // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
          // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
          const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI || import.meta.env.VITE_TESTING_BACKEND_URI;




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

// import React, { useState } from 'react';
// import axios from 'axios';

// // La logique des API est préservée ici
// const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

// export const Users = () => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         userType: 'student', // Valeur par défaut
//         phone: '',
//         password: '',
//         confirmPassword: '',
//         permissions: {
//             canViewCourses: false,
//             canCreateContent: false,
//             canManageUsers: false,
//         },
//     });

//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handlePermissionChange = (e) => {
//         const { name, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             permissions: {
//                 ...prev.permissions,
//                 [name]: checked,
//             },
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(false);

//         // Validation simple
//         if (formData.password !== formData.confirmPassword) {
//             setError("Les mots de passe ne correspondent pas.");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // Ton appel d'API pour la création d'utilisateur
//             const res = await axios.post(`${databaseUri}/api/users/register`, formData);
            
//             if (res.status === 201) {
//                 setSuccess(true);
//                 // Réinitialiser le formulaire après succès
//                 setFormData({
//                     fullName: '',
//                     email: '',
//                     userType: 'student',
//                     phone: '',
//                     password: '',
//                     confirmPassword: '',
//                     permissions: {
//                         canViewCourses: false,
//                         canCreateContent: false,
//                         canManageUsers: false,
//                     },
//                 });
//             }
//         } catch (err) {
//             console.error(err);
//             setError("Échec de la création de l'utilisateur. Veuillez réessayer.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         // Logique pour annuler ou retourner à la page précédente
//         console.log("Annulation du formulaire.");
//         // Tu peux par exemple réinitialiser le formulaire ou utiliser un router pour naviguer
//         setFormData({
//             fullName: '',
//             email: '',
//             userType: 'student',
//             phone: '',
//             password: '',
//             confirmPassword: '',
//             permissions: {
//                 canViewCourses: false,
//                 canCreateContent: false,
//                 canManageUsers: false,
//             },
//         });
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen p-8">
//             <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h1>
                
//                 {success && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//                         <span className="block sm:inline">Utilisateur créé avec succès !</span>
//                     </div>
//                 )}

//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//                         <span className="block sm:inline">{error}</span>
//                     </div>
//                 )}
                
//                 <form onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="flex flex-col space-y-6">
//                             <h2 className="text-lg font-semibold text-gray-700">User Information</h2>
                            
//                             {/* Full Name */}
//                             <div>
//                                 <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name *</label>
//                                 <input
//                                     type="text"
//                                     id="fullName"
//                                     name="fullName"
//                                     value={formData.fullName}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                                     required
//                                 />
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                                     required
//                                 />
//                             </div>

//                             {/* User Type */}
//                             <div>
//                                 <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type *</label>
//                                 <select
//                                     id="userType"
//                                     name="userType"
//                                     value={formData.userType}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                                     required
//                                 >
//                                     <option value="" disabled>Select user type</option>
//                                     <option value="student">Student</option>
//                                     <option value="teacher">Teacher</option>
//                                     <option value="admin">Admin</option>
//                                 </select>
//                             </div>

//                             {/* Phone */}
//                             <div>
//                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
//                                 <input
//                                     type="tel"
//                                     id="phone"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                                 />
//                             </div>
//                         </div>

//                         {/* Section "Additional Settings" */}
//                         <div className="flex flex-col space-y-6">
//                             <h2 className="text-lg font-semibold text-gray-700">Additional Settings</h2>

//                             {/* Password */}
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
//                                 <input
//                                     type="password"
//                                     id="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                                     required
//                                 />
//                             </div>

//                             {/* Confirm Password */}
//                             <div>
//                                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password *</label>
//                                 <input
//                                     type="password"
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
//                                     required
//                                 />
//                             </div>
                            
//                             {/* Permissions */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
//                                 <div className="space-y-2">
//                                     <div className="flex items-center">
//                                         <input
//                                             id="canViewCourses"
//                                             name="canViewCourses"
//                                             type="checkbox"
//                                             checked={formData.permissions.canViewCourses}
//                                             onChange={handlePermissionChange}
//                                             className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                                         />
//                                         <label htmlFor="canViewCourses" className="ml-2 block text-sm text-gray-700">
//                                             Can view courses
//                                         </label>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <input
//                                             id="canCreateContent"
//                                             name="canCreateContent"
//                                             type="checkbox"
//                                             checked={formData.permissions.canCreateContent}
//                                             onChange={handlePermissionChange}
//                                             className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                                         />
//                                         <label htmlFor="canCreateContent" className="ml-2 block text-sm text-gray-700">
//                                             Can create content
//                                         </label>
//                                     </div>
//                                     <div className="flex items-center">
//                                         <input
//                                             id="canManageUsers"
//                                             name="canManageUsers"
//                                             type="checkbox"
//                                             checked={formData.permissions.canManageUsers}
//                                             onChange={handlePermissionChange}
//                                             className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                                         />
//                                         <label htmlFor="canManageUsers" className="ml-2 block text-sm text-gray-700">
//                                             Can manage users
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="bg-[#3b9e4a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#348c41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? 'Creating...' : 'Create User'}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={handleCancel}
//                             disabled={isLoading}
//                             className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };