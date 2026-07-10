import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
  >
    <i className={`bi bi-${icon}`}></i>
    <span>{label}</span>
  </NavLink>
);

const Sidebar = ({ open }) => {
  const { logout } = useAuth();

  return (
    <aside className={`admin-sidebar${open ? '' : ' collapsed'}`}>
      <div className="sidebar-brand">
        <img src={assets.logo} alt="BiteRush" />
        <span>BiteRush</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <NavItem to="/dashboard" icon="speedometer2" label="Dashboard" />
        <NavItem to="/list"      icon="grid"         label="Menu" />
        <NavItem to="/orders"    icon="bag-check"    label="Orders" />
        <NavItem to="/add"       icon="plus-circle"  label="Add Food" />
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-link" onClick={logout}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
        <div className="sidebar-user">
          <div className="sidebar-avatar">A</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
