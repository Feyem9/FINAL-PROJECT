import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import Sidebar from "./Ssidebar";
import { Outlet } from "react-router-dom";
import getInitials from "../utils/getInitials";
import { Link } from "react-router-dom";
import axios from "axios";

// Student Dashboard Components
const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const navLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Courses", path: "/student/courses" },
    { name: "Calendar", path: "/student/calendars" },
    { name: "Notification", path: "/student/notificatoin" },
    { name: "Messages", path: "/student/chats" },
    { name: "Notes", path: "/student/note" },
    { name: "Profile", path: "/student/profile" },
  ];

  const handleLogout = () => {
    // 1️⃣ Nettoyer le localStorage/sessionStorage
    localStorage.removeItem("student"); // ou tout autre clé utilisée
    sessionStorage.clear(); // si tu stockes temporairement des données

    // 2️⃣ Réinitialiser d'autres states si nécessaire
    // ex: setUser(null), setCart([]), etc.

    // 3️⃣ Déconnexion via Auth0 et redirection
    window.location.href = "/login";

    // 4️⃣ Facultatif : redirection locale immédiate
    // navigate('/'); // normalement pas nécessaire car Auth0 redirige
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-screen w-64 bg-gradient-to-b from-amber-500 to-orange-600 text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-amber-400">
          <h1 className="text-2xl font-bold">Student Panel</h1>
          <p className="text-amber-200 text-sm">Music School</p>
        </div>

        <nav className="mt-6 px-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className="block py-3 px-4 rounded-lg hover:bg-amber-400 transition-colors mb-2"
            >
              {link.name}
            </a>
          ))}

          <button
            className="w-full mt-8 py-3 px-4 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-100 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

const StudentHeader = ({ toggleSidebar }) => {
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState([]);

  const studentName =
    JSON.parse(localStorage.getItem("student"))?.name || "Student";

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", query);
  };

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem("student"));
    const studentId = studentData?._id;
    console.log(studentId);

    // Fetch notifications from backend API

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/students/${studentId}/notifications`
        );
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-amber-600 mr-4"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Student Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <FaSearch
            className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </form>
   
        <button className="text-gray-600 hover:text-amber-600 relative">
          <Link to="/student/notification">
            <FaBell size={20} />
          </Link>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
            {getInitials(studentName)}
          </div>
        </div>
      </div>
    </header>
  );
};

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
