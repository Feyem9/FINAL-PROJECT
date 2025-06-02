import React from 'react'
import StudentCourse from '../route_student/StudentCourse';
import ResultsCard from '../ResultsCard';
import QuickActions from '../QuickActions';

export const Sdashboard = () => {
  return (
        <div className="flex-1 p-6 space-y-6">
          <StudentCourse />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultsCard />
            <QuickActions />
          </div>
        </div>  )
}
