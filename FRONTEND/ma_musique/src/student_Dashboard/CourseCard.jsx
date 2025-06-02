import React from 'react';

function CourseCard({ title, progress }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span role="img" aria-label="music">🎵</span> {title}
      </h3>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-1 text-sm text-gray-600">{progress}% completed</p>
    </div>
  );
}

export default CourseCard;
