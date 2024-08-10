import React from 'react';
import RegisterPortal from './RegisterPortal';
import QrPortal from './QrPortal';
import AdminNavbar from './AdminNavbar';
import { Routes, Route } from 'react-router-dom';

const AdminPage = () => {
  return (
    <>
      <AdminNavbar />
      <Routes>
        <Route path="/" element={<RegisterPortal />} /> 
        <Route path="/qr" element={<QrPortal />} /> 
      </Routes>
    </>
  );
};

export default AdminPage;
