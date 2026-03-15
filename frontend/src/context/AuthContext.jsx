import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate();

    const checkAuth = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`,{
                withCredentials: true
            })

            if (response.data.success) {
                setUser(response.data.user)
                setIsAuthenticated(true)
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      checkAuth();
    }, [])
    
    const login = ({ userData }) => {
        setUser(userData);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`,{
                withCredentials: true
            })

            if (response.data.success) {
                navigate('/login',{
                    state: { logoutSuccess: true }
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;