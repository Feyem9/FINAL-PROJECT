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
    <div className="flex min-h-screen bg-gradient-to-br from-lime-400 to-lime-500">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}         
      <aside
        className={`fixed z-50 bg-lime-500 text-lime-950 w-80 h-full p-6 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Header du sidebar */}
        <div className="mb-8">
          <h1 className="text-lime-950 text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <nav className="space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<FaHome />} label="Dashboard" />
          <SidebarLink to="/admin/courses" icon={<FaShoppingCart />} label="Courses" />
          <SidebarLink to="/admin/profile" icon={<AiOutlineUser />} label="Profile" />
          <SidebarLink to="/admin/note" icon={<FaLink />} label="Note" />
          <SidebarLink to="/admin/create_user" icon={<FaChild />} label="Create User" />
          <SidebarLink to="/admin/chats" icon={<FaLink />} label="Chats" />
          <SidebarLink to="/admin/calendars" icon={<FaCalendarAlt />} label="Calendar" />
          <SidebarLink to="/admin/notificatoin" icon={<FaBell />} label="Notification" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-lime-600 text-lime-950 hover:bg-lime-100 transition-all mt-4"
          >
            <AiOutlineLogout className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-80 bg-gray-50 overflow-y-auto">
        {/* Header + burger */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            {/* Burger visible seulement sur mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-2xl text-gray-800"
            >
              <FaBars />
            </button>

            <Header />
          </div>

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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
        isActive 
          ? 'bg-lime-600 text-white hover:bg-lime-100 hover:text-lime-950' 
          : 'text-lime-950 hover:bg-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-base">{label}</span>
    </Link>
  );
}
