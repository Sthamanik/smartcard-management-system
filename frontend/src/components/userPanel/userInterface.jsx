import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// Access the VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_HOST;

const UserInterface = () => {
    const [userData, setUserData] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [feeRecords, setFeeRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('authToken'); // Adjust according to where your token is stored

    // Function to get user data
    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/getUserData`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        }
    }, [token]);

    // Function to get attendance records
    const fetchAttendanceRecords = useCallback(async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/attendance/${userId}`);
            console.log('Attendance Records:', response.data); // Print attendance records to console
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            setError('Failed to load attendance records');
        }
    }, []);

    // Function to get fee records
    const fetchFeeRecords = useCallback(async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/fees/${userId}`);
            console.log('Fee Records:', response.data); // Print fee records to console
            setFeeRecords(response.data);
        } catch (error) {
            console.error('Error fetching fee records:', error);
            setError('Failed to load fee records');
        }
    }, []);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchUserData();
        };
        fetchData();
    }, [fetchUserData]);

    // Fetch attendance and fee records when userData changes
    useEffect(() => {
        if (userData) {
            fetchAttendanceRecords(userData._id);
            fetchFeeRecords(userData._id);
        }
    }, [userData, fetchAttendanceRecords, fetchFeeRecords]);

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>
            {loading && <p className="text-lg text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-4">User Information</h2>
                {userData ? (
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Contact:</strong> {userData.contact}</p>
                        <p><strong>Address:</strong> {userData.address}</p>
                        <p><strong>DOB:</strong> {userData.DOB}</p>
                        <p><strong>Gender:</strong> {userData.gender}</p>
                        <p><strong>Role:</strong> {userData.role}</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-4">Attendance Records</h2>
                {attendanceRecords.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold">Date</th>
                                <th className="p-3 text-left text-sm font-semibold">Status</th>
                                <th className="p-3 text-left text-sm font-semibold">Entered At</th>
                                <th className="p-3 text-left text-sm font-semibold">Exited At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-sm">{record.status}</td>
                                    <td className="p-3 text-sm">{record.enteredAt !== '-' ? record.enteredAt : '-'}</td>
                                    <td className="p-3 text-sm">{record.exitedAt !== '-' ? record.exitedAt : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No attendance records found.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-4">Fee Records</h2>
                {feeRecords.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold">Date</th>
                                <th className="p-3 text-left text-sm font-semibold">Total Fee</th>
                                <th className="p-3 text-left text-sm font-semibold">Amount Paid</th>
                                <th className="p-3 text-left text-sm font-semibold">Amount Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeRecords.map((record, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-sm">{record.totalFee}</td>
                                    <td className="p-3 text-sm">{record.amountPaid}</td>
                                    <td className="p-3 text-sm">{record.amountDue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No fee records found.</p>
                )}
            </div>
        </div>
    );
};

export default UserInterface;
