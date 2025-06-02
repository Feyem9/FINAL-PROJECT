import React from 'react';
import { FaChalkboardTeacher, FaBook, FaSignOutAlt, FaHome, FaCalendarAlt, FaBell, FaComments, FaUser, FaLink, FaEdit } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';


const navLinks = [
  { to: "/teacher/dashboard", icon: <FaHome />, label: "Dashboard" },
  { to: "/teacher/calendars", icon: <FaCalendarAlt />, label: "Calendars" },
  { to: "/teacher/notificatoin", icon: <FaBell />, label: "Notifications" },
  { to: "/teacher/chats", icon: <FaComments />, label: "Messages" },
  { to: "/teacher/courses", icon: <FaBook />, label: "Create a course" },
  { to: "/teacher/note", icon: <FaLink />, label: "Note" },
  { to: "/teacher/profile", icon: <FaUser />, label: "Profile" },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="w-64 bg-blue-800 text-white min-h-screen p-4">
      <div className="flex flex-col items-center mb-8">
        <img src="/ChatGPT Image 7 avr. 2025, 12_44_05.png" alt="Profile" className="w-20 h-20 rounded-full" />
        <h2 className="mt-2 text-lg font-semibold">Lily Cristopher</h2>
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
    </div>
  );
};

export default Sidebar;
