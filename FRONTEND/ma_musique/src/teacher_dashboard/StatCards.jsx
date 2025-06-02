import React from 'react';


const stats = [
  { title: 'Courses', value: 4, color: 'bg-orange-500', progress: '90% completed' },
  { title: 'Attendance', value: '80%', color: 'bg-red-500', progress: '23% Absent' },
  { title: 'Assignments', value: '75%', color: 'bg-green-500', progress: '25% Remaining' },
  { title: 'Quizzes/Tests', value: '80%', color: 'bg-blue-500', progress: '60% completed' },
];

const StatCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`p-4 rounded shadow text-white ${stat.color}`}>
          <h2 className="text-lg font-semibold">{stat.title}</h2>
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="text-sm mt-1">{stat.progress}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;