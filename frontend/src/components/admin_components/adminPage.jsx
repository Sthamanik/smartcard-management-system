import React from 'react';
import RegisterPortal from './RegisterPortal';
import QrPortal from './QrPortal';
import AdminNavbar from './AdminNavbar';
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import FeeList from './Feelist';
import AttendanceList from './AttendanceList';
import AttendancePortal from './AttendancePortal';

const AdminPage = () => {
  return (
    <>
      <AdminNavbar />
      <Routes>
        <Route path="/" element={<RegisterPortal />} /> 
        <Route path="/qr" element={<QrPortal />} /> 
        <Route path="/userlist" element={<UserList />} /> 
        <Route path="/feelist" element={<FeeList />} /> 
        <Route path="/attendancelist" element={<AttendanceList />} /> 
        <Route path="/attendancePortal" element={<AttendancePortal />} />
      </Routes>
    </>
  );
};

export default AdminPage;
