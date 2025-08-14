import React, { useState, useEffect } from 'react';
import { Chats } from '../../dashboards/chats/Chats'; // Assure-toi que le chemin est correct
import axios from 'axios';

export const Schat = () => {
  // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
  const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [senderId, setSenderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const studentData = JSON.parse(localStorage.getItem('student'));
        const studentId = studentData?._id;

        if (studentId) setSenderId(studentId);

        const res = await axios.get(`${databaseUri}/teachers/all`);
        setTeachers(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des enseignants');
        console.error('Erreur lors du chargement des enseignants', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSelectTeacher = (e) => {
    setSelectedTeacherId(e.target.value);
  };

  if (loading) {
    return <div className="text-center p-8">Loading teachers...</div>;
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Chat</h1>
            <p className="text-gray-600">Connect with your teachers and colleagues</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Available Teachers</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{teachers.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a1 1 0 11-2 0 1 1 0 012 0zM7 10a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Online Now</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">5</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Messages Today</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teacher List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Teachers</h2>
              <div className="space-y-4">
                {teachers.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No teachers available</p>
                ) : (
                  teachers.map((teacher) => (
                    <div
                      key={teacher._id}
                      onClick={() => setSelectedTeacherId(teacher._id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${selectedTeacherId === teacher._id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {teacher.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{teacher.name}</p>
                        <p className="text-sm text-gray-500 truncate">{teacher.subject || 'Music Teacher'}</p>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            {selectedTeacherId ? (
              <Chats
                role="student"
                senderId={senderId}
                receiverId={selectedTeacherId}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Teacher to Chat</h3>
                <p className="text-gray-600 mb-6">Choose a teacher from the list to start a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};