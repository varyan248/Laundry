import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkLoginInfo = () => {
        const token = localStorage.getItem('userToken');
        const userInfo = localStorage.getItem('userInfo');
        if (token && userInfo && userInfo !== 'undefined') {
            try {
                setUser(JSON.parse(userInfo));
            } catch (e) {
                console.error("Invalid user info in storage", e);
                localStorage.removeItem('userToken');
                localStorage.removeItem('userInfo');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkLoginInfo();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const register = async (name, email, password, phone, address) => {
        const { data } = await axios.post('http://localhost:5000/api/users/register', { name, email, password, phone, address });
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
