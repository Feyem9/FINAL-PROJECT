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
    const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

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
        <div className="bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center bg-white p-6 shadow-sm border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={markAllAsRead}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Mark all as read
                    </button>
                    <button className="bg-[#3b9e4a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#348c41]">
                        Settings
                    </button>
                </div>
            </header>

            <main className="p-6">
                {/* Section des statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Carte des notifications non lues */}
                    <div onClick={() => setFilter('unread')} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer">
                        <div className="flex items-center text-[#3b9e4a] mb-2">
                            <i className="fas fa-bell text-3xl mr-2"></i>
                            <span className="text-3xl font-bold">{unreadCount}</span>
                        </div>
                        <span className="text-gray-500 font-medium">Unread</span>
                    </div>

                    {/* Carte des notifications lues */}
                    <div onClick={() => setFilter('read')} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer">
                        <div className="flex items-center text-gray-400 mb-2">
                            <i className="fas fa-check-circle text-3xl mr-2"></i>
                            <span className="text-3xl font-bold">{readCount}</span>
                        </div>
                        <span className="text-gray-500 font-medium">Read</span>
                    </div>

                    {/* Carte des notifications importantes */}
                    <div onClick={() => setFilter('important')} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer">
                        <div className="flex items-center text-orange-400 mb-2">
                            <i className="fas fa-exclamation-circle text-3xl mr-2"></i>
                            <span className="text-3xl font-bold">{importantCount}</span>
                        </div>
                        <span className="text-gray-500 font-medium">Important</span>
                    </div>

                    {/* Carte des notifications planifiées */}
                    <div onClick={() => setFilter('scheduled')} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer">
                        <div className="flex items-center text-blue-400 mb-2">
                            <i className="fas fa-clock text-3xl mr-2"></i>
                            <span className="text-3xl font-bold">{scheduledCount}</span>
                        </div>
                        <span className="text-gray-500 font-medium">Scheduled</span>
                    </div>
                </div>

                {/* Section des notifications filtrables */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <label htmlFor="filter" className="text-gray-700 font-medium">
                                <i className="fas fa-filter mr-2"></i>
                                Filter
                            </label>
                            <select 
                                id="filter" 
                                className="border rounded-lg p-2 text-sm w-full sm:w-auto"
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
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                className="w-full border rounded-lg p-2 text-sm pl-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    {/* Liste des notifications filtrées */}
                    <ul className="space-y-4">
                        {filteredNotifications.length === 0 && (
                            <li className="text-center text-gray-500 py-8">Aucune notification correspondante.</li>
                        )}
                        {filteredNotifications.map(n => (
                            <li key={n._id} className="border-b last:border-b-0 py-4 flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                    <span className={`h-2 w-2 rounded-full mt-2 ${n.read ? 'bg-gray-400' : 'bg-[#3b9e4a]'}`}></span>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{n.title}</h3>
                                        <p className="text-gray-600">{n.message}</p>
                                        <div className="mt-2 flex items-center space-x-4 text-xs">
                                            <button className="text-[#3b9e4a] hover:underline">View Profile</button>
                                            <button
                                                onClick={() => toggleRead(n._id, n.read)}
                                                className="text-gray-500 hover:underline"
                                            >
                                                {n.read ? 'Mark as unread' : 'Mark as read'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(n.createdAt).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};