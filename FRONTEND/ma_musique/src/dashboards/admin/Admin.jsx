import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaChartBar, FaLink, FaCalendarAlt, FaChild , FaBell } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';

import './dash.css';
import Header from './Header';
import axios from 'axios'; // On importe axios
import { useAuth0 } from '@auth0/auth0-react';


import { useLocation , Outlet } from 'react-router-dom';

import { Dashboard } from './Dashboard'; // On importe le composant Dashboard


// Composants pour les différentes pages
function Admin () {
  
  return (
  
  <div className="">
    <Dashboard />

  </div>
    
  );
};

// Fonction principale Dash
function Dash () {
  // console.log("Dash component is rendering...");
  const location = useLocation(); // Pour voir l'URL active
  // console.log("Current Route:", location.pathname);
  const navigate = useNavigate(); // Utilisation du hook useNavigate pour la redirection

  const { user, logout, isAuthenticated } = useAuth0();
  const handleLogout = () => {
    
    // Actions pour la déconnexion
    navigate('/'); // Redirection vers la page d'accueil
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* ... sidebar code ... */}
        <div className="sidebar-header">
          <img
            className="organisation-logo"
            alt="Organization Logo"
            src="/ChatGPT Image 7 avr. 2025, 12_44_05.png" // Image de l'organisation
          />
        </div>
        <div className="sidebar-item">
          <Link to="/admin/dashboard" className="link">
            <FaHome className="icon" />
            <span>Dashboard</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/courses" className="link">
            <FaShoppingCart className="icon" />
            <span>Create a Course</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/profile" className="link">
            <AiOutlineUser className="icon" />
            <span>My Profile</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/note" className="link">
            <FaLink className="icon" />
            <span>Note</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/create_user" className="link">
            <FaChild className="icon" />
            <span>Create a User</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/chats" className="link">
            <FaLink className="icon" />
            <span>Chats</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/calendars" className="link">
            <FaCalendarAlt className="icon" />
            <span>Calendars</span>
          </Link>
        </div><hr />
        <div className="sidebar-item">
          <Link to="/admin/notificatoin" className="link">
            <FaBell className="icon" />
            <span>Notification</span>
          </Link>
        </div><hr />
        <button onClick={handleLogout} className="logout-btn">
          <AiOutlineLogout className="icon" />
          <span>      <span onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </span></span>
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* 🔥 Header global visible sur toutes les pages */}
        <div className="content-header">
          <Header />
        </div>
        {/* Pages dynamiques */}
         <Outlet /> {/* 🔥 C'est ici que les sous-pages seront affichées */}
        
      </div>
    </div>
  );
};
export { Admin, Dash };