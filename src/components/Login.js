// src/components/Login.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleOAuth from './GoogleOAuth';
import { authServices } from '../services/api';
// import PsychologyIcon from '@mui/icons-material/Psychology';

const Login = ({ onLogin, isMobile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkAuthStatus = useCallback( async () => {
    try {
      const result = await authServices.validateToken();
      if (result.valid) {
        onLogin(result);
        navigate('/');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate, onLogin]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleGoogleSuccess = async (response) => {
    try {
      // Store auth token
      localStorage.setItem('authToken', response.authToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Notify parent component
      onLogin(response);
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Login processing failed:', err);
      setError('Failed to process login. Please try again.');
      setRetryCount(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: { xs: 4, md: 8 },
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 3, md: 4 }, 
          width: '100%',
          borderRadius: 2
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            {/* <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} /> */}
            <img 
              src="/logo/logoanim.svg" 
              alt="Second Brain Logo" 
              style={{ 
                width: isMobile ? 80 : 80, 
                height: isMobile ? 80 : 80,
                marginRight: 4 
              }} 
            />
            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
              Second Brain
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Your personal AI-powered knowledge assistant
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom align="center">
            Sign In to Continue
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }} align="center">
            Access your personal knowledge base and AI assistant
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                retryCount < 3 && (
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    Retry
                  </Button>
                )
              }
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <GoogleOAuth 
              onSuccess={handleGoogleSuccess}
              onError={setError}
            />
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              By signing in, you agree to our{' '}
              <Typography component="span" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Terms of Service
              </Typography>{' '}
              and{' '}
              <Typography component="span" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Privacy Policy
              </Typography>
            </Typography>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Need help? Contact support@secondbrain.ai
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;