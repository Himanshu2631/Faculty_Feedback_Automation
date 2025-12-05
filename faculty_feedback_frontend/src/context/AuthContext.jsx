import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Ensure role is set if missing (for backward compatibility)
                if (!parsedUser.role) {
                    // Try to infer role from token type or set default
                    if (localStorage.getItem("adminToken")) {
                        parsedUser.role = 'admin';
                    } else if (localStorage.getItem("studentToken")) {
                        parsedUser.role = 'student';
                    }
                    // Update localStorage with role
                    localStorage.setItem("user", JSON.stringify(parsedUser));
                }
                setUser(parsedUser);
            }
        }
        setLoading(false);
    }, [token]);

    // -----------------------------
    // LOGIN (Student & Admin)
    // -----------------------------
    const login = async (credentials, role) => {
        try {
            const endpoint = role === 'admin'
                ? "/auth/admin/login"
                : "/auth/student/login";

            const response = await api.post(endpoint, credentials);

            const { token, student, admin } = response.data;
            const userData = role === 'admin' ? admin : student;

            if (!userData) {
                console.error('No user data in response:', response.data);
                return { success: false, message: "Invalid response from server" };
            }

            if (!token) {
                console.error('No token in response:', response.data);
                return { success: false, message: "No authentication token received" };
            }

            // Add role property to userData
            userData.role = role;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            // Also set specific tokens if needed for legacy support, though 'token' is primary now
            if (role === 'admin') localStorage.setItem("adminToken", token);
            else localStorage.setItem("studentToken", token);

            setToken(token);
            setUser(userData);
            setLoading(false);

            console.log('Login successful, user:', userData);
            console.log('Token set:', token);

            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: err.response?.data?.message || err.message || "Login failed" };
        }
    };

    // -----------------------------
    // STUDENT SIGNUP
    // -----------------------------
    const signup = async (data) => {
        try {
            const response = await api.post("/auth/student/signup", data);

            // Only auto-login if backend returns a token
            if (response.data.token) {
                const { token, student } = response.data;
                const userData = student;
                userData.role = 'student';

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("studentToken", token);

                setToken(token);
                setUser(userData);
                setLoading(false);
            }

            return { success: true };
        } catch (err) {
            console.error('Signup error:', err);
            return {
                success: false,
                message: err.response?.data?.message || err.message || "Signup failed"
            };
        }
    };

    // -----------------------------
    // LOGOUT
    // -----------------------------
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("studentToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
                    <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
