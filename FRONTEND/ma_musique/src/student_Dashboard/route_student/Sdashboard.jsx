/*
Future Enhancements:
- [ ] Add real progress tracking API endpoint
- [x] Add assignments/quizzes API endpoints (COMPLETED - Created GET /:id/assignments, GET /:id/quizzes, POST /submit-assignment, POST /submit-quiz)
- [ ] Add recent activities API endpoint
- [ ] Add upcoming tasks API endpoint
- [ ] Add weekly goals API endpoint
*/

import React, { useState, useEffect } from "react";
import axios from "axios";

// Progress Overview Component
const ProgressOverview = ({ enrolledCourses }) => {
  // Mock progress data for now - in real implementation, this would come from backend
  const coursesWithProgress = enrolledCourses.map((course, index) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-indigo-600",
      "bg-gradient-to-r from-green-500 to-teal-600",
      "bg-gradient-to-r from-amber-500 to-orange-600",
      "bg-gradient-to-r from-red-500 to-pink-600",
    ];
    return {
      name: course.title,
      progress: Math.floor(Math.random() * 100), // Mock progress - replace with real data
      color: colors[index % colors.length],
    };
  });

  // Commented out old hardcoded data
  /*
  const courses = [
    { name: 'Piano Basics', progress: 85, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { name: 'Music Theory', progress: 72, color: 'bg-gradient-to-r from-green-500 to-teal-600' },
    { name: 'Chord Progressions', progress: 60, color: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { name: 'Jazz Piano', progress: 45, color: 'bg-gradient-to-r from-red-500 to-pink-600' },
  ];
  */

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress</h2>
      <div className="space-y-5">
        {coursesWithProgress.length > 0 ? (
          coursesWithProgress.map((course, index) => (
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
          ))
        ) : (
          <p className="text-gray-500">No enrolled courses yet.</p>
        )}
      </div>
    </div>
  );
};

const UpcomingTasks = ({ assignments }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
      <div className="space-y-4">
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <div>
                <p className="font-medium text-gray-800">{assignment.title}</p>
                <p className="text-sm text-gray-500">
                  Due: {assignment.dueDate}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  assignment.status === "pending"
                    ? "bg-red-100 text-red-800"
                    : assignment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {assignment.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming tasks.</p>
        )}
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { title: "Completed Piano Basics Quiz", time: "2 hours ago", type: "quiz" },
    {
      title: "Submitted Chord Assignment",
      time: "1 day ago",
      type: "assignment",
    },
    { title: "Joined Jazz Piano Course", time: "3 days ago", type: "course" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div
              className={`mr-3 mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === "quiz"
                  ? "bg-blue-100 text-blue-600"
                  : activity.type === "assignment"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
              }`}
            >
              {activity.type === "quiz"
                ? "📝"
                : activity.type === "assignment"
                  ? "✅"
                  : "📚"}
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

// StatsCards Component
const StatsCards = ({
  enrolledCourses = [],
  assignments = [],
  quizzes = [],
}) => {
  // Calcul des stats
  const coursesEnrolled = enrolledCourses.length;
  const assignmentsCompleted = assignments.filter(
    (a) => a.status === "completed"
  );
  const quizzesCompleted = quizzes.filter((q) => q.status === "completed");

  const totalTasks = assignments.length + quizzes.length;
  const completedTasks = assignmentsCompleted.length + quizzesCompleted.length;

  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Courses Enrolled",
      value: coursesEnrolled,
      icon: "📚",
      color: "bg-blue-500",
    },
    {
      title: "Assignments Completed",
      value: assignmentsCompleted.length,
      icon: "✅",
      color: "bg-green-500",
    },
    {
      title: "Quizzes Taken",
      value: quizzesCompleted.length,
      icon: "📝",
      color: "bg-amber-500",
    },
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      icon: "📈",
      color: "bg-red-500",
    },
  ];

  // Sous-composant pour la liste (quizzes / assignments)
  const CompletedList = ({ title, items, type }) => (
    <div className="bg-white rounded-xl shadow-md p-5 mb-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={item.id || idx} className="flex items-center gap-2">
              <span className="text-green-500">✔️</span>
              <span className="font-medium">{item.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No {type} completed yet.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div
                className={`text-2xl p-2 rounded-lg ${stat.color} text-white`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quizzes complétés */}
      <CompletedList
        title="Completed Quizzes"
        items={quizzesCompleted}
        type="quizzes"
      />

      {/* Assignments complétés */}
      <CompletedList
        title="Completed Assignments"
        items={assignmentsCompleted}
        type="assignments"
      />
    </div>
  );
};

