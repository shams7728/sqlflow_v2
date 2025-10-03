import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        isGuest: localStorage.getItem('isGuest') === 'true' // Add guest state
    });

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        const isGuest = localStorage.getItem('isGuest') === 'true';

        if (token) {
            try {
                // Verify token and get user data
                const userData = await api.getCurrentUser();
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: true,
                    loading: false,
                    user: userData.user,
                    isGuest: false // Ensure guest is false when authenticated
                }));
            } catch (err) {
                console.error('Failed to load user:', err);
                localStorage.removeItem('token');
                setAuthState({
                    token: null,
                    isAuthenticated: false,
                    loading: false,
                    user: null,
                    isGuest: false
                });
            }
        } else if (isGuest) {
            // Handle guest mode
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: true, // Treat guests as authenticated for routing
                loading: false,
                isGuest: true,
                user: {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    isGuest: true
                }
            }));
        } else {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                isAuthenticated: false,
                isGuest: false
            }));
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = useCallback(async (email, password) => {
        try {
            const data = await api.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.removeItem('isGuest'); // Clear guest mode on login
            setAuthState({
                token: data.token,
                isAuthenticated: true,
                loading: false,
                user: data.user, // Store user data from response
                isGuest: false
            });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, []);

    const register = useCallback(async (email, password, name) => {
        try {
            const data = await api.register(email, password, name);
            localStorage.setItem('token', data.token);
            localStorage.removeItem('isGuest'); // Clear guest mode on register
            setAuthState({
                token: data.token,
                isAuthenticated: true,
                loading: false,
                user: data.user, // Store user data from response
                isGuest: false
            });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('isGuest');
        setAuthState({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
            isGuest: false
        });
    }, []);

    // Update the setGuestMode function in AuthContext.jsx
    const setGuestMode = useCallback(() => {
        localStorage.setItem('isGuest', 'true');
        localStorage.removeItem('token'); // Clear any existing token
        setAuthState({
            token: null,
            isAuthenticated: true, // Treat guests as authenticated
            loading: false,
            user: null,
            isGuest: true
        });
    }, []);

    const updateProfile = useCallback(async (profileData) => {
        try {
            if (authState.isGuest) {
                // For guest users, just update the local state
                setAuthState(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        ...profileData
                    }
                }));
                return { success: true, message: 'Profile updated locally (Guest mode)' };
            }

            const data = await api.updateProfile(profileData);
            setAuthState(prev => ({
                ...prev,
                user: data.user
            }));
            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }, [authState.isGuest]);

    const authContextValue = React.useMemo(() => ({
        ...authState,
        login,
        register,
        logout,
        setGuestMode,
        updateProfile,
    }), [authState, login, register, logout, setGuestMode, updateProfile]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);