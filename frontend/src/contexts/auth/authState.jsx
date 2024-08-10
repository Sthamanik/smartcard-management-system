import React, { useState } from "react";
import AuthContext from "./authContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const url = import.meta.env.VITE_HOST; // Ensure this environment variable is set correctly

  const [user, setUser] = useState(null);

  // Signup function
  const signupUser = async (userData) => {
    try {
      const response = await axios.post(`${url}/auth/signup`, userData);
      return response.data; // Directly return response data
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const value = {
    user,
    signupUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
