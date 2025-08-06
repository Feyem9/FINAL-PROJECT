import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';

export const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();

  let user = null;

  try {
    const teacher = JSON.parse(localStorage.getItem('teacher'));
    const student = JSON.parse(localStorage.getItem('student'));
    const admin = JSON.parse(localStorage.getItem('admin'));
    user = teacher || student || admin || null;
  } catch (error) {
    // localStorage contient des données malformées, on peut gérer ça ici (ex: forcer la déconnexion)
    user = null;
    console.log('user', user);
    
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role?.toLowerCase();
  console.log('user role', userRole);
  
  const allowed = allowedRoles.map(r => r.toLowerCase());
  console.log('allowed role', allowed);
  

  if (!allowed.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-center">
        <h1 className="text-6xl font-extrabold text-red-700 mb-4">⛔ 404 </h1>
        <p className="text-xl text-red-600 font-bold mb-2">
          Vous n’êtes pas autorisé à accéder à cette page.
        </p>
        <p className="mb-4 text-gray-700">
          Veuillez contacter l'administrateur si vous pensez que c'est une erreur.
        </p>
        {/* Utilisation de Link pour éviter le rechargement de la page */}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Connectez-vous pour continuer
        </Link>
      </div>
    );
  }

  return <Outlet />;
};
