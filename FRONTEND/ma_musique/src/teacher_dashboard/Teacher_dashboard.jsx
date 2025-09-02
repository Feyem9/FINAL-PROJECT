import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

// Teacher Dashboard Components
const TeacherSidebar = ({ isOpen, toggleSidebar }) => {
  const navLinks = [
    { name: 'Dashboard', path: '/teacher/dashboard' },
    { name: 'Courses', path: '/teacher/courses' },
    { name: 'Calendar', path: '/teacher/calendars' },
    { name: 'Notification', path: '/teacher/notification' },
    { name: 'Messages', path: '/teacher/chats' },
    { name: 'Notes', path: '/teacher/note' },
    { name: 'Profile', path: '/teacher/profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-screen w-64 bg-gradient-to-b from-orange-600 to-red-700 text-white transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="p-6 border-b border-orange-500">
          <h1 className="text-2xl font-bold">Teacher Panel</h1>
          <p className="text-orange-200 text-sm">Music School</p>
        </div>

        <nav className="mt-6 px-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className="block py-3 px-4 rounded-lg hover:bg-orange-500 transition-colors mb-2"
            >
              {link.name}
            </a>
          ))}

          <button className="w-full mt-8 py-3 px-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-100 transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

const TeacherHeader = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-orange-600 mr-4"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Teacher Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
            T
          </div>
        </div>
      </div>
    </header>
  );
};

const TeacherDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;