import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-[#86ff57] text-[#2c3e50] shadow-md h-22">
      {/* Icône de notification */}
      <Link
        to="/admin/notificatoin"
        className="relative text-2xl hover:text-blue-600 transition"
      >
        🔔
      </Link>

      {/* Nom de l'organisation */}
      <span className="text-xl font-bold mx-auto hidden md:inline">
        Dongueu Feyem · C
      </span>

      {/* Avatar */}
      <img
        src="/mon_prof.jpg"
        alt="Organization Logo"
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
      />
    </header>
  );
};

export default Header;
