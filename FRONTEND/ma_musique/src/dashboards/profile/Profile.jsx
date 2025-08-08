// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import './profiles.css'; // si tu veux ajouter du style

// export const Profile = () => {

//   const { user, logout, isAuthenticated } = useAuth0();

//   const admin = JSON.parse(localStorage.getItem('admin'));
//   console.log( 'resultat' , admin);
//   if (!admin) return <p>Admin non connecté.</p>;
//   console.log('Admin dans le profil:', admin);





//   return (
  
//         <div className="admin-card">
//   <div className="admin-header">
//     <img
//       src="/public/mon_prof.jpg" // Remplace par le chemin de l'image de l'administrateur
//       alt=""
//       className="admin-photo"
//     />
//     <h2>Profil de l'Administrateur</h2>
//   </div>

//   <p><strong>Nom :</strong> {admin.name}</p>
//   <p><strong>Email :</strong> {admin.email}</p>
//   <p><strong>Contact :</strong> {admin.contact}</p>
//   <p><strong>Rôle :</strong> {admin.role}</p>
//   <p><strong>Super Admin :</strong> {admin.isSuperAdmin ? 'Oui' : 'Non'}</p>
//   <p><strong>Créé le :</strong> {new Date(admin.createdAt).toLocaleString()}</p>
// </div>
//     //   </div>
//     // </div>
//   );
// };
import React, { useState } from 'react';

export const Profile = () => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  console.log('resultat', admin);
  if (!admin) return <p>Admin non connecté.</p>;
  console.log('Admin dans le profil:', admin);

  const [formData, setFormData] = useState({
    name: admin.name || '',
    email: admin.email || '',
    contact: admin.contact || '',
    location: 'Yaoundé, Cameroon'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', formData);
    // Ici tu peux ajouter la logique pour sauvegarder
  };

  const handleCancel = () => {
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      contact: admin.contact || '',
      location: 'Yaoundé, Cameroon'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Header avec avatar */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              A
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{admin.name}</h2>
              <p className="text-gray-600">{admin.email}</p>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                {admin.isSuperAdmin ? 'Super Admin' : admin.role}
              </span>
            </div>
          </div>

          {/* Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 px-6 py-2 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

