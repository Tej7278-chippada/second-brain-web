// src/App.js
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { theme } from './theme/theme';
import { authServices } from './services/api';

// Import components
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import SecondBrainApp from './components/SecondBrainApp';
import './App.css';
import { ChatProvider } from './contexts/ChatContext';

// Loading component
const LoadingScreen = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <CircularProgress />
  </Box>
);

// Main App component
function AppContent() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const result = await authServices.validateToken();
      setIsAuthenticated(result.valid);
      if (result.valid) {
        setUser(result.user);
      }
      // console.log('Authentication check result:', result);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData.user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
    // console.log('User logged out');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : 
          <Login onLogin={handleLogin} isMobile={isMobile}/>
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ChatProvider user={user}> {/* Wrap with ChatProvider */}
              <Header user={user} onLogout={handleLogout} isMobile={isMobile}/>
              <Container maxWidth="md" sx={{ flex: 1, px: 1, py: 2 }}>
                <SecondBrainApp user={user} isMobile={isMobile}/>
              </Container>
            </ChatProvider>
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;