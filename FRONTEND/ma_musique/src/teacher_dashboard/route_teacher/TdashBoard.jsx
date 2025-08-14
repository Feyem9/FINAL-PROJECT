import React from 'react';

// Stat Cards Component
const StatCards = () => {
  const stats = [
    { title: 'Total Courses', value: '12', change: '+2 this month', icon: '📚', color: 'bg-gradient-to-r from-orange-500 to-red-600' },
    { title: 'Students Enrolled', value: '142', change: '+18 this month', icon: '👥', color: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { title: 'Assignments', value: '24', change: '8 pending', icon: '📝', color: 'bg-gradient-to-r from-red-500 to-pink-600' },
    { title: 'Attendance', value: '92%', change: 'Avg. attendance', icon: '✅', color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.change}</p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
          <div className={`w-full h-1 rounded-full mt-4 ${stat.color.replace('bg-gradient-to-r', 'bg').split(' ')[0]}`}></div>
        </div>
      ))}
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { name: 'John Smith', action: 'submitted assignment', time: '2 hours ago', course: 'Piano Basics' },
    { name: 'Emma Wilson', action: 'asked a question', time: '4 hours ago', course: 'Music Theory' },
    { name: 'Michael Brown', action: 'completed quiz', time: '6 hours ago', course: 'Chord Progressions' },
    { name: 'Sarah Davis', action: 'joined course', time: '1 day ago', course: 'Jazz Piano' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="bg-orange-100 text-orange-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              {activity.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                {activity.name} <span className="font-normal text-gray-600">{activity.action}</span>
              </p>
              <p className="text-sm text-gray-500">{activity.course} • {activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upcoming Classes Component
const UpcomingClasses = () => {
  const classes = [
    { time: '10:00 AM', title: 'Piano Basics', students: 12 },
    { time: '2:00 PM', title: 'Music Theory', students: 8 },
    { time: '4:00 PM', title: 'Chord Progressions', students: 15 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Classes</h2>
      <div className="space-y-3">
        {classes.map((classItem, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-lg transition-colors">
            <div>
              <p className="font-medium text-gray-800">{classItem.title}</p>
              <p className="text-sm text-gray-500">{classItem.time} • {classItem.students} students</p>
            </div>
            <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Chart Component
const PerformanceChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Student Performance</h2>
      <div className="h-64 flex items-end space-x-2 justify-center">
        {[65, 80, 45, 90, 70, 85, 60].map((height, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-8 bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg transition-all hover:opacity-75"
              style={{ height: `${height}%` }}
            ></div>
            <span className="text-xs text-gray-500 mt-2">W{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
};

export const TdashBoard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: Today, 10:30 AM</div>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
          <PerformanceChart />
        </div>
        <UpcomingClasses />
      </div>
    </div>
  );
};
