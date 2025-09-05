import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-500 to-green-600">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 bg-white shadow-xl text-gray-800 w-72 h-full p-6 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Header du sidebar */}
        <div className="mb-10 mt-4">
          <h1 className="text-gray-800 text-2xl font-bold flex items-center gap-2">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Dashboard
          </h1>
        </div>

        <nav className="space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<FaHome />} label="Dashboard" />
          <SidebarLink to="/admin/courses" icon={<FaShoppingCart />} label="Courses" />
          <SidebarLink to="/admin/profile" icon={<AiOutlineUser />} label="Profile" />
          <SidebarLink to="/admin/note" icon={<FaLink />} label="Notes" />
          <SidebarLink to="/admin/create_user" icon={<FaChild />} label="Create User" />
          <SidebarLink to="/admin/chats" icon={<FaLink />} label="Chats" />
          <SidebarLink to="/admin/calendars" icon={<FaCalendarAlt />} label="Calendar" />
          <SidebarLink to="/admin/notificatoin" icon={<FaBell />} label="Notifications" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all mt-8 shadow-md hover:shadow-lg"
          >
            <AiOutlineLogout className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Footer du sidebar */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Museschool</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-72 bg-gray-50 min-h-screen transition-all duration-300">
        {/* Header + burger */}
        <div className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            {/* Burger visible seulement sur mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-2xl text-gray-800 p-2 rounded-lg hover:bg-gray-100"
            >
              <FaBars />
            </button>

            <Header />
          </div>
        </div>

        {/* Content area with padding */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
        ? 'bg-lime-600 text-white hover:bg-lime-100 hover:text-lime-950'
        : 'text-lime-950 hover:bg-white'
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-base">{label}</span>
    </Link>
  );
}
