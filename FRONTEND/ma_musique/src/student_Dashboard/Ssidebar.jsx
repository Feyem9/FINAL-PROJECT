// Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaBell, FaComments, FaBook, FaUser, FaSignOutAlt, FaLink, FaEdit } from 'react-icons/fa';
// import { Header } from './Sheader'


const navLinks = [
  { to: "/student/dashboard", icon: <FaHome />, label: "Dashboard" },
  { to: "/student/calendars", icon: <FaCalendarAlt />, label: "Calendars" },
  { to: "/student/notificatoin", icon: <FaBell />, label: "Notifications" },
  { to: "/student/chats", icon: <FaComments />, label: "Messages" },
  { to: "/student/courses", icon: <FaBook />, label: "Learning Plan" },
  { to: "/student/note", icon: <FaLink />, label: "Note" },
  { to: "/student/profile", icon: <FaUser />, label: "Profile" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 h-full flex flex-col shadow-xl">
      <div className="p-6 border-b border-blue-500 flex flex-col items-center">
        <img src="/ChatGPT Image 7 avr. 2025, 12_44_05.png" alt="Logo" className="h-16 w-16 rounded-full border-4 border-white shadow-lg mb-2" />
        <span className="text-white font-bold text-lg mt-2 tracking-wide">Museschool</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
              ${location.pathname === link.to
                ? "bg-white text-blue-700 shadow"
                : "text-blue-100 hover:bg-blue-500 hover:text-white"}
            `}
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-blue-500">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-500 bg-white hover:bg-red-50 transition-all duration-200 shadow"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
      {/* Main content */}
      <div className="main-content">
        {/* 🔥 Header global visible sur toutes les pages */}
        <div className="content-header">
          {/* <Header /> */}
        </div>
        {/* Pages dynamiques */}        
      </div>
    </div>
  );
};

export default Sidebar;
