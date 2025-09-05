import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Snotification = () => {
  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI || 'http://localhost:3000';
  // const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentData = JSON.parse(localStorage.getItem('student'));
  const studentId = studentData?._id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        if (studentId) {
          const res = await axios.get(`${databaseUri}/notification/user/${studentId}`);
          setNotifications(res.data);
        }
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [studentId]);

  const toggleRead = async (notifId, currentRead) => {
    try {
      await axios.patch(`${databaseUri}/notification/${notifId}/read`, { read: !currentRead });
      setNotifications(notifs =>
        notifs.map(n =>
          n._id === notifId ? { ...n, read: !currentRead } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
      await axios.patch(`${databaseUri}/notification/markAllAsRead`, { ids: unreadIds });
      setNotifications(notifs =>
        notifs.map(n => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculations
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  // Filter notifications based on search and filter
  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === 'unread') {
      matchesFilter = !n.read;
    } else if (filter === 'read') {
      matchesFilter = n.read;
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="text-center p-8">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

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
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-gray-500 text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{notifications.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
