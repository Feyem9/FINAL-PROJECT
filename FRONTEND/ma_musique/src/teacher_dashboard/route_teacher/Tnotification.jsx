import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Tnotification = () => {

  const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [notifications, setNotifications] = useState([]);
  const teacherData = JSON.parse(localStorage.getItem('teacher'));
  const teacherId = teacherData?._id;

  useEffect(() => {
    if (teacherId) {
      axios.get(`${databaseUri}/notification/user/${teacherId}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err));
    }
  }, [teacherId]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mes notifications</h2>
      {notifications.length === 0 && <p>Aucune notification.</p>}
      <ul className="space-y-4">
        {notifications.map(n => (
          <li key={n._id} className={`p-4 rounded shadow ${n.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
            <div>
              <h3 className="font-semibold">{n.title}</h3>
              <p>{n.message}</p>
              <small className="text-gray-500">{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
