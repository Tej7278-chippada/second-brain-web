// src/components/SecondBrainApp.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  // SpeedDial,
  // SpeedDialAction,
  // SpeedDialIcon,
  // Badge,
  useTheme,
  useMediaQuery,
  // Typography,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatInterface from './ChatInterface';
import FileUpload from './FileUpload';
import MemoryManager from './MemoryManager';
import DataVisualizer from './DataVisualizer';
import { secondBrainAPI } from '../services/api';
import {
  Chat,
  CloudUpload,
  // Storage,
  // Psychology,
  // Add,
  // Upload,
  // Memory as MemoryIcon,
  // Description,
  // Dashboard,
  Storage
} from '@mui/icons-material';

// Styled components
// const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
//   '& .MuiToggleButton-root': {
//     borderRadius: '8px',
//     border: 'none',
//     margin: '0 4px',
//     transition: 'all 0.2s',
//     '&.Mui-selected': {
//       backgroundColor: theme.palette.primary.main + '20',
//       color: theme.palette.primary.main,
//       '&:hover': {
//         backgroundColor: theme.palette.primary.main + '30',
//       }
//     },
//     '&:hover': {
//       backgroundColor: theme.palette.action.hover,
//     }
//   }
// }));

// const StyledToggleButton = styled(ToggleButton)({
//   display: 'flex',
//   alignItems: 'center',
//   gap: '8px',
//   padding: '8px 16px',
//   fontWeight: 500,
// });

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
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
      '&:hover': {
        backgroundColor: 'transparent',
      }
    },
    '&:not(.Mui-selected)': {
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      }
    }
  }
}));

const SliderThumb = styled(Box)(({ theme, position }) => ({
  position: 'absolute',
  top: '4px',
  left: position === 'first' ? '4px' : position === 'second' ? '24.5%' : '49%',
  width: '50%',
  height: 'calc(100% - 8px)',
  // backgroundColor: theme.palette.primary.main,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(67, 97, 238, 0.7)' 
    : '#4361ee',
  borderRadius: '22px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 0,
}));

function SecondBrainApp({ user, darkMode }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [systemStatus, setSystemStatus] = useState({
    // documents: 0,
    // memories: 0,
    isConnected: false,
    loading: true,
    error: null
  });
  // const [showSpeedDial, setShowSpeedDial] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const status = await secondBrainAPI.getStatus();
      setSystemStatus({
        // documents: status.documents || 0,
        // memories: status.memories || 0,
        isConnected: status.is_connected || true,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('System status check failed:', error);
      setSystemStatus(prev => ({
        ...prev,
        isConnected: false,
        loading: false,
        error: error.message || 'Connection failed'
      }));
    }
  };

  // const handleTabChange = (event, newTab) => {
  //   if (newTab !== null) {
  //     setActiveTab(newTab);
  //   }
  // };

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
    if (systemStatus.loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!systemStatus.isConnected) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Unable to connect to Second Brain backend. {systemStatus.error}
        </Alert>
      );
    }

    switch (activeTab) {
      case 'chat':
        return <ChatInterface user={user} isMobile={isMobile} />;
      case 'upload':
        return <FileUpload onUploadSuccess={checkSystemStatus} isMobile={isMobile} />;
      case 'memories':
        return <MemoryManager isMobile={isMobile} />;
      case 'data':
        return <DataVisualizer isMobile={isMobile} />;
      default:
        return <ChatInterface user={user} isMobile={isMobile} />;
    }
  };

  // const speedDialActions = [
  //   { icon: <Upload />, name: 'Upload File', onClick: () => setActiveTab('upload') },
  //   { icon: <MemoryIcon />, name: 'Add Memory', onClick: () => {
  //     const memoryInput = prompt('Enter memory command:');
  //     if (memoryInput) {
  //       secondBrainAPI.addMemory(memoryInput).then(() => {
  //         // loadTabStats();
  //         setActiveTab('memories');
  //       });
  //     }
  //   }},
  //   { icon: <Dashboard />, name: 'View Stats', onClick: () => {
  //     secondBrainAPI.getUserStats().then(stats => {
  //       alert(`Documents: ${stats.vector_store?.unique_files || 0}\n` +
  //             `Chunks: ${stats.vector_store?.total_chunks || 0}\n` +
  //             `Memories: ${stats.memories?.total_memories || 0}`);
  //     });
  //   }},
  // ];

  return (
    <Box sx={{ width: '100%', position: 'relative', pb: isMobile ? 8 : 4 }}>
      {/* Welcome message */}
      {/* <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Psychology sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {user?.username || 'User'}!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your Second Brain is ready to assist you
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary.main">
              {stats.documents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Files
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="secondary.main">
              {stats.memories}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Memories
            </Typography>
          </Box>
        </Box>
      </Box> */}

      {/* Navigation Tabs */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <StyledToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          aria-label="section selection"
          size={isMobile ? "small" : "medium"}
        >
          <StyledToggleButton value="chat" aria-label="chat">
            <ChatIcon fontSize={isMobile ? "small" : "medium"} />
            {!isMobile && "Chat"}
          </StyledToggleButton>
          <StyledToggleButton value="upload" aria-label="upload files">
            <UploadIcon fontSize={isMobile ? "small" : "medium"} />
            {!isMobile && "Upload"}
          </StyledToggleButton>
          <StyledToggleButton value="memories" aria-label="memories">
            <MemoryIcon fontSize={isMobile ? "small" : "medium"} />
            {!isMobile && "Memories"}
          </StyledToggleButton>
          <StyledToggleButton value="data" aria-label="data view">
            <DataIcon fontSize={isMobile ? "small" : "medium"} />
            {!isMobile && "Data"}
          </StyledToggleButton>
        </StyledToggleButtonGroup>
      </Box> */}

      {/* Type Selection Toggle with Slider Animation */}
      <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mb: 2 }}>
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

      {/* Status Alert */}
      {!systemStatus.isConnected && !systemStatus.loading && (
        <Alert 
          severity="warning" 
          sx={{ m: 2 }}
          action={
            <Button color="inherit" size="small" onClick={checkSystemStatus}>
              Retry
            </Button>
          }
        >
          Unable to connect to Second Brain backend. Please ensure the server is running.
        </Alert>
      )}

      {/* Main Content */}
      {/* <Paper elevation={1} sx={{ 
        p: isMobile ? 2 : 3, 
        minHeight: '60vh',
        borderRadius: 2
      }}> */}
      <Box sx={{ p: 1 }}>
        {renderContent()}
      </Box>
      {/* </Paper> */}

      {/* Speed Dial for Mobile */}
      {/* {isMobile && (
        <SpeedDial
          ariaLabel="Quick actions"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon />}
          onOpen={() => setShowSpeedDial(true)}
          onClose={() => setShowSpeedDial(false)}
          open={showSpeedDial}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      )} */}
    </Box>
  );
}

export default SecondBrainApp;