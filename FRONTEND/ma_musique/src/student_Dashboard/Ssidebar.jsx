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
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Sheader from './Sheader'; // ✅ Ton header global

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
        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-600 transition"
        onClick={() => setSidebarOpen(false)} // ferme sur mobile quand on clique
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
        className={`fixed z-50 bg-amber-500 text-white w-64 h-full p-6 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="mb-8 text-center">
          <img
            src="/ChatGPT Image 7 avr. 2025, 12_44_05.png"
            alt="Organization Logo"
            className="w-20 mx-auto rounded"
          />
        </div>

        <nav className="space-y-4">
          <SidebarLink to="/student/dashboard" icon={<FaHome />} label="Dashboard" />
          <SidebarLink to="/student/calendars" icon={<FaCalendarAlt />} label="Calendars" />
          <SidebarLink to="/student/notificatoin" icon={<FaBell />} label="Notification" />
          <SidebarLink to="/student/chats" icon={<FaComments />} label="Chats" />
          <SidebarLink to="/student/courses" icon={<FaBook />} label="Learning Plans" />
          <SidebarLink to="/student/note" icon={<FaLink />} label="Note" />
          <SidebarLink to="/student/profile" icon={<FaUser />} label="My Profile" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-white text-amber-600 px-4 py-2 rounded hover:bg-amber-700 hover:text-white transition"
          >
            <AiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 ml-0 md:ml-64 p-6 bg-[#f1f5f9] overflow-y-auto">
        {/* Burger + header global */}
        <div className="flex items-center justify-between mb-4">
          {/* Burger mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-2xl text-amber-600"
          >
            <FaBars />
          </button>

          {/* ✅ Header global, unique */}
          {/* <Sheader /> */}
        </div>

        {/* Les pages enfants */}
        {/* <Outlet /> */}
      </main>
    </div>
  );
};

export default Sidebar;

