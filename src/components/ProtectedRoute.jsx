import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to /login preserving intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required (e.g., admin only)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    // If cashier tries to visit admin routes, redirect to POS Terminal
    if (currentUser?.role === 'cashier') {
      return <Navigate to="/" replace />;
    }
    // Fallback redirect to /admin for admin
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
