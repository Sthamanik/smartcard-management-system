import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './contexts/auth/authState';
import './index.css';
import FeeProvider from './contexts/fees/feeState';
import AttendanceProvider from './contexts/attendance/attendanceState';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FeeProvider>
        <AttendanceProvider>
          <App />
        </AttendanceProvider>
      </FeeProvider>
    </AuthProvider>
  </React.StrictMode>
);
