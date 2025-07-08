import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Notification = () => {

      const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [allNotifications, setAllNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const adminData = localStorage.getItem('admin');
  const id = adminData ? JSON.parse(adminData)._id : null;

  useEffect(() => {
    axios.get(`${databaseUri}/notification/all`)
      .then(res => setAllNotifications(res.data))
      .catch(err => console.error(err));

    if (id) {
      axios.get(`${databaseUri}/notification/user/${id}`)
        .then(res => setAdminNotifications(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  // Fonction pour marquer une notification comme lue ou non lue
  const toggleRead = (notifId, currentRead) => {
    axios.patch(`${databaseUri}/notification/${notifId}/read`, { read: !currentRead })
      .then(() => {
        setAdminNotifications(notifs =>
          notifs.map(n =>
            n._id === notifId ? { ...n, read: !currentRead } : n
          )
        );
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Toutes les notifications du site</h2>
      <ul className="space-y-4 mb-8">
        {allNotifications.length === 0 && <li>Aucune notification trouvée.</li>}
        {allNotifications.map(n => (
          <li key={n._id} className="p-4 rounded shadow bg-blue-50">
            <strong>{n.title}</strong> — {n.message}
            <div className="text-xs text-gray-500">Pour : {n.user_id}</div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-4">Mes notifications admin</h2>
      <ul className="space-y-4">
        {adminNotifications.length === 0 && <li>Aucune notification pour vous.</li>}
        {adminNotifications.map(n => (
          <li key={n._id} className={`p-4 rounded shadow ${n.read ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <strong>{n.title}</strong> — {n.message}
                <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <button
                onClick={() => toggleRead(n._id, n.read)}
                className={`ml-4 px-3 py-1 rounded text-white ${n.read ? 'bg-gray-500 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {n.read ? 'Non lue' : 'Marquer comme lue'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};