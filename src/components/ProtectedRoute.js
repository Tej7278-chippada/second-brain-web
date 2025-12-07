// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import { authServices } from '../services/api';

const ProtectedRoute = ({ children, isAuthenticated: initialAuth }) => {
  const [authStatus, setAuthStatus] = React.useState({
    loading: true,
    isAuthenticated: initialAuth || false,
    error: null
  });

  React.useEffect(() => {
    const validateAuth = async () => {
      try {
        const result = await authServices.validateToken();
        setAuthStatus({
          loading: false,
          isAuthenticated: result.valid,
          error: result.valid ? null : 'Session expired'
        });
      } catch (error) {
        setAuthStatus({
          loading: false,
          isAuthenticated: false,
          error: 'Authentication failed'
        });
      }
    };

    if (initialAuth === undefined) {
      validateAuth();
    } else {
      setAuthStatus({
        loading: false,
        isAuthenticated: initialAuth,
        error: initialAuth ? null : 'Not authenticated'
      });
    }
  }, [initialAuth]);

  const handleRetry = () => {
    setAuthStatus({ loading: true, isAuthenticated: false, error: null });
    window.location.reload();
  };

  if (authStatus.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authStatus.isAuthenticated) {
    // Show error message before redirecting
    return (
      <Box sx={{ p: 3, maxWidth: 400, margin: '100px auto' }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {authStatus.error || 'Authentication required'}
        </Alert>
        {/* Auto-redirect after showing message */}
        {setTimeout(() => {
          window.location.href = '/login';
        }, 2000)}
        <Navigate to="/login" replace />
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;