export default StatsCards;

// Weekly Goals Component
const WeeklyGoals = ({ goals = [] }) => {
  const databaseUri =
    import.meta.env.VITE_BACKEND_ONLINE_URI ||
    import.meta.env.VITE_TESTING_BACKEND_URI;

  const studentData = JSON.parse(localStorage.getItem("student"));
  const userId = studentData?._id;
  const [weeklyGoals, setWeeklyGoals] = useState([]);

  useEffect(() => {
    if (!userId || !databaseUri) return;
    axios
      .get(`${databaseUri}/students/${userId}/weekly-goals`)
      .then((res) => setWeeklyGoals(Array.isArray(res.data) ? res.data : []))
      .catch(() => setWeeklyGoals([]));
  }, [userId, databaseUri]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Goals</h2>
      <div className="space-y-3">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <div key={goal.id || index} className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                  goal.completed ? "bg-green-500" : "border-2 border-gray-300"
                }`}
              >
                {goal.completed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`${goal.completed ? "line-through text-gray-500" : "text-gray-800"}`}
              >
                {goal.title}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No weekly goals set.</p>
        )}
      </div>
    </div>
  );
};

export const Sdashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [weeklyGoals, setWeeklyGoals] = useState([]); // ✅ ajouté ici

  const databaseUri =
    import.meta.env.VITE_BACKEND_ONLINE_URI ||
    import.meta.env.VITE_TESTING_BACKEND_URI;

  // Get user ID from localStorage
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const userIdFromStorage = student ? student._id : null;
    console.log("User ID:", userIdFromStorage);
    setUserId(userIdFromStorage);
  }, []);

  // Fetch enrolled courses, assignments, quizzes, and upcoming tasks
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId || !databaseUri) {
        setLoading(false);
        return;
      }

      try {
        const [
          coursesResponse,
          assignmentsResponse,
          quizzesResponse,
          tasksResponse,
          goalsResponse, // ✅ ajout
        ] = await Promise.all([
          axios.get(`${databaseUri}/students/${userId}/enrolled-courses`, {
            headers: { "Content-Type": "application/json" },
          }),
          axios.get(`${databaseUri}/students/${userId}/assignments`, {
            headers: { "Content-Type": "application/json" },
          }),
          axios.get(`${databaseUri}/students/${userId}/quizzes`, {
            headers: { "Content-Type": "application/json" },
          }),
          axios.get(`${databaseUri}/students/${userId}/upcoming-tasks`, {
            headers: { "Content-Type": "application/json" },
          }),
          axios
            .get(`${databaseUri}/students/${userId}/weekly-goals`, {
              headers: { "Content-Type": "application/json" },
            })
            .catch((err) => {
              console.error("Error fetching weekly goals:", err);
            }),
        ]);

        setEnrolledCourses(
          Array.isArray(coursesResponse.data) ? coursesResponse.data : []
        );
        console.log("Enrolled Courses:", coursesResponse.data); // 👈 debug ici
        setAssignments(
          Array.isArray(assignmentsResponse.data)
            ? assignmentsResponse.data
            : []
        );
        console.log("Assignments:", assignmentsResponse.data); // 👈 debug ici
        setQuizzes(
          Array.isArray(quizzesResponse.data) ? quizzesResponse.data : []
        );
        console.log("Quizzes:", quizzesResponse.data); // 👈 debug ici
        setUpcomingTasks(
          Array.isArray(tasksResponse.data) ? tasksResponse.data : []
        );
        console.log("Upcoming Tasks:", tasksResponse.data); // 👈 debug ici
        setWeeklyGoals(
          Array.isArray(goalsResponse.data) ? goalsResponse.data : []
        ); // ✅ ajout
        console.log("Weekly Goals:", goalsResponse.data); // 👈 debug ici
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setEnrolledCourses([]);
        setAssignments([]);
        setQuizzes([]);
        setUpcomingTasks([]);
        setWeeklyGoals([]); // ✅ ajout
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId, databaseUri]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {userId.name}!
        </h1>
        <div className="text-sm text-gray-500">
          Today, {new Date().toLocaleTimeString()}
        </div>
      </div>

      <StatsCards
        enrolledCourses={enrolledCourses}
        assignments={assignments}
        quizzes={quizzes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressOverview enrolledCourses={enrolledCourses} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <UpcomingTasks assignments={assignments} />
            <WeeklyGoals goals={weeklyGoals} />
          </div>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};
