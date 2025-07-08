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