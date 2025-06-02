import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

import { Outlet } from 'react-router-dom';


const TeacherDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title="Teacher Dashboard" />
        <div className="flex-1 p-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';

// function TeacherDashboard() {
//   const attendanceData = {
//     labels: ['Aug 2020', 'Sep 2020', 'Oct 2020', 'Nov 2020', 'Dec 2020'],
//     datasets: [
//       {
//         label: 'Attendance',
//         data: [45, 60, 70, 85, 78],
//         backgroundColor: 'rgba(59, 130, 246, 0.5)',
//         borderRadius: 10,
//       },
//     ],
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-blue-600 text-white flex flex-col p-4">
//         <div className="mb-6 text-center">
//           <img
//             src="https://randomuser.me/api/portraits/women/1.jpg"
//             alt="Lily Cristopher"
//             className="w-20 h-20 rounded-full mx-auto"
//           />
//           <p className="mt-2 font-semibold">Lily Cristopher</p>
//         </div>
//         <nav className="space-y-2">
//           <a href="#" className="block py-2 px-4 rounded hover:bg-blue-500">Dashboard</a>
//           <a href="#" className="block py-2 px-4 rounded hover:bg-blue-500">Courses</a>
//           <a href="#" className="block py-2 px-4 rounded hover:bg-blue-500">Add New Course</a>
//           <a href="#" className="block py-2 px-4 rounded hover:bg-blue-500">School Calendar</a>
//           <a href="#" className="block py-2 px-4 rounded hover:bg-blue-500">District Calendar</a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-y-auto">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
//           <button className="bg-blue-600 text-white px-4 py-2 rounded">Go to Live Instructor</button>
//         </header>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-yellow-100 p-4 rounded-xl text-center">
//             <p className="text-sm">Courses</p>
//             <p className="text-2xl font-bold">4</p>
//             <p className="text-xs">90% Completed</p>
//           </div>
//           <div className="bg-red-100 p-4 rounded-xl text-center">
//             <p className="text-sm">Attendance</p>
//             <p className="text-2xl font-bold text-red-600">80%</p>
//             <p className="text-xs">20% Absent</p>
//           </div>
//           <div className="bg-green-100 p-4 rounded-xl text-center">
//             <p className="text-sm">Assignments</p>
//             <p className="text-2xl font-bold text-green-600">75%</p>
//             <p className="text-xs">25% Remaining</p>
//           </div>
//           <div className="bg-lime-100 p-4 rounded-xl text-center">
//             <p className="text-sm">Quizzes/Tests</p>
//             <p className="text-2xl font-bold text-green-600">80%</p>
//             <p className="text-xs">60% Completed</p>
//           </div>
//         </div>

//         {/* Attendance Chart */}
//         <div className="bg-white p-6 rounded-2xl shadow mb-6">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Attendance</h3>
//           <Bar data={attendanceData} />
//         </div>

//         {/* Student Roster */}
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">Student Roster</h3>
//           <ul className="divide-y text-sm">
//             {[
//               { name: 'Mr Wick', score: 60 },
//               { name: 'Lily Joe', score: 68 },
//               { name: 'Jane Dukker', score: 70 },
//               { name: 'Cici Clover', score: 73 },
//               { name: 'Jane Doe', score: 76 },
//               { name: 'Lily Joe', score: 78 },
//             ].map((student, index) => (
//               <li key={index} className="py-2 flex justify-between">
//                 <span>{student.name}</span>
//                 <span className="font-semibold text-blue-600">{student.score}%</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default TeacherDashboard;
