import React, { useState, useEffect } from 'react';
import { Chats } from '../../dashboards/chats/Chats'; // Assure-toi que le chemin est correct
import axios from 'axios';
import { toast } from 'react-toastify';

export const Schat = () => {

      // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
          const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;



  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [senderId, setSenderId] = useState('');


  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('student'));
    const Sid = id._id;
    // console.log('Mon ID utilisateur STUDENT:', Sid);

    if (Sid) setSenderId(Sid);
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${databaseUri}/teachers/all`);
        console.log('Liste des enseignants:', res.data);

        setTeachers(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des enseignants', err);
      }
    };
    fetchTeachers();
  }, []);

  const handleSelectTeacher = (e) => {
    setSelectedTeacherId(e.target.value);
  };

  return (
    <div>
      <h1>Tableau de bord Étudiant</h1>
      <label>Choisir un professeur pour discuter :</label>
      <select onChange={handleSelectTeacher} value={selectedTeacherId}>
        <option value="">-- Choisir --</option>
        {teachers.map((t) => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>

      {selectedTeacherId && (
        <Chats
          role="student"
          senderId={senderId}
          receiverId={selectedTeacherId}
        />
      )}
    </div>
  );
};