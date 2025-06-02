import React from 'react'
import StatCards from '../StatCards';
import AtendanceChart from '../AtendanceChart';
import StudentRoster from '../StudentRoster';

export const TdashBoard = () => {
  return (
    <div>
      <StatCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <AtendanceChart />
        <StudentRoster />
      </div>
    </div>
  )
}
