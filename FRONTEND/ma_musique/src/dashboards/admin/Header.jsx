import React from 'react';
import './header.css'; // Importation du fichier CSS pour le style
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">

        <div className="organisation-info">
          <span className="notification-icon"><Link to="/admin/notificatoin" className="link">🔔</Link></span> 
          <span className="org-name">Dongueu Feyem . c</span>
            <img
            className="organisation-avatar"
            alt="Organization Logo"
            src="/mon_prof.jpg" // Image de l'organisation
            />
        </div>
    </div>
  );
};

export default Header;
