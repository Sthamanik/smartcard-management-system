import React, { useState, useEffect } from 'react';
import attendanceContext from './attendanceContext';
import axios from 'axios';

// Provider component
const AttendanceProvider = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all attendance records and dates
  const fetchAllAttendanceData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/attendance/all`);
      setAttendanceData(response.data);

      // Extract unique dates from the attendance data
      const uniqueDates = Array.from(
        new Set(response.data.map(record => new Date(record.date).toISOString().split('T')[0]))
      );
      setDates(uniqueDates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance records for a specific date
  const fetchAttendanceByDate = async (date) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_HOST}/attendance/${date}`);
      setAttendanceData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark entry for a user
  const markEntry = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${import.meta.env.VITE_HOST}/markEntry/${userId}`);
      // Update attendance data with the response
      setAttendanceData(prevData =>
        prevData.map(record =>
          record.userId === userId ? response.data : record
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark exit for a user
  const markExit = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${import.meta.env.VITE_HOST}/markExit/${userId}`);
      // Update attendance data with the response
      setAttendanceData(prevData =>
        prevData.map(record =>
          record.userId === userId ? response.data : record
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch all data on mount
  useEffect(() => {
    fetchAllAttendanceData();
  }, []);

  // Effect to fetch data when the selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceByDate(selectedDate);
    }
  }, [selectedDate]);

  const value = {
    attendanceData,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    fetchAttendanceByDate,
    markEntry,
    markExit,
  }

  return (
    <attendanceContext.Provider value={value}>
      {children}
    </attendanceContext.Provider>
  );
};

export default AttendanceProvider;
