import React from 'react';

function ResultsCard() {
  const results = [
    { subject: 'Piano Basics - Quiz 01', score: 37 },
    { subject: 'Scales & Chords - Quiz 02', score: 87 },
    { subject: 'Finger Exercises - Quiz 01', score: 50 },
    { subject: 'Music Reading - Quiz 03', score: 72 },
    { subject: 'Improvisation - Quiz 04', score: 100 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Piano Results</h3>
      <ul className="space-y-4 text-sm">
        {results.map((result, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
          >
            <div className="text-gray-700 font-medium">
              🎼 <span className="text-blue-700">{result.subject}</span>
            </div>
            <div className={`font-bold ${result.score >= 50 ? 'text-green-600' : 'text-red-500'}`}>
              {result.score}%
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsCard;

