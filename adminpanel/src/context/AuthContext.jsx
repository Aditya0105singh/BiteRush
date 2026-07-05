import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const jwt = response.data.token;
        localStorage.setItem('admin_token', jwt);
        setToken(jwt);
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
