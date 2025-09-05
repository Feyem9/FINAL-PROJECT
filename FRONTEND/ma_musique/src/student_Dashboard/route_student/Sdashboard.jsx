import React from 'react';

// Progress Overview Component
const ProgressOverview = () => {
  const courses = [
    { name: 'Piano Basics', progress: 85, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { name: 'Music Theory', progress: 72, color: 'bg-gradient-to-r from-green-500 to-teal-600' },
    { name: 'Chord Progressions', progress: 60, color: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { name: 'Jazz Piano', progress: 45, color: 'bg-gradient-to-r from-red-500 to-pink-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress</h2>
      <div className="space-y-5">
        {courses.map((course, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">{course.name}</span>
              <span className="text-gray-600">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${course.color}`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upcoming Tasks Component
const UpcomingTasks = () => {
  const tasks = [
    { title: 'Practice Piano Exercises', due: 'Tomorrow', priority: 'high' },
    { title: 'Complete Music Theory Quiz', due: 'In 3 days', priority: 'medium' },
    { title: 'Submit Chord Assignment', due: 'Next week', priority: 'low' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-amber-50 rounded-lg transition-colors">
            <div>
              <p className="font-medium text-gray-800">{task.title}</p>
              <p className="text-sm text-gray-500">Due: {task.due}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { title: 'Completed Piano Basics Quiz', time: '2 hours ago', type: 'quiz' },
    { title: 'Submitted Chord Assignment', time: '1 day ago', type: 'assignment' },
    { title: 'Joined Jazz Piano Course', time: '3 days ago', type: 'course' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className={`mr-3 mt-1 w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'quiz' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'assignment' ? 'bg-green-100 text-green-600' :
                'bg-amber-100 text-amber-600'
              }`}>
              {activity.type === 'quiz' ? '📝' : activity.type === 'assignment' ? '✅' : '📚'}
            </div>
            <div>
              <p className="font-medium text-gray-800">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Cards Component
const StatsCards = () => {
  const stats = [
    { title: 'Courses Enrolled', value: '6', icon: '📚', color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { title: 'Assignments Completed', value: '24', icon: '✅', color: 'bg-gradient-to-r from-green-500 to-teal-600' },
    { title: 'Quizzes Taken', value: '18', icon: '📝', color: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { title: 'Overall Progress', value: '72%', icon: '📈', color: 'bg-gradient-to-r from-red-500 to-pink-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`text-2xl p-2 rounded-lg ${stat.color.replace('bg-gradient-to-r', 'bg').split(' ')[0]} text-white`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Weekly Goals Component
const WeeklyGoals = () => {
  const goals = [
    { title: 'Practice Piano 5 hours', completed: true },
    { title: 'Complete Music Theory Module', completed: false },
    { title: 'Submit Chord Assignment', completed: false },
    { title: 'Take Jazz Quiz', completed: true },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Goals</h2>
      <div className="space-y-3">
        {goals.map((goal, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${goal.completed ? 'bg-green-500' : 'border-2 border-gray-300'
              }`}>
              {goal.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {goal.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Sdashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Student!</h1>
        <div className="text-sm text-gray-500">Today, 10:30 AM</div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressOverview />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <UpcomingTasks />
            <WeeklyGoals />
          </div>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};
