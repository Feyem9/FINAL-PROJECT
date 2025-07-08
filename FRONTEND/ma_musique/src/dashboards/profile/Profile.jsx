import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './profiles.css'; // si tu veux ajouter du style

export const Profile = () => {

  const { user, logout, isAuthenticated } = useAuth0();

  const admin = JSON.parse(localStorage.getItem('admin'));
  console.log( 'resultat' , admin);
  if (!admin) return <p>Admin non connecté.</p>;
  console.log('Admin dans le profil:', admin);





  return (
  
        <div className="admin-card">
  <div className="admin-header">
    <img
      src="/public/mon_prof.jpg" // Remplace par le chemin de l'image de l'administrateur
      alt=""
      className="admin-photo"
    />
    <h2>Profil de l'Administrateur</h2>
  </div>

  <p><strong>Nom :</strong> {admin.name}</p>
  <p><strong>Email :</strong> {admin.email}</p>
  <p><strong>Contact :</strong> {admin.contact}</p>
  <p><strong>Rôle :</strong> {admin.role}</p>
  <p><strong>Super Admin :</strong> {admin.isSuperAdmin ? 'Oui' : 'Non'}</p>
  <p><strong>Créé le :</strong> {new Date(admin.createdAt).toLocaleString()}</p>
</div>
    //   </div>
    // </div>
  );
};


// import React, { useEffect, useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import './profiles.css'; // si tu veux ajouter du style

// export const Profile = () => {
//   const { user, logout, isAuthenticated } = useAuth0();
//   const [admin, setAdmin] = useState(null);

//   useEffect(() => {
//     const storedAdmin = localStorage.getItem('admin');
//     console.log('Admin depuis localStorage:', storedAdmin); // Affichage de ce que l'on récupère

//     if (storedAdmin) {
//       setAdmin(JSON.parse(storedAdmin));
//     }
//   }, []);

//   if (!isAuthenticated) return null; // profile reste vide si l'utilisateur n'est pas connecté

//   if (!admin) return <p>Chargement des informations de l'administrateur...</p>;
//   console.log('Admin dans le profil:', admin);


//   return (
//     <div className="profile-container">
//       <img src={user?.picture} alt="Profil" className="profile-img" />

//       <div className="profile-info">
//         <p className="profile-name">Bienvenue <strong>{user?.name}</strong></p>
//         <p className="profile-email">{user?.email}</p>

//         <div className="profile-details">
//           <p><strong>Nom complet :</strong> {user?.name}</p>
//           <p><strong>Identifiant unique :</strong> {user?.sub}</p>
//           <p><strong>Email vérifié :</strong> {user?.email_verified ? 'Oui' : 'Non'}</p>
//           <p><strong>Dernière connexion :</strong> {user?.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}</p>
//         </div>

//         <div>
//           <h2>Profil de l'Administrateur</h2>
//           <p><strong>Nom :</strong> {admin.name}</p>
//           <p><strong>Email :</strong> {admin.email}</p>
//           <p><strong>Contact :</strong> {admin.contact}</p>
//           <p><strong>Rôle :</strong> {admin.role}</p>
//           <p><strong>Super Admin :</strong> {admin.isSuperAdmin ? 'Oui' : 'Non'}</p>
//           <p><strong>Créé le :</strong> {new Date(admin.createdAt).toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };
