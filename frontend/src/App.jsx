import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminPage from './components/admin_components/AdminPage';
import Staffpanel from './components/staff_panel/Staffpanel';
import UserInterface from './components/userPanel/userInterface';
import AttendancePortal from './components/admin_components/AttendancePortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/adminPage/*" element={<AdminPage />} />
        <Route path="/staffPage/*" element={<Staffpanel />} />
        <Route path="/userInterface/*" element={<UserInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
