import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(!!token);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
    };

    const register = async (name, email, password) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/register`, { name, email, password });
        await login(email, password);
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`${import.meta.env.VITE_API_URL}/user/profile`)
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token, logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
