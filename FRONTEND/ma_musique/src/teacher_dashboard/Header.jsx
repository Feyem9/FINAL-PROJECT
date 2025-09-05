import React from 'react';


const Header = ({ title }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex space-x-4">

        <img
          src="/profile-student.png"
          alt="Profil enseignant"
          className="w-14 h-14 rounded-full border-4 border-orange-500 shadow"
        />
      </div>

    </div>
  );
};

export default Header;
