import React, { useState, useEffect } from "react";
import AuthContext from "./authContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const url = import.meta.env.VITE_HOST;

  const [user, setUser] = useState(null); // Current logged-in user
  const [users, setUsers] = useState([]); // List of all users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Signup function
  const signupUser = async (userData) => {
    try {
      const response = await axios.post(`${url}/auth/signup`, userData);
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response?.data || "Signup failed");
      throw error;
    }
  };

  // Login function
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${url}/auth/login`, credentials);
      setUser(response.data.user);
      localStorage.setItem('authToken', response.data.authToken);
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response?.data || "Login failed");
      throw error;
    }
  };

  // Logout function
  const logoutUser = async () => {
    try {
      await axios.post(`${url}/auth/logout`);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error.response?.data || "Logout failed");
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.put(`${url}/auth/changepass`, passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error during password change:", error);
      setError(error.response?.data || "Password change failed");
      throw error;
    }
  };

  // Fetch user details function
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/auth/getUsers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(error.response?.data || "Fetch failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user details function
  const updateUserDetails = async (userId, updatedData) => {
    try {
      const response = await axios.put(`${url}/auth/updateData/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      setError(error.response?.data || "Update failed");
      throw error;
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${url}/auth/deleteData/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.response?.data || "Delete failed");
      throw error;
    }
  };

  const value = {
    user,
    users,
    signupUser,
    loginUser,
    logoutUser,
    changePassword,
    fetchUserDetails,
    updateUserDetails,
    deleteUser,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
