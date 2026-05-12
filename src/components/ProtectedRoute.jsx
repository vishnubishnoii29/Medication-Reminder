import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Guards routes by:
 * 1. Checking token existence
 * 2. Checking token expiry (client-side, without verifying signature)
 * 3. Optionally enforcing admin role
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check token expiry by parsing the JWT payload (base64)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  } catch {
    // Malformed token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // Role-based guard for admin routes
  if (requireAdmin) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
