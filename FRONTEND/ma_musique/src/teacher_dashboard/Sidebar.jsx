import React, { useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import {
  FaHome,
  FaCalendarAlt,
  FaBell,
  FaComments,
  FaBook,
  FaUser,
  FaLink,
  FaBars,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth0();

  const handleLogout = () => {
    navigate('/');
    logout({ returnTo: window.location.origin });
  };

  function SidebarLink({ to, icon, label }) {
    return (
      <Link
        to={to}
        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => setSidebarOpen(false)}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-base">{label}</span>
      </Link>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 bg-blue-800 text-white w-64 h-full p-6 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="mb-8 text-center">
          <img
            src="/ChatGPT Image 7 avr. 2025, 12_44_05.png"
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto"
          />
          <h2 className="mt-2 text-lg font-semibold">Lily Cristopher</h2>
        </div>
        <nav className="space-y-4">
          {navLinks.map(link => (
            <SidebarLink key={link.to} to={link.to} icon={link.icon} label={link.label} />
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-white text-blue-800 px-4 py-2 rounded hover:bg-blue-700 hover:text-white transition mt-4"
          >
            <AiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 bg-[#f1f5f9] overflow-y-auto">
        {/* Burger + header global */}
        <div className="flex items-center justify-between mb-4">
          {/* Burger mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-2xl text-blue-800"
          >
            <FaBars />
          </button>
          {/* Place your header or children here */}
        </div>
        {/* Children/pages will be rendered here */}
        {/* <Outlet /> */}
      </main>
    </div>
  );
};

export default Sidebar;
