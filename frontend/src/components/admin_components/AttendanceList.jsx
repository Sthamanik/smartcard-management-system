import React, { useContext, useEffect } from 'react';
import attendanceContext from '../../contexts/attendance/attendanceContext'; // Adjust the path as needed

const AttendanceList = () => {
  const {
    attendanceData,
    dates,
    selectedDate,
    setSelectedDate,
    loading,
    error,
    fetchAttendanceByDate,
  } = useContext(attendanceContext);

  // Fetch data when the selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceByDate(selectedDate);
    }
  }, [selectedDate, fetchAttendanceByDate]);

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Attendance List</h2>

      {/* Date selection */}
      <div>
        <label htmlFor="date">Select Date: </label>
        <select id="date" value={selectedDate} onChange={handleDateChange}>
          <option value="">Select a date</option>
          {dates.map(date => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance data table */}
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Status</th>
            <th>Entered At</th>
            <th>Exited At</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map(record => (
              <tr key={record._id}>
                <td>{record.userId}</td>
                <td>{record.status}</td>
                <td>{record.enteredAt}</td>
                <td>{record.exitedAt}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
