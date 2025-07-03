import React, { useState, useEffect } from 'react';
import { Chats } from '../../dashboards/chats/Chats';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Tchat = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [senderId, setSenderId] = useState('');


  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('teacher')); // ou une autre source
    const teacherId = id._id;
    // console.log('Mon ID utilisateur teacher:', teacherId);
    if (teacherId) setSenderId(teacherId);
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/students/all');
        console.log('etudiant recupere : ', res.data);

        setStudents(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des étudiants', err);
      }
    };
    fetchStudents();
  }, []);

  const handleSelectStudent = (e) => {
    setSelectedStudentId(e.target.value);
  };

  return (
    <div>
      <h1>Tableau de bord Professeur</h1>
      <label>Choisir un élève pour discuter :</label>
      <select onChange={handleSelectStudent} value={selectedStudentId}>
        <option value="">-- Choisir --</option>
        {students.map((s, index) => (
          <option key={s._id || index} value={s._id}>{s.name}</option>
        ))}
      </select>

      {selectedStudentId && (
        <Chats
          role="teacher"
          senderId={senderId} // récupère l'id réel
          receiverId={selectedStudentId}
        />
      )}
    </div>
  );
};