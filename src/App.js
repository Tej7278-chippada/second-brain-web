import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Psychology, Storage, Chat, CloudUpload } from '@mui/icons-material';
import { theme } from './theme/theme';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import MemoryManager from './components/MemoryManager';
import DataVisualizer from './components/DataVisualizer';
import { secondBrainAPI } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [systemStatus, setSystemStatus] = useState({
    documents: 0,
    memories: 0,
    isConnected: false,
    loading: true
  });

  React.useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const status = await secondBrainAPI.getStatus();
      setSystemStatus({
        documents: status.documents || 0,
        memories: status.memories || 0,
        isConnected: true,
        loading: false
      });
    } catch (error) {
      setSystemStatus(prev => ({
        ...prev,
        isConnected: false,
        loading: false
      }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'upload':
        return <FileUpload onUploadSuccess={checkSystemStatus} />;
      case 'memories':
        return <MemoryManager />;
      case 'data':
        return <DataVisualizer />;
      default:
        return <ChatInterface />;
    }
  };

  const tabConfig = [
    { id: 'chat', label: 'Chat', icon: <Chat /> },
    { id: 'upload', label: 'Upload Files', icon: <CloudUpload /> },
    { id: 'memories', label: 'Memories', icon: <Storage /> },
    { id: 'data', label: 'Data View', icon: <Psychology /> }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Psychology sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Second Brain AI
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {systemStatus.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <Chip 
                    label={`${systemStatus.documents} docs`}
                    size="small"
                    color={systemStatus.isConnected ? "success" : "error"}
                    variant="outlined"
                  />
                  <Chip 
                    label={`${systemStatus.memories} memories`}
                    size="small"
                    color={systemStatus.isConnected ? "success" : "error"}
                    variant="outlined"
                  />
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {!systemStatus.isConnected && !systemStatus.loading && (
          <Alert severity="warning" sx={{ m: 2 }}>
            Unable to connect to Second Brain backend. Please ensure the Python server is running.
          </Alert>
        )}

        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Sidebar Navigation */}
            <Grid item xs={12} md={3}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Navigation
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {tabConfig.map((tab) => (
                    <Paper
                      key={tab.id}
                      elevation={activeTab === tab.id ? 2 : 0}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: activeTab === tab.id ? 'primary.light' : 'background.default',
                        color: activeTab === tab.id ? 'primary.contrastText' : 'text.primary',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: activeTab === tab.id ? 'primary.light' : 'action.hover',
                        }
                      }}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tab.icon}
                        <Typography variant="body1">
                          {tab.label}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <Paper elevation={1} sx={{ p: 3, minHeight: '70vh' }}>
                {renderContent()}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;