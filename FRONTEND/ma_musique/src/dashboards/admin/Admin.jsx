import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaLink, FaCalendarAlt, FaChild, FaBell, FaBars } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { useAuth0 } from '@auth0/auth0-react';

import Header from './Header';
import { Dashboard } from './Dashboard';

export function Admin() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export function Dash() {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
    logout({ returnTo: window.location.origin });
  };

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
        className={`fixed z-50 bg-[#05253A] text-white w-64 h-full p-6 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
          <SidebarLink to="/admin/dashboard" icon={<FaHome />} label="Dashboard" />
          <SidebarLink to="/admin/courses" icon={<FaShoppingCart />} label="Create a Course" />
          <SidebarLink to="/admin/profile" icon={<AiOutlineUser />} label="My Profile" />
          <SidebarLink to="/admin/note" icon={<FaLink />} label="Note" />
          <SidebarLink to="/admin/create_user" icon={<FaChild />} label="Create a User" />
          <SidebarLink to="/admin/chats" icon={<FaLink />} label="Chats" />
          <SidebarLink to="/admin/calendars" icon={<FaCalendarAlt />} label="Calendars" />
          <SidebarLink to="/admin/notificatoin" icon={<FaBell />} label="Notification" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-white text-[#05253A] px-4 py-2 rounded hover:bg-[#447494] hover:text-white transition"
          >
            <AiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 bg-[#f1f5f9] overflow-y-auto">
        {/* Header + burger */}
        <div className="flex items-center justify-between mb-4">
          {/* Burger visible seulement sur mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-2xl text-[#05253A]"
          >
            <FaBars />
          </button>

          <Header />
        </div>

        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1d3f55] transition"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-base">{label}</span>
    </Link>
  );
}

// const navLinks = [
//   { to: "/student/dashboard", icon: <FaHome />, label: "Dashboard" },
//   { to: "/student/calendars", icon: <FaCalendarAlt />, label: "Calendars" },
//   { to: "/student/notificatoin", icon: <FaBell />, label: "Notifications" },
//   { to: "/student/chats", icon: <FaComments />, label: "Messages" },
//   { to: "/student/courses", icon: <FaBook />, label: "Learning Plan" },
//   { to: "/student/note", icon: <FaLink />, label: "Note" },
//   { to: "/student/profile", icon: <FaUser />, label: "Profile" },
// ];