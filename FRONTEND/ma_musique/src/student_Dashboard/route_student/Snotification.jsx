import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Snotification = () => {

  const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI || 'http://localhost:3000';

  const [notifications, setNotifications] = useState([]);
  const studentData = JSON.parse(localStorage.getItem('student'));
  const studentId = studentData?._id;

  useEffect(() => {
    if (studentId) {
      axios.get(`${databaseUri}/notification/user/${studentId}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err));
    }
  }, [studentId]);

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
