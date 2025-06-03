// Header.jsx
import React from 'react';

export const Header = () => {


   const id = localStorage.getItem('userId');
    // console.log(`User ID received: ${id}`);
  const API_URL = `http://localhost:3000/students/${id}`;

    const student = JSON.parse(localStorage.getItem('student'));


    const studentName = student ? student.name : 'Étudiant inconnu';
  const progress = 80;

  return (
    <div>
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow p-6 flex justify-between items-center rounded-b-lg">
        <div className="flex items-center gap-4">
          <img
            src="/profile-student.png"
            alt="Profil étudiant"
            className="w-14 h-14 rounded-full border-4 border-white shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Bienvenue, {studentName} !</h1>
            <p className="text-blue-100">Tableau de bord étudiant</p>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-blue-50 p-8 mt-10 md:mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-800">👋 Hello {studentName}</h2>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-blue-700 font-medium">Progression</span>
              <span className="text-sm text-blue-700 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-gray-600 text-lg">
          Tu as appris <span className="font-bold text-blue-700">{progress}%</span> de ton cours. Continue comme ça !
        </p>
      </main>
    </div>
  );
};

export default Header