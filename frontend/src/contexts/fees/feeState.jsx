import React, { useState, useEffect, useCallback } from "react";
import feeContext from "./feeContext";
import axios from "axios";

const FeeProvider = ({ children }) => {
  const url = import.meta.env.VITE_HOST; // Ensure this matches your environment setup

  const [fees, setFees] = useState([]); // List of all fee records
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all fee records
  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/fees`);
      setFees(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setError(error.response?.data || "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Fetch fees by user ID
  const fetchFeesByUserId = useCallback(async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/fees/${userId}`);
      setFees(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching fees by user ID:", error);
      setError(error.response?.data || "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Update fee information
  const updateFee = useCallback(async (userId, feeData) => {
    try {
      const response = await axios.put(`${url}/fees/updateFee/${userId}`, feeData);
      setError(null);
      return response.data;
    } catch (error) {
      console.error("Error updating fee:", error);
      setError(error.response?.data || "Update failed");
      throw error;
    }
  }, [url]);

  const value = {
    fees,
    fetchFees,
    fetchFeesByUserId,
    updateFee,
    loading,
    error,
  };

  return (
    <feeContext.Provider value={value}>
      {children}
    </feeContext.Provider>
  );
};

export default FeeProvider;
