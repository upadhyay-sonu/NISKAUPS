import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  // If token exists, render the protected component
  if (token) {
    return children;
  }

  // If no token, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
