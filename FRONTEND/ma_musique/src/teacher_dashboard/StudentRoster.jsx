import React from 'react';

const students = [
  { id: 1, name: 'Alice Kamga', email: 'alice@email.com', status: 'Présent', score: 85 },
  { id: 2, name: 'Jean Mbianda', email: 'jean@email.com', status: 'Absent', score: 60 },
  { id: 3, name: 'Claire Ndongo', email: 'claire@email.com', status: 'En retard', score: 72 },
  { id: 4, name: 'John Doe', email: 'john@email.com', status: 'Présent', score: 78 },
];

const StudentRoster = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Liste des étudiants</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th>Nom</th>
            <th>Email</th>
            <th>Statut</th>
            <th>Progression</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{student.name}</td>
              <td className="py-2">{student.email}</td>
              <td className="py-2">
                {student.status === 'Présent' && <span className="text-green-600">{student.status}</span>}
                {student.status === 'Absent' && <span className="text-red-600">{student.status}</span>}
                {student.status === 'En retard' && <span className="text-yellow-600">{student.status}</span>}
              </td>
              <td className="py-2 w-1/4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${student.score}%` }}
                  ></div>
                </div>
              </td>
              <td className="py-2 font-semibold">{student.score}%</td>
              <td className="py-2">
                <button className="text-blue-600 hover:underline">Voir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentRoster;
