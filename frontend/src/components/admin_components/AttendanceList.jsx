import React, { useContext, useEffect } from 'react';
import attendanceContext from '../../contexts/attendance/attendanceContext'; 
import AuthContext from '../../contexts/auth/authContext';

const AttendanceList = () => {
  const { attendanceData, fetchAttendanceByDate, loading: attendanceLoading, error: attendanceError, dates, selectedDate, setSelectedDate } = useContext(attendanceContext);
  const { users, fetchUserDetails, loading: usersLoading, error: usersError } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserDetails(); // Fetch user details
        if (selectedDate) {
          await fetchAttendanceByDate(selectedDate); // Fetch attendance data for the selected date
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data if users or attendanceData is empty
    if (!users.length || !attendanceData.length) {
      fetchData();
    }
  }, [fetchAttendanceByDate, fetchUserDetails, selectedDate, users.length, attendanceData.length]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  if (attendanceLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  if (attendanceError || usersError) {
    return <div>{attendanceError || usersError}</div>;
  }

  // Create a lookup for users by userId
  const userMap = users.reduce((map, user) => {
    map[user._id] = user;
    return map;
  }, {});

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold my-4">Attendance List</h2>

      {/* Date selection */}
      <div className="mb-4">
        <label htmlFor="date" className="mr-2">Select Date:</label>
        <select id="date" value={selectedDate} onChange={handleDateChange}>
          <option value="">Select a date</option>
          {dates.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">Faculty</th>
              <th className="px-4 py-2 text-left">UID</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Entered At</th>
              <th className="px-4 py-2 text-left">Exited At</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map(record => {
                const user = userMap[record.userId]; // Get the user details
                return (
                  <tr key={record._id} className="border-t border-gray-200">
                    <td className="px-4 py-2">{user ? user.name : 'N/A'}</td>
                    <td className="px-4 py-2">{user ? user.role : 'N/A'}</td>
                    <td className="px-4 py-2">{user && user.role === 'user' ? user.batch : 'N/A'}</td>
                    <td className="px-4 py-2">{user && user.role === 'user' ? user.faculty : 'N/A'}</td>
                    <td className="px-4 py-2">{user && user.role === 'user' ? user.uid : 'N/A'}</td>
                    <td className="px-4 py-2">{record.status}</td>
                    <td className="px-4 py-2">{record.enteredAt}</td>
                    <td className="px-4 py-2">{record.exitedAt}</td>
                    <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-2">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
