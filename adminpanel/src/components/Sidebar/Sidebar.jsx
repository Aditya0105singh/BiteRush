import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ sidebarVisible }) => {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  const link = (to, icon, label) => (
    <Link
      className={`list-group-item list-group-item-action list-group-item-light p-3 ${pathname === to ? 'active' : ''}`}
      to={to}
    >
      <i className={`bi bi-${icon} me-2`}></i>{label}
    </Link>
  );

  return (
    <div className={`border-end bg-white ${sidebarVisible ? '' : 'd-none'}`} id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light d-flex align-items-center gap-2 px-3">
        <img src={assets.logo} alt="" height={32} width={32} />
        <span style={{ fontWeight: 700, color: '#fc8019', fontSize: '1rem' }}>BiteRush</span>
      </div>
      <div className="list-group list-group-flush">
        {link('/dashboard', 'speedometer2', 'Dashboard')}
        {link('/add',       'plus-circle',  'Add Food')}
        {link('/list',      'list-ul',      'Food List')}
        {link('/orders',    'bag-check',    'Orders')}
        <button
          className="list-group-item list-group-item-action list-group-item-light p-3 text-danger border-0 text-start bg-white"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-left me-2"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
