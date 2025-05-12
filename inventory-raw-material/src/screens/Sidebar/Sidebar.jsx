import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className='uppermenu'>
          <NavLink
            to="/Dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/AllDefective"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            All Defective
          </NavLink>
          <NavLink
            to="/Bom"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            Bom
          </NavLink>
          <NavLink
            to="/InsufficientRawMaterials"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            Insufficient Raw Materials
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
