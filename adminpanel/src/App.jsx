import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';
import Login from './pages/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = () => {
  const { token } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  if (!token) return <Login />;

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar sidebarVisible={sidebarVisible} />
      <div id="page-content-wrapper">
        <Menubar toggleSidebar={() => setSidebarVisible(v => !v)} />
        <ToastContainer />
        <div className="container-fluid">
          <Routes>
            <Route path='/add' element={<AddFood />} />
            <Route path='/list' element={<ListFood />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/' element={<ListFood />} />
          </Routes>
        </div>
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
