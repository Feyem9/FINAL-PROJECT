import React from 'react';
import Sidebar from './Ssidebar';
import Header from './Sheader';

import { Outlet } from 'react-router-dom';


const StudentDashboard = () => {
  return (
    <div className="dashboard-container flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        <div className="flex-1 p-4 ">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
