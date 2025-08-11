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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Account Status</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">Active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Member Since</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">2023</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Role</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {admin.isSuperAdmin ? 'Super Admin' : admin.role}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {admin.name?.charAt(0) || 'A'}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{admin.name}</h2>
                <p className="text-gray-600">{admin.email}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  {admin.isSuperAdmin ? 'Super Admin' : admin.role}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{admin.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{admin.contact || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium">Douala, Cameroon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    id="contact"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Last updated: Today
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800">Change Password</h3>
                    <p className="text-gray-600 text-sm">Update your password regularly for better security</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm">
                    Change
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                    <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm">
                    Enable
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-800">Active Sessions</h3>
                    <p className="text-gray-600 text-sm">Manage devices that are currently logged in</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

