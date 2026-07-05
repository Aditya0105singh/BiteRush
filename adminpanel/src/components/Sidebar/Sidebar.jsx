import React from 'react';
import { Link } from 'react-router-dom';
import {assets} from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({sidebarVisible}) => {
  const { logout } = useAuth();

  return (
    <div className={`border-end bg-white ${sidebarVisible ? '': 'd-none'}`} id="sidebar-wrapper">
        <div className="sidebar-heading border-bottom bg-light">
            <img src={assets.logo} alt="" height={32} width={32}/>
        </div>
        <div className="list-group list-group-flush">
            <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/add">
            <i className='bi bi-plus-circle me-2'></i> Add Food</Link>
            <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/list">
            <i className='bi bi-list-ul me-2'></i> List Food</Link>
            <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/orders">
            <i className='bi bi-cart me-2'></i> Orders</Link>
            <button className="list-group-item list-group-item-action list-group-item-light p-3 text-danger border-0 text-start bg-white" onClick={logout}>
            <i className='bi bi-box-arrow-left me-2'></i> Logout</button>
        </div>
    </div>
  )
}

export default Sidebar;