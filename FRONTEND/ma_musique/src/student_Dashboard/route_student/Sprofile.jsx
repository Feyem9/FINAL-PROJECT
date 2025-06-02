import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Sprofile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Remplace par l'URL correcte de ton backend
  const API_URL = 'http://localhost:3000/api/students/profile';

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token'); // récupère le token stocké
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(response.data.student); // adapte selon ta structure
      } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Chargement...</div>;
  if (!student) return <div className="p-6 text-red-500">Impossible de charger le profil</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Mon Profil</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 font-semibold">Nom complet:</p>
          <p className="text-gray-800">{student.name}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Email:</p>
          <p className="text-gray-800">{student.email}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Téléphone:</p>
          <p className="text-gray-800">{student.phone || 'Non renseigné'}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Rôle:</p>
          <p className="text-gray-800 capitalize">{student.role || 'étudiant'}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Date d'inscription:</p>
          <p className="text-gray-800">{new Date(student.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
