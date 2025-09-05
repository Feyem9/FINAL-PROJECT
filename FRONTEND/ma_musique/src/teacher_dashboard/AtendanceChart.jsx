import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Aug', attendance: 1200 },
  { month: 'Sep', attendance: 2100 },
  { month: 'Oct', attendance: 2345 },
  { month: 'Nov', attendance: 1800 },
  { month: 'Dec', attendance: 2200 },
];

const AtendanceChart = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Attendance</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AtendanceChart;
