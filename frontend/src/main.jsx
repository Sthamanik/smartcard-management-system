import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './contexts/auth/authState'; // Ensure this import is correct
import './index.css';
import FeeProvider from './contexts/fees/feeState';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FeeProvider>
      <App />
      </FeeProvider>
    </AuthProvider>
  </React.StrictMode>
);
