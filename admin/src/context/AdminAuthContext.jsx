import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setAdmin({ token });
        }
        setLoading(false);

        // Auto-logout on 401 Unauthorized
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    setAdmin(null);
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/api/admin/login`, { email, password });
        localStorage.setItem('adminToken', data.token);
        setAdmin(data);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};
