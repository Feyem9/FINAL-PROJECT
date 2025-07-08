import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Tprofile = () => {

  const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [loading, setLoading] = useState(true);

  // ⚠️ Remplace par l'URL correcte de ton backend
  const teacherData = JSON.parse(localStorage.getItem('teacher'));

  const id = teacherData?._id;


  // console.log(`User ID received teacher: ${id}`);
  const API_URL = `${databaseUri}/teachers/${id}`;

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem('token'); // récupère le token stocké
        console.log(`Token received: ${token}`);

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Profil récupéré:', response.data);

        // setStudent(response.data.student); // adapte selon ta structure
      } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Chargement...</div>;
  const teacher = JSON.parse(localStorage.getItem('teacher'));

  if (!teacher) {
    return <div className="p-6 text-red-500">Impossible de charger le profil</div>;
  } console.log('teacher data:', teacher);

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Mon Profil</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 font-semibold">Nom complet:</p>
          <p className="text-gray-800">{teacher.name}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Email:</p>
          <p className="text-gray-800">{teacher.email}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Téléphone:</p>
          <p className="text-gray-800">{teacher.contact || 'Non renseigné'}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Rôle:</p>
          <p className="text-gray-800 capitalize">{teacher.role || 'teacher'}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Date d'inscription:</p>
          <p className="text-gray-800">{new Date(teacher.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
