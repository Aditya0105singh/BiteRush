import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/add': 'Add Food',
  '/list': 'Food Menu',
  '/orders': 'Orders',
};

const AppContent = () => {
  const { token, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'BiteRush';

  if (!token) return <Login />;

  return (
    <div className="admin-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`admin-main ${sidebarOpen ? '' : 'full'}`}>
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="topbar-toggle" onClick={() => setSidebarOpen(v => !v)}>
              <i className="bi bi-list"></i>
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-badge">
              <i className="bi bi-bell"></i>
              <span className="badge-dot"></span>
            </button>
            <button className="topbar-badge" onClick={logout} title="Logout">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </header>

        <ToastContainer position="top-right" autoClose={2500} />

        <main className="admin-content">
          <Routes>
            <Route path='/'         element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/add'      element={<AddFood />} />
            <Route path='/list'     element={<ListFood />} />
            <Route path='/orders'   element={<Orders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
