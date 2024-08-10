import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Admin Panel
        </div>
        <div className="flex space-x-4">
          <Link to="/adminPage/" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
            Register Portal
          </Link>
          <Link to="/adminPage/qr" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
            QR Portal
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-white hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
