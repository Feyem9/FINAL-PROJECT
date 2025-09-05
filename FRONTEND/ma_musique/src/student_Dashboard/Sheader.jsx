import React from 'react';

export const Header = () => {
  const id = localStorage.getItem('userId');
  // console.log(`User ID received: ${id}`);
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;

  const API_URL = `http://localhost:3000/students/${id}`;

  const student = JSON.parse(localStorage.getItem('student'));
  const studentName = student ? student.name : 'Étudiant inconnu';
  const progress = 80;

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-600 shadow p-4 md:p-6 flex flex-col md:flex-row justify-between items-center rounded-b-lg w-full">
        <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
          <img
            src="/profile-student.png"
            alt="Profil étudiant"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white shadow flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg md:text-2xl font-bold text-white truncate">
              Bienvenue, {studentName} !
            </h1>
            <p className="text-amber-100 text-xs md:text-sm truncate">Tableau de bord étudiant</p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 bg-amber-50 p-4 md:p-8 mt-6 md:mt-10 max-w-7xl mx-auto w-full rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mb-6">
          <h2 className="text-base md:text-xl font-semibold text-amber-800 truncate">
            👋 Hello {studentName}
          </h2>
          <div className="w-full md:w-1/3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs md:text-sm text-amber-700 font-medium">Progression</span>
              <span className="text-xs md:text-sm text-amber-700 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-3">
              <div
                className="bg-amber-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Tu as appris <span className="font-bold text-amber-700">{progress}%</span> de ton cours.
          Continue comme ça !
        </p>
      </main>
    </div>

  );
};

export default Header;
