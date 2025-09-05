// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export const Notification = () => {

//       // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
//           const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;



//   const [allNotifications, setAllNotifications] = useState([]);
//   const [adminNotifications, setAdminNotifications] = useState([]);
//   const adminData = localStorage.getItem('admin');
//   const id = adminData ? JSON.parse(adminData)._id : null;

//   useEffect(() => {
//     axios.get(`${databaseUri}/notification/all`)
//       .then(res => setAllNotifications(res.data))
//       .catch(err => console.error(err));

//     if (id) {
//       axios.get(`${databaseUri}/notification/user/${id}`)
//         .then(res => setAdminNotifications(res.data))
//         .catch(err => console.error(err));
//     }
//   }, [id]);

//   // Fonction pour marquer une notification comme lue ou non lue
//   const toggleRead = (notifId, currentRead) => {
//     axios.patch(`${databaseUri}/notification/${notifId}/read`, { read: !currentRead })
//       .then(() => {
//         setAdminNotifications(notifs =>
//           notifs.map(n =>
//             n._id === notifId ? { ...n, read: !currentRead } : n
//           )
//         );
//       })
//       .catch(err => console.error(err));
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Toutes les notifications du site</h2>
//       <ul className="space-y-4 mb-8">
//         {allNotifications.length === 0 && <li>Aucune notification trouvée.</li>}
//         {allNotifications.map(n => (
//           <li key={n._id} className="p-4 rounded shadow bg-blue-50">
//             <strong>{n.title}</strong> — {n.message}
//             <div className="text-xs text-gray-500">Pour : {n.user_id}</div>
//           </li>
//         ))}
//       </ul>

//       <h2 className="text-xl font-bold mb-4">Mes notifications admin</h2>
//       <ul className="space-y-4">
//         {adminNotifications.length === 0 && <li>Aucune notification pour vous.</li>}
//         {adminNotifications.map(n => (
//           <li key={n._id} className={`p-4 rounded shadow ${n.read ? 'bg-green-50' : 'bg-yellow-50'}`}>
//             <div className="flex justify-between items-center">
//               <div>
//                 <strong>{n.title}</strong> — {n.message}
//                 <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
//               </div>
//               <button
//                 onClick={() => toggleRead(n._id, n.read)}
//                 className={`ml-4 px-3 py-1 rounded text-white ${n.read ? 'bg-gray-500 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'}`}
//               >
//                 {n.read ? 'Non lue' : 'Marquer comme lue'}
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Notification = () => {
    // Les appels d'API et la logique d'état restent inchangés
    // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
    const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


    const [allNotifications, setAllNotifications] = useState([]);
    const [adminNotifications, setAdminNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // Nouvel état pour le filtre

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

    const markAllAsRead = () => {
        // Logique pour marquer toutes les notifications non lues comme lues
        const unreadIds = adminNotifications.filter(n => !n.read).map(n => n._id);

        // Simuler un appel API pour marquer toutes les notifications comme lues
        axios.patch(`${databaseUri}/notification/markAllAsRead`, { ids: unreadIds })
            .then(() => {
                setAdminNotifications(notifs =>
                    notifs.map(n => ({ ...n, read: true }))
                );
            })
            .catch(err => console.error(err));
    };


    // --- Logique dynamique pour l'affichage ---
    const unreadCount = adminNotifications.filter(n => !n.read).length;
    const readCount = adminNotifications.filter(n => n.read).length;
    // Les comptes "Important" et "Scheduled" nécessitent des champs dans tes données de notification
    const importantCount = adminNotifications.filter(n => n.important).length;
    const scheduledCount = adminNotifications.filter(n => n.scheduled).length;

    // Filtrer les notifications basées sur la barre de recherche et le filtre de statut
    const filteredNotifications = adminNotifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        if (filter === 'unread') {
            matchesFilter = !n.read;
        } else if (filter === 'read') {
            matchesFilter = n.read;
        } else if (filter === 'important') {
            matchesFilter = n.important;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
                        <p className="text-gray-600">Stay updated with the latest alerts and messages</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                        >
                            Mark all as read
                        </button>
                        <button className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg">
                            Settings
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Unread</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{unreadCount}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Read</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{readCount}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Important</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{importantCount}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Scheduled</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{scheduledCount}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search notifications..."
                                    className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            >
                                <option value="all">All Notifications</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="important">Important</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <ul className="space-y-4">
                        {filteredNotifications.length === 0 && (
                            <li className="text-center text-gray-500 py-8">No matching notifications found.</li>
                        )}
                        {filteredNotifications.map(n => (
                            <li key={n._id} className="border-b last:border-b-0 py-4 flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex items-start space-x-4">
                                    <span className={`h-3 w-3 rounded-full mt-2 ${n.read ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-lg">{n.title}</h3>
                                        <p className="text-gray-600 mt-1">{n.message}</p>
                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                            <button className="text-green-600 hover:underline font-medium">View Profile</button>
                                            <button
                                                onClick={() => toggleRead(n._id, n.read)}
                                                className="text-gray-500 hover:underline font-medium"
                                            >
                                                {n.read ? 'Mark as unread' : 'Mark as read'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400 whitespace-nowrap">
                                    {new Date(n.createdAt).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};