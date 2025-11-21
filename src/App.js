// src/App.js
import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  // AppBar,
  // Toolbar,
  // Typography,
  Container,
  // Grid,
  // Paper,
  Box,
  // Chip,
  Alert,
  // CircularProgress,
  ToggleButtonGroup,
  // useTheme,
  useMediaQuery,
  // Tooltip,
  ToggleButton
} from '@mui/material';
import { Storage, Chat, CloudUpload } from '@mui/icons-material'; // Psychology,
import { theme } from './theme/theme';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import MemoryManager from './components/MemoryManager';
import DataVisualizer from './components/DataVisualizer';
import { secondBrainAPI } from './services/api';
import './App.css';
import Header from './components/Header';
import styled from '@emotion/styled';
// import { NotificationAdd } from '@mui/icons-material';
// import axios from "axios";


// Styled components
const AnimatedToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '24px',
  padding: '4px',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)',
  '& .MuiToggleButton-root': {
    position: 'relative',
    zIndex: 1,
    border: 'none',
    transition: 'all 0.3s ease',
  }
}));

const SliderThumb = styled(Box)(({ theme, position }) => ({
  position: 'absolute',
  top: '4px',
  left: position === 'first' ? '4px' : position === 'second' ? '24.5%' : '49%',
  width: '50%',
  height: 'calc(100% - 8px)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(67, 97, 238, 0.7)' 
    : '#4361ee',
  borderRadius: '22px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 0,
}));

function App({darkMode}) {
  const [activeTab, setActiveTab] = useState('chat');
  const [systemStatus, setSystemStatus] = useState({
    documents: 0,
    memories: 0,
    isConnected: false,
    loading: true
  });
  // const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  // function to handle sort change
  const handleActiveTab = (postType) => {
    setActiveTab(postType);
    // setShowPostType(false);
    // setShowDistanceRanges(false);
    // Update filters
    // const newFilters = { 
    //   ...filters,
    //   postType: postType
    // };

    // setFilters(newFilters);
    // setLocalFilters(newFilters);
    // setSkip(0);
    // Clear cache to force refetch with new sort order
    // globalCache.lastCacheKey = null;
    // // Ensure filters are saved to localStorage
    // localStorage.setItem('helperFilters', JSON.stringify(newFilters));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface isMobile={isMobile}/>;
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

  // const tabConfig = [
  //   { id: 'chat', label: 'Chat', icon: <Chat /> },
  //   { id: 'upload', label: 'Upload Files', icon: <CloudUpload /> },
  //   { id: 'memories', label: 'Memories', icon: <Storage /> },
  //   { id: 'data', label: 'Data View', icon: <Psychology /> }
  // ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* <AppBar position="static" elevation={2}>
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
        </AppBar> */}
        <Header isMobile={isMobile}/>
          {/* Type Selection Toggle with Slider Animation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mt: 2 }}>
              <AnimatedToggleButtonGroup
                value={activeTab}
                exclusive
                // onChange={handleTypeChange}
                aria-label="post type selection"
                sx={{
                  minWidth: isMobile ? '320px' : '320px',
                  '& .MuiToggleButton-root': {
                    px: 1,
                    py: 1,
                    width: '50%',
                    borderRadius: '18px',
                    fontWeight: 600,
                    fontSize: isMobile ? '0.875rem' : '0.9rem',
                    '&.Mui-selected': {
                      backgroundColor: 'transparent',
                      color: darkMode ? '#fff' : '#fff',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      }
                    },
                    '&:not(.Mui-selected)': {
                      color: !darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      width: '25%',
                      borderRadius: '22px',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      borderRadius: '22px',
                    }
                  }
                }}
              >
                {/* <Tooltip title="Chat with Brain" arrow> */}
                <ToggleButton
                  value="chat" 
                  aria-label="Chat with Brain"
                  // Prevent default to avoid auto-scrolling
                  onClick={() => handleActiveTab('chat')}
                  sx={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',  // prevents text wrapping
                    gap: 0.5,              // small spacing between icon & text
                    width: '100%',         // ensures consistent width
                  }}
                >
                  <Chat sx={{ mr: activeTab === 'chat' ? 1 : null, fontSize: '22px' }} />
                  {activeTab === 'chat' ? 'Chat with Brain' : ''}
                </ToggleButton>
                {/* </Tooltip> */}
                {/* <Tooltip title="Upload Files" arrow> */}
                <ToggleButton 
                  value="upload" 
                  aria-label="Upload Files"
                  // Prevent default to avoid auto-scrolling
                  onClick={() => handleActiveTab('upload')}
                  sx={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',  // prevents text wrapping
                    gap: 0.5,              // small spacing between icon & text
                    width: '100%',         // ensures consistent width
                  }}
                >
                  <CloudUpload sx={{ mr: activeTab === 'upload' ? 1 : null, fontSize: '22px' }} />
                  {activeTab === 'upload' ? 'Upload Files' : ''}
                </ToggleButton>
                {/* </Tooltip> */}
                {/* <Tooltip title="Memories" arrow> */}
                <ToggleButton 
                  value="memories" 
                  aria-label="Memories"
                  // Prevent default to avoid auto-scrolling
                  onClick={() => handleActiveTab('memories')}
                  sx={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',  // prevents text wrapping
                    gap: 0.5,              // small spacing between icon & text
                    width: '100%',         // ensures consistent width
                  }}
                >
                  <Storage sx={{ mr: activeTab === 'memories' ? 1 : null, fontSize: '22px' }} />
                  {activeTab === 'memories' ? 'Memories' : ''}
                </ToggleButton>
                {/* </Tooltip> */}
                {/* Slider thumb for animation */}
                <SliderThumb position={activeTab === 'chat' ? 'first' : activeTab === 'upload' ? 'second' : 'third'} />
              </AnimatedToggleButtonGroup>
            </Box>
        {!systemStatus.isConnected && !systemStatus.loading && (
          <Alert severity="warning" sx={{ m: 2 }}>
            Unable to connect to Second Brain backend. Please ensure the Python server is running.
          </Alert>
        )}

        <Container maxWidth="md" sx={{ my: 2, px: 1 }}>
          {/* <Grid container spacing={2}> */}
            {/* Sidebar Navigation */}
            {/* <Grid item xs={12} md={3}>
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
            </Grid> */}

            {/* Main Content */}
            {/* <Grid item xs={12} md={9}> */}
              {/* <Paper elevation={1} sx={{ p: isMobile ? 2 : 3, minHeight: '70vh', maxHeight: '75vh', width: '100%', overflowY: 'auto' }}> */}
                {renderContent()}
              {/* </Paper> */}
            {/* </Grid> */}
          {/* </Grid> */}
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;